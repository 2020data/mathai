// modules/db.module.js
import { supabase, getCurrentUser } from './auth.module.js';

// 取得文章列表（支援分類篩選）
export async function fetchPosts(category = 'all') {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (category !== 'all') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// 取得單篇文章
export async function fetchPostById(id) {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// 上傳檔案至 Supabase Storage
export async function uploadFile(file) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入後再上傳檔案');

  const ext = file.name.split('.').pop().toLowerCase();
  const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('uploads').upload(filePath, file);
  if (error) throw error;

  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
  return { url: data.publicUrl, ext };
}

// 寫入新文章紀錄
export async function createPost(postData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');

  const { data, error } = await supabase.from('posts').insert([{
    ...postData,
    user_id: user.id,
    author_email: user.email
  }]).select().single();

  if (error) throw error;
  return data;
}

// 刪除文章（若附帶上傳檔案也會嘗試一併移除）
export async function deletePost(id, fileUrl = null) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  if (fileUrl && fileUrl.includes('/storage/v1/object/public/uploads/')) {
    const filePath = fileUrl.split('/storage/v1/object/public/uploads/')[1];
    if (filePath) {
      await supabase.storage.from('uploads').remove([decodeURIComponent(filePath)]);
    }
  }
}
