// modules/translator.module.js
import { APP_CONFIG } from '../config/app.config.js';

const ORIGINAL_TEXT_MAP = new WeakMap();
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION']);
const BATCH_SEPARATOR = '\n§§§\n';

let isTranslating = false;

function shouldSkipNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.closest('.katex, .katex-display, .katex-html, .katex-mathml, [data-no-translate], code, pre, svg')) {
    return true;
  }
  const text = node.nodeValue;
  if (!text || !text.trim()) return true;
  // 純數字、符號或極短標點不需翻譯
  if (/^[\d\s.,:;!?/\\\-—–·•()[\]{}+=*&^%$#@~`'"|<>]+$/.test(text.trim())) return true;
  return false;
}

function collectTextNodes(root = document.body) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current;
  while ((current = walker.nextNode())) {
    if (!shouldSkipNode(current)) {
      if (!ORIGINAL_TEXT_MAP.has(current)) {
        ORIGINAL_TEXT_MAP.set(current, current.nodeValue);
      }
      nodes.push(current);
    }
  }
  return nodes;
}

function showTranslateToast(message, autoHideMs = 0) {
  let toast = document.getElementById('pageTranslateToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pageTranslateToast';
    toast.setAttribute('data-no-translate', 'true');
    toast.className = 'fixed bottom-5 right-5 z-[9999] bg-stone-900 text-[#F6F4EF] text-xs font-mono-meta px-4 py-2.5 rounded-full shadow-lg transition-opacity duration-300';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  if (autoHideMs > 0) {
    setTimeout(() => {
      if (toast) toast.style.opacity = '0';
    }, autoHideMs);
  }
}

async function fetchTranslatedText(text, sourceLang, targetLang) {
  const cacheKey = `pg_tr_${targetLang}_${text}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  const src = sourceLang || 'zh-TW';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(src)}|${encodeURIComponent(targetLang)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`翻譯服務回應異常 (${res.status})`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText || text;

  try {
    sessionStorage.setItem(cacheKey, translated);
  } catch {}
  return translated;
}

/**
 * 直接翻譯整頁 DOM（右上角語系選單觸發）
 */
export async function translateCurrentPage(targetLang) {
  const defaultLang = APP_CONFIG.DEFAULT_UI_LANG || 'zh-TW';
  const nodes = collectTextNodes(document.body);

  // 切回預設語系：直接還原所有原始文字
  if (!targetLang || targetLang === defaultLang) {
    for (const node of nodes) {
      const orig = ORIGINAL_TEXT_MAP.get(node);
      if (orig !== undefined) node.nodeValue = orig;
    }
    showTranslateToast('已還原預設語言', 1800);
    return;
  }

  if (isTranslating) return;
  isTranslating = true;
  showTranslateToast(`整頁翻譯中 (${targetLang})...`);

  try {
    // 將文字節點分批合併（每批上限 420 字元，避開免費 API 字數限制）
    const batches = [];
    let currentBatch = [];
    let currentLen = 0;

    for (const node of nodes) {
      const orig = ORIGINAL_TEXT_MAP.get(node) ?? node.nodeValue;
      const trimmed = orig.trim();
      const cacheKey = `pg_tr_${targetLang}_${trimmed}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        node.nodeValue = orig.replace(trimmed, cached);
        continue;
      }

      if (currentLen + trimmed.length + BATCH_SEPARATOR.length > 420 && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
        currentLen = 0;
      }
      currentBatch.push({ node, orig, trimmed });
      currentLen += trimmed.length + BATCH_SEPARATOR.length;
    }
    if (currentBatch.length > 0) batches.push(currentBatch);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      showTranslateToast(`整頁翻譯中 (${i + 1}/${batches.length})...`);

      const joined = batch.map(item => item.trimmed).join(BATCH_SEPARATOR);
      const translatedJoined = await fetchTranslatedText(joined, defaultLang, targetLang);
      const parts = translatedJoined.split(/\n?§§§\n?/);

      if (parts.length === batch.length) {
        batch.forEach((item, idx) => {
          const out = parts[idx].trim() || item.trimmed;
          item.node.nodeValue = item.orig.replace(item.trimmed, out);
          try { sessionStorage.setItem(`pg_tr_${targetLang}_${item.trimmed}`, out); } catch {}
        });
      } else {
        // 若分隔符號被引擎改寫，退回逐句翻譯確保對齊
        for (const item of batch) {
          const out = await fetchTranslatedText(item.trimmed.slice(0, 450), defaultLang, targetLang);
          item.node.nodeValue = item.orig.replace(item.trimmed, out);
        }
      }
    }

    showTranslateToast(`整頁翻譯完成 (${targetLang})`, 2200);
  } catch (err) {
    showTranslateToast(`翻譯暫時無法連線：${err.message}`, 3500);
  } finally {
    isTranslating = false;
  }
}

/**
 * 頁面載入或動態資料渲染完成後，若使用者曾選取非預設語系，自動翻譯整頁
 */
export function autoTranslateIfNeeded(delayMs = 450) {
  const savedLang = localStorage.getItem('portal_ui_lang');
  const defaultLang = APP_CONFIG.DEFAULT_UI_LANG || 'zh-TW';
  if (savedLang && savedLang !== defaultLang) {
    setTimeout(() => translateCurrentPage(savedLang), delayMs);
  }
}
