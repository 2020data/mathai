// components/navbar.js
import { APP_CONFIG } from '../config/app.config.js';
import { getCurrentUser, signOut } from '../modules/auth.module.js';
import { getUiLang, setUiLang, t } from '../modules/i18n.module.js';
import { icon } from '../modules/icons.module.js';

export async function mountNavbar(targetId = 'navbar') {
  const el = document.getElementById(targetId);
  if (!el) return;

  const [user, currentLang] = [await getCurrentUser().catch(() => null), getUiLang()];
  document.documentElement.lang = currentLang;

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get('cat');
  const isCompPage = path.includes('competition.html');
  const isTranslatePage = path.includes('translate.html');

  el.innerHTML = `
    <header class="bg-[#F6F4EF]/95 backdrop-blur-md border-b border-[#E4E0D6] sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-5">
        <!-- 第一列：品牌 + Google 站內搜尋 + 語系 + 登入/上傳 -->
        <div class="h-14 flex items-center justify-between gap-3">
          <a href="./index.html" class="flex items-center gap-2.5 group shrink-0">
            <span class="w-8 h-8 rounded border border-stone-900/80 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-[#F6F4EF] transition">
              ${icon('brand', 'w-4 h-4')}
            </span>
            <span class="font-serif-editorial text-lg font-semibold tracking-tight text-stone-900">${t('siteTitle')}</span>
          </a>

          <div class="flex items-center gap-2 sm:gap-3 text-sm">
            <form id="googleSearchForm" class="hidden md:flex items-center border border-[#DDD8CC] bg-white rounded-full px-3 py-1 focus-within:border-stone-900 transition">
              ${icon('search', 'w-3.5 h-3.5 text-stone-400 mr-1.5')}
              <input id="googleSearchInput" type="search" placeholder="Google 搜尋全站..."
                class="bg-transparent text-xs text-stone-700 w-36 lg:w-48 focus:outline-none" />
            </form>

            <div class="flex items-center gap-1 border border-[#DDD8CC] bg-white/80 rounded-full px-2 py-1 text-xs text-stone-600">
              ${icon('globe', 'w-3.5 h-3.5 text-stone-500')}
              <select id="uiLangSwitcher" aria-label="Language" class="bg-transparent focus:outline-none cursor-pointer font-medium text-stone-700">
                ${APP_CONFIG.LANGUAGES.map(l => `
                  <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.short}</option>
                `).join('')}
              </select>
            </div>

            ${user ? `
              <a href="./upload.html" class="inline-flex items-center gap-1 bg-stone-900 text-[#F6F4EF] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-stone-700 transition whitespace-nowrap">
                ${icon('plus', 'w-3.5 h-3.5')}
                <span class="hidden sm:inline">${t('navUpload')}</span>
              </a>
              <a href="./batch-upload.html" title="批次打包上傳" class="inline-flex items-center gap-1 border border-stone-900/30 bg-white text-stone-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-stone-900 hover:text-white transition whitespace-nowrap">
                ${icon('layers', 'w-3.5 h-3.5')}
                <span class="hidden lg:inline">批次上傳</span>
              </a>
              <button id="logoutBtn" title="${user.email}" class="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition">
                ${icon('logout', 'w-3.5 h-3.5')}
              </button>
            ` : `
              <a href="./login.html" class="border border-stone-900 text-stone-900 px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-stone-900 hover:text-[#F6F4EF] transition whitespace-nowrap">
                ${t('navLogin')}
              </a>
            `}
          </div>
        </div>

        <!-- 第二列：高顯眼度類別與跨國翻譯快速導覽列 -->
        <nav class="py-2.5 border-t border-[#E4E0D6]/80 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          <a href="./competition.html"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shadow-sm hover:-translate-y-0.5 hover:shadow
            ${isCompPage
              ? 'bg-[#2E4F3E] text-white ring-2 ring-[#2E4F3E]/30'
              : 'bg-[#2E4F3E]/12 text-[#2E4F3E] border border-[#2E4F3E]/35 hover:bg-[#2E4F3E] hover:text-white'}">
            ${icon('trophy', 'w-4 h-4')}
            <span>UTAR × 東海數學競賽</span>
          </a>

          <a href="./translate.html"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shadow-sm hover:-translate-y-0.5 hover:shadow
            ${isTranslatePage
              ? 'bg-[#3B4252] text-white ring-2 ring-[#3B4252]/30'
              : 'bg-[#3B4252]/10 text-[#3B4252] border border-[#3B4252]/30 hover:bg-[#3B4252] hover:text-white'}">
            ${icon('globe', 'w-4 h-4')}
            <span>跨國多語翻譯</span>
          </a>

          <a href="./index.html?cat=math"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shadow-sm hover:-translate-y-0.5 hover:shadow
            ${activeCat === 'math'
              ? 'bg-[#1E3A5F] text-white ring-2 ring-[#1E3A5F]/30'
              : 'bg-[#1E3A5F]/10 text-[#1E3A5F] border border-[#1E3A5F]/30 hover:bg-[#1E3A5F] hover:text-white'}">
            ${icon('math', 'w-4 h-4')}
            <span>數學典藏</span>
          </a>

          <a href="./index.html?cat=ai"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shadow-sm hover:-translate-y-0.5 hover:shadow
            ${activeCat === 'ai'
              ? 'bg-[#7C3A2D] text-white ring-2 ring-[#7C3A2D]/30'
              : 'bg-[#7C3A2D]/10 text-[#7C3A2D] border border-[#7C3A2D]/30 hover:bg-[#7C3A2D] hover:text-white'}">
            ${icon('ai', 'w-4 h-4')}
            <span>人工智慧</span>
          </a>

          <a href="./index.html"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${!isCompPage && !isTranslatePage && !activeCat
              ? 'bg-stone-900 text-[#F6F4EF]'
              : 'bg-white text-stone-700 border border-[#D8D3C6] hover:bg-stone-900 hover:text-white'}">
            ${icon('grid', 'w-3.5 h-3.5')}
            <span>${t('allArticles')}</span>
          </a>
        </nav>
      </div>
    </header>
  `;

  document.getElementById('googleSearchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('googleSearchInput').value.trim();
    if (!q) return;

    const cx = (APP_CONFIG.GOOGLE_CSE_CX || '').trim();
    if (cx) {
      window.open(`https://cse.google.com/cse?cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(q)}`, '_blank', 'noopener');
      return;
    }

    const domain = (APP_CONFIG.SITE_DOMAIN || '').trim() || window.location.host;
    const isLocal = domain.startsWith('localhost') || domain.startsWith('127.0.0.1');
    const query = isLocal ? q : `site:${domain} ${q}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener');
  });

  document.getElementById('uiLangSwitcher')?.addEventListener('change', (e) => {
    setUiLang(e.target.value);
    window.location.reload();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', signOut);
}
