// 【請替換為您的 Supabase 專案資訊】
// 位置：Supabase 後台 -> Project Settings -> API
export const APP_CONFIG = {
  SUPABASE_URL: 'https://你的專案ID.supabase.co',
  SUPABASE_ANON_KEY: '你的_ANON_PUBLIC_KEY',

  // 預設地端翻譯 API（如本機啟動 LibreTranslate 或 Ollama 轉接服務）
  DEFAULT_LOCAL_TRANSLATE_URL: 'http://localhost:5000/translate',

  // 支援的語系清單（顯示於上傳與翻譯選單）
  LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' }
  ]
};
