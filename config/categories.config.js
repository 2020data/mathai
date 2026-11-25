// config/categories.config.js
export const CATEGORIES = [
  {
    id: 'math',
    name: { 'zh-TW': '數學', 'en': 'Mathematics', 'ja': '数学' },
    iconKey: 'math',
    monogram: '∑',
    badgeClass: 'text-[#1E3A5F] bg-[#1E3A5F]/8 border-[#1E3A5F]/20',
    accentHex: '#1E3A5F',
    description: {
      'zh-TW': '微積分、線性代數、機率統計與數學推導',
      'en': 'Calculus, Linear Algebra, Probability & Proofs',
      'ja': '微分積分・線形代数・確率統計と数理証明'
    }
  },
  {
    id: 'ai',
    name: { 'zh-TW': '人工智慧', 'en': 'Artificial Intelligence', 'ja': '人工知能' },
    iconKey: 'ai',
    monogram: 'Φ',
    badgeClass: 'text-[#7C3A2D] bg-[#7C3A2D]/8 border-[#7C3A2D]/20',
    accentHex: '#7C3A2D',
    description: {
      'zh-TW': '機器學習、深度學習、LLM 與演算法研究',
      'en': 'Machine Learning, Deep Learning, LLMs & Algorithms',
      'ja': '機械学習・深層学習・LLMとアルゴリズム研究'
    }
  },
  {
    id: 'competition',
    name: {
      'zh-TW': 'UTAR × 東海數學競賽',
      'en': 'UTAR × THU Math Competition',
      'ja': 'UTAR × 東海大学 数学競技'
    },
    iconKey: 'trophy',
    monogram: 'Ω',
    badgeClass: 'text-[#2E4F3E] bg-[#2E4F3E]/10 border-[#2E4F3E]/25',
    accentHex: '#2E4F3E',
    description: {
      'zh-TW': '拉曼大學（UTAR）與台灣東海大學歷年數學競賽紀錄與花絮',
      'en': 'Annual UTAR & Tunghai University Mathematics Competition Archive',
      'ja': 'UTARと東海大学の歴代数学競技会アーカイブ'
    }
  }
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || {
    id,
    name: { 'zh-TW': id, 'en': id, 'ja': id },
    iconKey: 'grid',
    monogram: '§',
    badgeClass: 'text-stone-700 bg-stone-100 border-stone-200',
    accentHex: '#57534E'
  };
}

export function getCategoryLabel(cat, lang = 'zh-TW') {
  if (!cat) return '';
  if (typeof cat.name === 'string') return cat.name;
  return cat.name[lang] || cat.name['zh-TW'] || cat.id;
}
