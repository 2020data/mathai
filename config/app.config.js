// config/app.config.js
export const APP_CONFIG = {
  // 【請填入您的 Supabase 專案資訊】
  SUPABASE_URL: 'https://anrieosjlabjrpqxkbwf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YCOSJ188iooLujN7oieZPg_qVHU0ybs',

  // === Google 站內搜尋設定 ===
  SITE_DOMAIN: '',
  GOOGLE_CSE_CX: '',

  // === 全站預設語言設定（'zh-TW' | 'en' | 'ja'）===
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  // === 免費外部圖床設定（選填 ImgBB API Key）===
  IMGBB_API_KEY: '',

  DEFAULT_LOCAL_TRANSLATE_URL: 'http://localhost:5000/translate',

  // 網站介面語系（導覽列切換用）
  LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文', short: '繁中' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ja', label: '日本語', short: '日本語' }
  ],

  // 跨國多語言翻譯專頁支援語系（可自由增減）
  TRANSLATE_LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文 (Traditional Chinese)', region: '台灣 / 港澳' },
    { code: 'en', label: 'English', region: 'International' },
    { code: 'ms', label: 'Bahasa Melayu', region: 'Malaysia (UTAR)' },
    { code: 'zh-CN', label: '简体中文 (Simplified Chinese)', region: '華語圈' },
    { code: 'ja', label: '日本語 (Japanese)', region: '日本' },
    { code: 'ko', label: '한국어 (Korean)', region: '대한민국' },
    { code: 'id', label: 'Bahasa Indonesia', region: 'Indonesia' },
    { code: 'th', label: 'ไทย (Thai)', region: 'ประเทศไทย' },
    { code: 'vi', label: 'Tiếng Việt', region: 'Việt Nam' },
    { code: 'fr', label: 'Français', region: 'France' },
    { code: 'de', label: 'Deutsch', region: 'Deutschland' },
    { code: 'es', label: 'Español', region: 'España / LatAm' }
  ],

  // === UTAR × 東海大學數學競賽：獨立國家頁面設定 ===
  COMPETITION_COUNTRIES: [
    {
      code: 'TW',
      name: '台灣・東海大學',
      shortName: '台灣 (東海)',
      org: 'Tunghai University, Taiwan',
      accentHex: '#1E3A5F'
    },
    {
      code: 'MY',
      name: '馬來西亞・拉曼大學 (UTAR)',
      shortName: '馬來西亞 (UTAR)',
      org: 'Universiti Tunku Abdul Rahman, Malaysia',
      accentHex: '#7C3A2D'
    }
  ]
};
