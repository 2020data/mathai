// config/app.config.js
export const APP_CONFIG = {
  // 【請保留您真實的 Supabase 專案資訊（純英數）】
  SUPABASE_URL: 'https://anrieosjlabjrpqxkbwf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YCOSJ188iooLujN7oieZPg_qVHU0ybs',

  // === Google 站內搜尋設定 ===
  SITE_DOMAIN: '2020data.github.io/mathai',
  GOOGLE_CSE_CX: '',

  // === 全站預設語言 ===
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  IMGBB_API_KEY: '',

  // 右上角選單支援的整頁翻譯語系
  LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文', short: '繁中' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ms', label: 'Bahasa Melayu', short: 'MY (馬來文)' },
    { code: 'ja', label: '日本語', short: '日本語' },
    { code: 'ko', label: '한국어', short: '한국어' },
    { code: 'zh-CN', label: '简体中文', short: '简中' }
  ],

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
