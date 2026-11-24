// modules/translator.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { supabase, getCurrentUser } from './auth.module.js';

// 保護程式碼區塊與 LaTeX 數學公式
function protectSpecialBlocks(text) {
  const blocks = [];
  const protectedText = (text || '')
    .replace(/```[\s\S]*?```/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`)
    .replace(/\$\$[\s\S]+?\$\$/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`)
    .replace(/\$[^\n$]+?\$/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`);
  return { protectedText, blocks };
}

function restoreSpecialBlocks(text, blocks) {
  return text.replace(/\[\[BLOCK_(\d+)\]\]/g, (_, idx) => blocks[Number(idx)] ?? '');
}

// 免後端免費線上翻譯（MyMemory API）
async function translateWithFreeAPI(text, sourceLang, targetLang) {
  const paragraphs = text.split('\n\n');
  const results = [];
  const src = sourceLang || 'zh-TW';

  for (const para of paragraphs) {
    if (!para.trim() || /^\[\[BLOCK_\d+\]\]$/.test(para.trim())) {
      results.push(para);
      continue;
    }
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(para.slice(0, 480))}&langpair=${src}|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json();
    results.push(data?.responseData?.translatedText || para);
  }
  return results.join('\n\n');
}

export async function translatePost(post, targetLang, mode = 'free') {
  if (!post.raw_text) {
    throw new Error('目前僅支援 Markdown / LaTeX 文字內容的線上即時翻譯');
  }

  if (post.original_lang === targetLang) {
    return { text: post.raw_text, fromCache: true };
  }

  if (post.translations && post.translations[targetLang]) {
    return { text: post.translations[targetLang], fromCache: true };
  }

  const { protectedText, blocks } = protectSpecialBlocks(post.raw_text);
  let translatedRaw = '';

  if (mode === 'cloud') {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text: protectedText, targetLang }
    });
    if (error) throw new Error(`雲端翻譯失敗：${error.message}`);
    translatedRaw = data.translatedText;

  } else if (mode === 'free') {
    translatedRaw = await translateWithFreeAPI(protectedText, post.original_lang, targetLang);

  } else if (mode === 'local') {
    const endpoint = localStorage.getItem('local_translate_url') || APP_CONFIG.DEFAULT_LOCAL_TRANSLATE_URL;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: protectedText, source: 'auto', target: targetLang, format: 'text' })
    });
    if (!res.ok) throw new Error(`地端翻譯連線失敗 (${res.status})，請確認本機服務已啟動並開啟 CORS`);
    const data = await res.json();
    translatedRaw = data.translatedText || data.result;
  }

  const finalTranslated = restoreSpecialBlocks(translatedRaw, blocks);

  // 若為文章作者本人登入，自動將譯文存入資料庫快取
  const user = await getCurrentUser();
  if (user && user.id === post.user_id) {
    const updatedCache = { ...(post.translations || {}), [targetLang]: finalTranslated };
    const { error } = await supabase.from('posts').update({ translations: updatedCache }).eq('id', post.id);
    if (!error) post.translations = updatedCache;
  }

  return { text: finalTranslated, fromCache: false };
}
