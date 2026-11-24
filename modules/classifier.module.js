// modules/classifier.module.js

// 預設推薦子分類清單（供手動輸入選單提示用，也可自由輸入新名稱）
export const SUGGESTED_SUBCATEGORIES = {
  math: ['微積分與分析', '線性代數', '機率與統計', '數論與代數', '最佳化與幾何', '數學綜合'],
  ai: ['深度學習與架構', '大型語言模型 (LLM)', '機器學習與優化', '強化學習', '生成式與擴散模型', 'AI 綜合']
};

// 關鍵字權重規則表（涵蓋中、英、日文與常見數學/AI 術語）
const CLASSIFICATION_RULES = [
  // === 數學主分類 (math) ===
  {
    category: 'math',
    subcategory: '微積分與分析',
    keywords: ['積分', '微分', '導數', '極限', '泰勒', '傅立葉', '級數', '高斯積分', '極座標', 'taylor', 'fourier', 'integral', 'derivative', 'calculus', '\\int', '\\sum']
  },
  {
    category: 'math',
    subcategory: '線性代數',
    keywords: ['矩陣', '向量', '特徵值', '特徵向量', '奇異值', 'svd', '正交', '內積', '柯西', 'cauchy-schwarz', 'eigenvalue', 'eigenvector', 'matrix', 'vector', 'linear algebra', '\\det']
  },
  {
    category: 'math',
    subcategory: '機率與統計',
    keywords: ['機率', '統計', '貝氏', '常態分佈', '中央極限定理', '期望值', '變異數', '隨機變數', '先驗', '後驗', 'bayes', 'probability', 'gaussian', 'clt', 'distribution']
  },
  {
    category: 'math',
    subcategory: '數論與代數',
    keywords: ['質數', '素數', '同餘', '費馬', '歐拉', '恆等式', '群論', '加密', 'rsa', 'euler', 'fermat', 'prime', 'modulo', '\\equiv', 'フェルマー', '素数']
  },
  {
    category: 'math',
    subcategory: '最佳化與幾何',
    keywords: ['拉格朗日', '乘數法', '極值', '約束條件', '凸優化', 'lagrange', 'multiplier', 'optimization', 'geometry']
  },

  // === 人工智慧主分類 (ai) ===
  {
    category: 'ai',
    subcategory: '大型語言模型 (LLM)',
    keywords: ['transformer', 'attention', '注意力機制', 'llm', '語言模型', 'lora', '低秩', '微調', 'rag', '詞元', 'token', 'softmax', '向量檢索', '餘弦相似度', 'コサイン類似度', 'ベクトル検索', 'rlhf']
  },
  {
    category: 'ai',
    subcategory: '深度學習與架構',
    keywords: ['神經網路', '反向傳播', '鏈鎖律', '批次正規化', '殘差', 'resnet', '跳躍連接', 'cnn', 'rnn', '激活函數', '梯度消失', 'backpropagation', 'batch normalization', 'residual', 'deep learning', 'pytorch']
  },
  {
    category: 'ai',
    subcategory: '機器學習與優化',
    keywords: ['梯度下降', '損失函數', '交叉熵', '學習率', 'kl散度', 'kl divergence', 'kullback-leibler', 'gradient descent', 'cross-entropy', 'loss', 'machine learning', 'vae']
  },
  {
    category: 'ai',
    subcategory: '生成式與擴散模型',
    keywords: ['擴散模型', 'ddpm', '加噪', '去噪', '生成模型', 'diffusion', 'gan', 'generative']
  },
  {
    category: 'ai',
    subcategory: '強化學習',
    keywords: ['強化學習', '貝爾曼', '馬可夫', 'mdp', '獎勵', '折扣因子', 'q-learning', 'bellman', 'reinforcement', 'reward', 'policy']
  }
];

/**
 * 自動分析標題與內文，回傳最適合的主分類 (math / ai) 與子分類
 */
export function autoClassifyPost(title = '', rawText = '') {
  const titleLower = (title || '').toLowerCase();
  const bodyLower = (rawText || '').toLowerCase();

  let bestRule = null;
  let bestScore = 0;
  const categoryTotals = { math: 0, ai: 0 };

  for (const rule of CLASSIFICATION_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      const k = kw.toLowerCase();
      if (titleLower.includes(k)) score += 5; // 標題命中權重較高
      if (bodyLower.includes(k)) score += 2;
    }
    categoryTotals[rule.category] += score;
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  // 若有明確命中的規則
  if (bestRule && bestScore > 0) {
    return {
      category: bestRule.category,
      subcategory: bestRule.subcategory,
      matched: true
    };
  }

  // 若未命中特定子分類，但偏向 AI 或 Math
  if (categoryTotals.ai > categoryTotals.math) {
    return { category: 'ai', subcategory: 'AI 綜合', matched: false };
  }
  return { category: 'math', subcategory: '數學綜合', matched: false };
}
