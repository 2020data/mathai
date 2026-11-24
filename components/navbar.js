import { getCurrentUser, signOut } from '../modules/auth.module.js';

export async function mountNavbar(targetId = 'navbar') {
  const el = document.getElementById(targetId);
  if (!el) return;

  const user = await getCurrentUser();

  el.innerHTML = `
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="./index.html" class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📐</span> 數學與 AI 知識庫
        </a>
        <div class="flex items-center gap-4 text-sm">
          <a href="./index.html" class="text-slate-600 hover:text-slate-900">首頁</a>
          ${user ? `
            <a href="./upload.html" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">+ 上傳內容</a>
            <span class="text-slate-400 hidden sm:inline">${user.email}</span>
            <button id="logoutBtn" class="text-red-500 hover:underline">登出</button>
          ` : `
            <a href="./login.html" class="bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700">登入 / 註冊</a>
          `}
        </div>
      </div>
    </nav>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', signOut);
}
