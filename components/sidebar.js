// components/sidebar.js
import { CATEGORIES } from '../config/categories.config.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSidebar(containerEl, posts, state, { onSelect, onAutoClassifyAll, currentUser }) {
  // 統計各主分類與子分類的文章數量
  const tree = {};
  for (const cat of CATEGORIES) {
    tree[cat.id] = { total: 0, subs: {} };
  }

  for (const post of posts) {
    const catId = tree[post.category] ? post.category : 'math';
    const subName = (post.subcategory || '').trim() || '未分類';
    tree[catId].total += 1;
    tree[catId].subs[subName] = (tree[catId].subs[subName] || 0) + 1;
  }

  const isAllActive = state.category === 'all' && state.subcategory === 'all';
  const myPostsCount = currentUser ? posts.filter(p => p.user_id === currentUser.id).length : 0;

  containerEl.innerHTML = `
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-20">
      <div class="flex items-center justify-between mb-3 pb-2 border-b">
        <h2 class="text-sm font-bold text-slate-700 tracking-wide">📂 分類目錄</h2>
        <span class="text-xs text-slate-400">共 ${posts.length} 篇</span>
      </div>

      <!-- 全部文章 -->
      <button data-cat="all" data-sub="all"
        class="sidebar-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium mb-2 transition
        ${isAllActive ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'}">
        <span>📚 全部文章</span>
        <span class="text-xs ${isAllActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'} px-2 py-0.5 rounded-full">${posts.length}</span>
      </button>

      <!-- 主分類（數學、人工智慧）與動態子分類樹 -->
      <div class="space-y-3">
        ${CATEGORIES.map(cat => {
          const group = tree[cat.id];
          const isMainActive = state.category === cat.id && state.subcategory === 'all';
          const subEntries = Object.entries(group.subs).sort((a, b) => b[1] - a[1]);

          return `
            <div>
              <button data-cat="${cat.id}" data-sub="all"
                class="sidebar-item w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition
                ${isMainActive ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-slate-100'}">
                <span class="truncate">${cat.icon} ${cat.name}</span>
                <span class="text-xs ${isMainActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'} px-2 py-0.5 rounded-full">${group.total}</span>
              </button>

              ${subEntries.length > 0 ? `
                <ul class="mt-1 ml-3 pl-3 border-l-2 border-slate-100 space-y-1">
                  ${subEntries.map(([subName, count]) => {
                    const isSubActive = state.category === cat.id && state.subcategory === subName;
                    return `
                      <li>
                        <button data-cat="${cat.id}" data-sub="${escapeHtml(subName)}"
                          class="sidebar-item w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition
                          ${isSubActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}">
                          <span class="truncate"># ${escapeHtml(subName)}</span>
                          <span class="text-[11px] text-slate-400">${count}</span>
                        </button>
                      </li>
                    `;
                  }).join('')}
                </ul>
              ` : `
                <p class="ml-6 mt-1 text-xs text-slate-400">尚無文章</p>
              `}
            </div>
          `;
        }).join('')}
      </div>

      <!-- 已登入作者專用：一鍵自動整理既有文章分類 -->
      ${currentUser && myPostsCount > 0 ? `
        <div class="mt-5 pt-4 border-t">
          <button id="autoClassifyAllBtn"
            class="w-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-100 transition font-medium">
            ✨ 自動分類我的文章 (${myPostsCount} 篇)
          </button>
          <p id="autoClassifyStatus" class="text-[11px] text-slate-500 mt-1.5 text-center"></p>
        </div>
      ` : ''}
    </div>
  `;

  // 綁定分類點擊事件
  containerEl.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      onSelect(btn.dataset.cat, btn.dataset.sub);
    });
  });

  // 綁定一鍵自動分類事件
  document.getElementById('autoClassifyAllBtn')?.addEventListener('click', () => {
    onAutoClassifyAll();
  });
}
