// modules/media.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { uploadFile } from './db.module.js';

// 精選免費藝術與建築感 Unsplash 外部圖片（無版權疑慮、免儲存空間）
export const CURATED_COVERS = [
  {
    label: '建築幾何光影（數學）',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '極簡線性結構（數學）',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '抽象曲面雕塑（幾何）',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '光學稜鏡與矩陣（AI）',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '深色脈絡節點（深度學習）',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '靜謐書桌與紙張（研究筆記）',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'
  }
];

// 驗證外部圖片網址安全性（僅允許 http / https，防止 javascript: XSS）
export function validateImageUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('圖片網址必須為 https:// 或 http:// 開頭');
    }
    return parsed.href;
  } catch {
    throw new Error('請輸入有效的外部圖片網址（例如 https://...）');
  }
}

// 上傳照片：優先使用免費外部圖床 ImgBB，若未填 Key 則自動退回 Supabase 免費空間
export async function uploadCoverImage(file) {
  if (!file) throw new Error('請選擇圖片檔案');
  if (!file.type.startsWith('image/')) throw new Error('僅支援上傳圖片格式（JPG / PNG / WebP）');
  if (file.size > 10 * 1024 * 1024) throw new Error('圖片大小請勿超過 10MB');

  const imgbbKey = (APP_CONFIG.IMGBB_API_KEY || '').trim();
  if (imgbbKey) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!data?.success || !data?.data?.url) {
      throw new Error('外部圖床 ImgBB 上傳失敗，請檢查 API Key');
    }
    return { url: data.data.url, provider: 'ImgBB 外部圖床' };
  }

  // Fallback：使用既有的 Supabase Storage 免費額度
  const uploaded = await uploadFile(file);
  return { url: uploaded.url, provider: 'Supabase Storage' };
}
