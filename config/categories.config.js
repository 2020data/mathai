// 網站主分類設定（預設：數學、人工智慧）
// 新手擴充方式：直接複製其中一個 { ... } 區塊貼上即可新增分類
export const CATEGORIES = [
  {
    id: 'math',
    name: '數學 (Mathematics)',
    icon: '∑',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    description: '微積分、線性代數、機率統計與數學推導'
  },
  {
    id: 'ai',
    name: '人工智慧 (AI)',
    icon: '🧠',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    description: '機器學習、深度學習、LLM 與演算法研究'
  }
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || {
    id, name: id, icon: '📄', badgeClass: 'bg-gray-100 text-gray-800 border-gray-200'
  };
}
