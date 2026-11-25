// modules/share.module.js
import { icon } from './icons.module.js';

export function mountShareBar(containerEl, { title = document.title, url = window.location.href } = {}) {
  if (!containerEl) return;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${url}`);

  containerEl.innerHTML = `
    <div class="flex flex-wrap items-center gap-2 text-xs">
      <span class="inline-flex items-center gap-1.5 text-stone-500 font-mono-meta mr-1">
        ${icon('share', 'w-3.5 h-3.5')} 分享
      </span>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer"
        class="px-3 py-1.5 rounded-full border border-[#D8D3C6] bg-white text-stone-700 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition">
        Facebook
      </a>
      <button type="button" data-share="ig"
        class="px-3 py-1.5 rounded-full border border-[#D8D3C6] bg-white text-stone-700 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition">
        Instagram
      </button>
      <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" rel="noopener noreferrer"
        class="px-3 py-1.5 rounded-full border border-[#D8D3C6] bg-white text-stone-700 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition">
        WhatsApp
      </a>
      <a href="https://social-plugins.line.me/lineit/share?url=${encodedUrl}" target="_blank" rel="noopener noreferrer"
        class="px-3 py-1.5 rounded-full border border-[#D8D3C6] bg-white text-stone-700 hover:bg-[#06C755] hover:text-white hover:border-[#06C755] transition">
        LINE
      </a>
      <button type="button" data-share="copy"
        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#D8D3C6] bg-[#F6F4EF] text-stone-700 hover:bg-stone-900 hover:text-white transition">
        ${icon('copy', 'w-3 h-3')} 複製連結
      </button>
      <span data-share-msg class="text-[11px] font-mono-meta text-emerald-700"></span>
    </div>
  `;

  const msgEl = containerEl.querySelector('[data-share-msg]');

  containerEl.querySelector('[data-share="copy"]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      msgEl.textContent = '已複製網址';
      setTimeout(() => (msgEl.textContent = ''), 2500);
    } catch {
      prompt('請手動複製連結：', url);
    }
  });

  containerEl.querySelector('[data-share="ig"]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${title} ${url}`);
    } catch {}
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {}
    }
    msgEl.textContent = '已複製標題與連結，可直接貼至 Instagram 限時動態或貼文';
    setTimeout(() => (msgEl.textContent = ''), 4000);
  });
}
