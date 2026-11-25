// modules/icons.module.js
const SVG_PATHS = {
  // 網站幾何品牌標誌
  brand: `<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 15h18"/><path d="M9 3v18"/>`,
  // 數學（極簡積分/幾何符號）
  math: `<path d="M18 5H7l6 7-6 7h11"/>`,
  // 人工智慧（極簡節點矩陣）
  ai: `<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.8 7.2l3.4 9"/><path d="M16.2 7.2l-3.4 9"/><path d="M8 6h8"/>`,
  // 全部典藏
  grid: `<rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><rect x="14" y="14" width="7" height="7" rx="0.5"/>`,
  // 新增內容
  plus: `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  // 語言 / 地球
  globe: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>`,
  // 圖片 / 攝影
  image: `<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5L5 20"/>`,
  // 外部連結
  link: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  // 上傳檔案
  upload: `<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/>`,
  // 分類標籤
  tag: `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/>`,
  // 自動整理 / 羅盤校準（取代 AI 星星）
  compass: `<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.2 13.2 8.5 15.5 10.8 10.8 15.5 8.5"/>`,
  // 雙語並排
  columns: `<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16"/>`,
  // 刪除
  trash: `<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/>`,
  // 返回
  arrowLeft: `<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>`,
  // 還原
  reset: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`,
  // 登出
  logout: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>`,
  // 圖庫
  gallery: `<rect x="3" y="5" width="14" height="14" rx="1"/><path d="M7 19v2h14V7h-2"/>`
};

export function icon(name, className = 'w-4 h-4') {
  const path = SVG_PATHS[name] || SVG_PATHS.grid;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="${className} shrink-0" aria-hidden="true">${path}</svg>`;
}
