// modules/translator.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { supabase, getCurrentUser } from './auth.module.js';

// 1. 保護程式碼區塊與 LaTeX 數學公式，避免翻譯引擎破壞語法
function protectSpecialBlocks(text) {
  const blocks = [];
  const protectedText = (text || '')
    .replace(/```[\s\S]*?```/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`)
    .replace(/\$\$[\s\S]+?\$\$/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`)
    .replace(/\$[^\n$]+?\$/g, (m) => `[[BLOCK_${blocks.push(m) - 1}]]`);
  return { protectedText, blocks };
}

function restoreSpecialBlocks(text, blocks) {
  return (text || '').replace(/\[\[BLOCK_(\d+)\]\]/g, (_, idx) => blocks[Number(idx)] ?? '');
}

// 將超過 450 字元的長段落安全切塊，避免 MyMemory 單次字數限制導致截斷
function splitLongParagraph(para, maxLen = 450) {
  if (para.length <= maxLen) return [para];
  const chunks = [];
  let remaining = para;
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf('。', maxLen);
    if (cut < maxLen * 0.5) cut = remaining.lastIndexOf('. ', maxLen);
    if (cut < maxLen * 0.5) cut = remaining.lastIndexOf(' ', maxLen);
    if (cut < maxLen * 0.3) cut = maxLen;
    else cut += 1;
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

// 2. 免後端免費線上翻譯（MyMemory API）
async function translateWithFreeAPI(text, sourceLang, targetLang) {
  const paragraphs = text.split('\n\n');
  const results = [];
  const src = sourceLang && sourceLang !== 'auto' ? sourceLang : 'zh-TW';

  for (const para of paragraphs) {
    if (!para.trim() || /^\[\[BLOCK_\d+\]\]$/.test(para.trim())) {
      results.push(para);
      continue;
    }

    const chunks = splitLongParagraph(para, 450);
    const translatedChunks = [];

    for (const chunk of chunks) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent(src)}|${encodeURIComponent(targetLang)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`免費翻譯 API 回應異常 (${res.status})`);
      const data = await res.json();
      translatedChunks.push(data?.responseData?.translatedText || chunk);
    }
    results.push(translatedChunks.join(' '));
  }
  return results.join('\n\n');
}

// 3. 通用文字翻譯介面（供競賽頁面、跨國翻譯專頁與自由文本使用）
export async function translateRawText(rawText, { sourceLang = 'zh-TW', targetLang = 'en', mode = 'free', cacheKey = null } = {}) {
  const text = String(rawText || '');
  if (!text.trim()) return { text: '', fromCache: true };

  if (sourceLang && sourceLang !== 'auto' && sourceLang === targetLang) {
    return { text, fromCache: true };
  }

  // 檢查瀏覽器本地快取（避免同一頁反覆消耗翻譯額度）
  if (cacheKey) {
    const cached = sessionStorage.getItem(`tr_cache_${cacheKey}_${targetLang}`);
    if (cached) return { text: cached, fromCache: true };
  }

  const { protectedText, blocks } = protectSpecialBlocks(text);
  let translatedRaw = '';

  if (mode === 'cloud') {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text: protectedText, targetLang }
    });
    if (error) throw new Error(`雲端翻譯失敗：${error.message}`);
    translatedRaw = data.translatedText;

  } else if (mode === 'free') {
    translatedRaw = await translateWithFreeAPI(protectedText, sourceLang, targetLang);

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

  if (cacheKey) {
    try {
      sessionStorage.setItem(`tr_cache_${cacheKey}_${targetLang}`, finalTranslated);
    } catch {}
  }

  return { text: finalTranslated, fromCache: false };
}

// 4. 單篇文章翻譯介面（含資料庫快取讀取與作者自動回寫，供 viewer.html 與 translate.html 共用）
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

  const { text: finalTranslated } = await translateRawText(post.raw_text, {
    sourceLang: post.original_lang || 'zh-TW',
    targetLang,
    mode
  });

  // 若為文章作者本人登入，自動將譯文存入資料庫快取
  const user = await getCurrentUser().catch(() => null);
  if (user && user.id === post.user_id) {
    const updatedCache = { ...(post.translations || {}), [targetLang]: finalTranslated };
    const { error } = await supabase.from('posts').update({ translations: updatedCache }).eq('id', post.id);
    if (!error) post.translations = updatedCache;
  }

  return { text: finalTranslated, fromCache: false };
}
