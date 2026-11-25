// modules/competition.module.js
import { supabase, getCurrentUser } from './auth.module.js';

export async function fetchAllCompetitions() {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .order('year', { ascending: false })
    .order('country', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchCompetitionPage(year, country) {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('year', Number(year))
    .eq('country', country)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertCompetitionPage(payload) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入後再編輯競賽頁面');

  const record = {
    year: Number(payload.year),
    country: payload.country,
    title: payload.title.trim(),
    subtitle: (payload.subtitle || '').trim(),
    creator_name: (payload.creator_name || '').trim() || null,
    event_date: (payload.event_date || '').trim(),
    location: (payload.location || '').trim(),
    cover_image_url: (payload.cover_image_url || '').trim() || null,
    gallery_items: Array.isArray(payload.gallery_items) ? payload.gallery_items : [],
    overview_md: payload.overview_md || '',
    committee_md: payload.committee_md || '',
    staff_md: payload.staff_md || '',
    extra_subpages: Array.isArray(payload.extra_subpages) ? payload.extra_subpages : [],
    user_id: user.id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('competitions')
    .upsert([record], { onConflict: 'year,country' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cloneCompetitionToNextYear(sourceRecord) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');

  const nextYear = Number(sourceRecord.year) + 1;
  const existing = await fetchCompetitionPage(nextYear, sourceRecord.country);
  if (existing) {
    throw new Error(`${nextYear} 年（${sourceRecord.country}）頁面已存在，請直接切換至該年度編輯`);
  }

  const nextTitle = sourceRecord.title.includes(String(sourceRecord.year))
    ? sourceRecord.title.replaceAll(String(sourceRecord.year), String(nextYear))
    : `${nextYear} ${sourceRecord.title}`;

  return await upsertCompetitionPage({
    ...sourceRecord,
    year: nextYear,
    title: nextTitle,
    event_date: `待定（延續自 ${sourceRecord.year} 年）`
  });
}

export async function deleteCompetitionPage(id) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');
  const { error } = await supabase.from('competitions').delete().eq('id', id);
  if (error) throw error;
}
