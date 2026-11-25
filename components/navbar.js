// components/navbar.js
import { APP_CONFIG } from '../config/app.config.js';
import { getCurrentUser, signOut } from '../modules/auth.module.js';
import { getUiLang, setUiLang, t } from '../modules/i18n.module.js';
import { icon } from '../modules/icons.module.js';

export async function mountNavbar(targetId = 'navbar') {
  const el = document.getElementById(targetId);
  if (!el) return;

  const [user, currentLang] = [await getCurrentUser(), getUiLang()];
  document.documentElement.lang = currentLang;

  el.innerHTML = `
    <header class="bg-[#F6F4EF]/90 backdrop-blur-md border-b border-[#E4E0D6] sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="./index.html" class="flex items-center gap-2.5 group">
          <span class="w-8 h-8 rounded border border-stone-900/80 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-[#F6F4EF] transition">
            ${icon('brand', 'w-4 h-4')}
          </span>
          <div class="leading-tight">
            <span class="font-serif-editorial text-lg font-semibold tracking-tight text-stone-900 block">${t('siteTitle')}</span>
          </div>
        </a>

        <div class="flex items-center gap-3 sm:gap-5 text-sm">
          <a href="./index.html" class="hidden sm:inline text-stone-600 hover:text-stone-900 transition">${t('navHome')}</a>

          <!-- 全站預設語言即時切換器 -->
          <div class="flex items-center gap-1.5 border border-[#DDD8CC] bg-white/80 rounded-full px-2.5 py-1 text-xs text-stone-600">
            ${icon('globe', 'w-3.5 h-3.5 text-stone-500')}
            <select id="uiLangSwitcher" aria-label="Language" class="bg-transparent focus:outline-none cursor-pointer font-medium text-stone-700">
              ${APP_CONFIG.LANGUAGES.map(l => `
                <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.short}</option>
              `).join('')}
            </select>
          </div>

          ${user ? `
            <a href="./upload.html" class="inline-flex items-center gap-1.5 bg-stone-900 text-[#F6F4EF] px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-stone-700 transition">
              ${icon('plus', 'w-3.5 h-3.5')}
              <span>${t('navUpload')}</span>
            </a>
            <button id="logoutBtn" title="${user.email}" class="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition">
              ${icon('logout', 'w-3.5 h-3.5')}
              <span class="hidden md:inline">${t('navLogout')}</span>
            </button>
          ` : `
            <a href="./login.html" class="border border-stone-900 text-stone-900 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-stone-900 hover:text-[#F6F4EF] transition">
              ${t('navLogin')}
            </a>
          `}
        </div>
      </div>
    </header>
  `;

  document.getElementById('uiLangSwitcher')?.addEventListener('change', (e) => {
    setUiLang(e.target.value);
    window.location.reload();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', signOut);
}
