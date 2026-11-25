// config/app.config.js
export const APP_CONFIG = {
  // 【請填入您的 Supabase 專案資訊】
  SUPABASE_URL: 'https://anrieosjlabjrpqxkbwf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YCOSJ188iooLujN7oieZPg_qVHU0ybs',

  // === Google 站內搜尋設定 ===
  // 留空 '' 時會自動抓目前網址網域；若部署在 GitHub Pages 可填如 'username.github.io/repo-name'
  SITE_DOMAIN: '',
  // 選填：若有申請 Google Programmable Search Engine (CSE)，填入 cx 代碼即可啟用專屬搜尋頁
  GOOGLE_CSE_CX: '',

  // === 全站預設語言設定（'zh-TW' | 'en' | 'ja'）===
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  // === 免費外部圖床設定（選填 ImgBB API Key）===
  IMGBB_API_KEY: '',

  DEFAULT_LOCAL_TRANSLATE_URL: 'http://localhost:5000/translate',

  LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文', short: '繁中' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ja', label: '日本語', short: '日本語' }
  ],

  // === UTAR × 東海大學數學競賽：獨立國家頁面設定（未來可自由新增國家）===
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
