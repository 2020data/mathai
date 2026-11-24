import { APP_CONFIG } from '../config/app.config.js';
import { supabase } from './auth.module.js';

export async function translateContent(text, targetLang, mode = 'local') {
  if (!text) throw new Error('目前僅支援純文字 / Markdown / LaTeX 內容的即時翻譯');

  if (mode === 'local') {
    // 地端翻譯模式（需於本機啟動 LibreTranslate 或支援 CORS 的本機翻譯服務）
    const endpoint = localStorage.getItem('local_translate_url') || APP_CONFIG.DEFAULT_LOCAL_TRANSLATE_URL;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'auto', target: targetLang, format: 'text' })
    });
    if (!res.ok) throw new Error(`地端翻譯連線失敗 (${res.status})，請確認本機 API 已啟動並開啟 CORS`);
    const data = await res.json();
    return data.translatedText || data.result;
  } else {
    // 雲端外部 API 模式（透過 Supabase Edge Function 隱藏 API Key）
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, targetLang }
    });
    if (error) throw new Error('雲端翻譯失敗，請確認已部署 Supabase Edge Function');
    return data.translatedText;
  }
}
