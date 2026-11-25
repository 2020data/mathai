// components/sidebar.js
import { CATEGORIES, getCategoryLabel } from '../config/categories.config.js';
import { getUiLang, t } from '../modules/i18n.module.js';
import { icon } from '../modules/icons.module.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSidebar(containerEl, posts, state, { onSelect, onAutoClassifyAll, currentUser }) {
  const lang = getUiLang();
  const tree = {};
  for (const cat of CATEGORIES) {
    tree[cat.id] = { total: 0, subs: {} };
  }

  for (const post of posts) {
    const catId = tree[post.category] ? post.category : 'math';
    const subName = (post.subcategory || '').trim() || t('uncategorized');
    tree[catId].total += 1;
    tree[catId].subs[subName] = (tree[catId].subs[subName] || 0) + 1;
  }

  const isAllActive = state.category === 'all' && state.subcategory === 'all';
  const myPostsCount = currentUser ? posts.filter(p => p.user_id === currentUser.id).length : 0;

  containerEl.innerHTML = `
    <div class="bg-white/80 backdrop-blur-sm rounded-lg border border-[#E4E0D6] p-5 sticky top-24">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#E4E0D6]">
        <span class="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-stone-500">${t('sidebarTitle')}</span>
        <span class="font-mono-meta text-[11px] text-stone-400">${posts.length} ${t('totalUnit')}</span>
      </div>

      <button data-cat="all" data-sub="all"
        class="sidebar-item w-full flex items-center justify-between px-3 py-2 rounded text-sm mb-4 transition
        ${isAllActive ? 'bg-stone-900 text-[#F6F4EF] font-medium' : 'text-stone-700 hover:bg-[#EFECE5]'}">
        <span class="flex items-center gap-2.5">${icon('grid', 'w-4 h-4')} ${t('allArticles')}</span>
        <span class="font-mono-meta text-xs ${isAllActive ? 'text-stone-300' : 'text-stone-400'}">${posts.length}</span>
      </button>

      <div class="space-y-4">
        ${CATEGORIES.map(cat => {
          const group = tree[cat.id];
          const isMainActive = state.category === cat.id && state.subcategory === 'all';
          const subEntries = Object.entries(group.subs).sort((a, b) => b[1] - a[1]);

          return `
            <div>
              <button data-cat="${cat.id}" data-sub="all"
                class="sidebar-item w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition
                ${isMainActive ? 'bg-stone-900 text-[#F6F4EF]' : 'text-stone-800 hover:bg-[#EFECE5]'}">
                <span class="flex items-center gap-2.5 truncate">
                  ${icon(cat.iconKey, 'w-4 h-4')}
                  <span>${getCategoryLabel(cat, lang)}</span>
                </span>
                <span class="font-mono-meta text-xs ${isMainActive ? 'text-stone-300' : 'text-stone-400'}">${group.total}</span>
              </button>

              ${subEntries.length > 0 ? `
                <ul class="mt-1.5 ml-4 pl-3 border-l border-[#E4E0D6] space-y-1">
                  ${subEntries.map(([subName, count]) => {
                    const isSubActive = state.category === cat.id && state.subcategory === subName;
                    return `
                      <li>
                        <button data-cat="${cat.id}" data-sub="${escapeHtml(subName)}"
                          class="sidebar-item w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition
                          ${isSubActive ? 'bg-[#EFECE5] text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900 hover:bg-[#F6F4EF]'}">
                          <span class="truncate">${escapeHtml(subName)}</span>
                          <span class="font-mono-meta text-[11px] text-stone-400">${count}</span>
                        </button>
                      </li>
                    `;
                  }).join('')}
                </ul>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      ${currentUser && myPostsCount > 0 ? `
        <div class="mt-6 pt-4 border-t border-[#E4E0D6]">
          <button id="autoClassifyAllBtn"
            class="w-full inline-flex items-center justify-center gap-2 text-xs text-stone-700 border border-[#D8D3C6] bg-[#F6F4EF] px-3 py-2 rounded hover:bg-stone-900 hover:text-[#F6F4EF] hover:border-stone-900 transition">
            ${icon('compass', 'w-3.5 h-3.5')}
            <span>${t('autoClassifyMy')} (${myPostsCount})</span>
          </button>
          <p id="autoClassifyStatus" class="font-mono-meta text-[11px] text-stone-500 mt-2 text-center"></p>
        </div>
      ` : ''}
    </div>
  `;

  containerEl.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => onSelect(btn.dataset.cat, btn.dataset.sub));
  });

  document.getElementById('autoClassifyAllBtn')?.addEventListener('click', onAutoClassifyAll);
}
