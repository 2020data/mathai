// modules/translator.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { supabase } from './auth.module.js';

// 1. 保護 LaTeX 公式與程式碼區塊，避免被翻譯引擎破壞
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

// 2. 免後端免費線上翻譯（MyMemory API，自動依段落切分避免超過 500 字元限制）
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

// 3. 統一對外翻譯介面（含快取讀取與寫入）
export async function translatePost(post, targetLang, mode = 'free') {
  if (!post.raw_text) {
    throw new Error('目前僅支援 Markdown / LaTeX 文字內容的線上即時翻譯');
  }

  // 若選擇的目標語系與原文相同，直接回傳原文
  if (post.original_lang === targetLang) {
    return { text: post.raw_text, fromCache: true };
  }

  // 優先檢查資料庫是否已有翻譯快取
  if (post.translations && post.translations[targetLang]) {
    return { text: post.translations[targetLang], fromCache: true };
  }

  const { protectedText, blocks } = protectSpecialBlocks(post.raw_text);
  let translatedRaw = '';

  if (mode === 'cloud') {
    // 雲端模式：呼叫安全的 Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text: protectedText, targetLang }
    });
    if (error) throw new Error(`雲端翻譯失敗：${error.message}`);
    translatedRaw = data.translatedText;

  } else if (mode === 'free') {
    // 免後端免費線上模式：直接在 GitHub Pages 運作
    translatedRaw = await translateWithFreeAPI(protectedText, post.original_lang, targetLang);

  } else if (mode === 'local') {
    // 地端 API 模式（LibreTranslate / Ollama）
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

  // 若目前為文章作者本人登入，順便將譯文回存至資料庫快取（下次讀取免再耗費額度）
  const updatedCache = { ...(post.translations || {}), [targetLang]: finalTranslated };
  await supabase.from('posts').update({ translations: updatedCache }).eq('id', post.id);
  post.translations = updatedCache;

  return { text: finalTranslated, fromCache: false };
}
