// config/app.config.js
export const APP_CONFIG = {
  // 【請填入您的 Supabase 專案資訊】
  SUPABASE_URL: 'https://anrieosjlabjrpqxkbwf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YCOSJ188iooLujN7oieZPg_qVHU0ybs',

  // === 1. 全站預設語言設定（可改為 'zh-TW' | 'en' | 'ja'）===
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  // === 2. 免費外部圖床設定（選填）===
  // 可至 https://api.imgbb.com/ 免費申請 API Key 貼於此處，照片將完全存於外部免費圖床；
  // 若留空 ''，上傳照片時系統會自動退回使用 Supabase 免費儲存空間，同樣可正常運作。
  IMGBB_API_KEY: '',

  // 預設地端翻譯 API
  DEFAULT_LOCAL_TRANSLATE_URL: 'http://localhost:5000/translate',

  // 支援語系清單
  LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文', short: '繁中' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ja', label: '日本語', short: '日本語' }
  ]
};
