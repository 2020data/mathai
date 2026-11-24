import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12/+esm';
import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.mjs';
import { cleanHTML } from './sanitizer.module.js';

// 安全解析 Markdown + LaTeX（避免 Markdown 破壞公式內的底線符號）
export function parseMarkdownWithMath(text) {
  const mathBlocks = [];

  // 1. 先保護區塊公式 $$...$$ 與行內公式 $...$
  let protectedText = (text || '').replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    const idx = mathBlocks.push({ expr, display: true }) - 1;
    return `@@MATH_${idx}@@`;
  }).replace(/\$([^\n$]+?)\$/g, (_, expr) => {
    const idx = mathBlocks.push({ expr, display: false }) - 1;
    return `@@MATH_${idx}@@`;
  });

  // 2. 解析 Markdown 並做資安過濾
  let safeHtml = cleanHTML(marked.parse(protectedText));

  // 3. 將數學公式還原並交由 KaTeX 渲染（KaTeX 預設 trust: false，安全無 XSS）
  safeHtml = safeHtml.replace(/@@MATH_(\d+)@@/g, (_, idx) => {
    const item = mathBlocks[Number(idx)];
    return katex.renderToString(item.expr.trim(), {
      displayMode: item.display,
      throwOnError: false
    });
  });

  return safeHtml;
}

// 統一內容呈現分派器
export async function renderPostContent(container, post, overrideText = null) {
  const textToRender = overrideText ?? post.raw_text;

  switch (post.format) {
    case 'markdown':
    case 'latex':
      container.innerHTML = `<div class="prose max-w-none leading-relaxed">${parseMarkdownWithMath(textToRender)}</div>`;
      break;

    case 'pdf':
      container.innerHTML = `
        <iframe src="${post.file_url}" class="w-full h-[78vh] rounded-lg border shadow-sm"></iframe>
        <div class="mt-3 text-right">
          <a href="${post.file_url}" target="_blank" class="text-sm text-blue-600 hover:underline">在新分頁開啟 PDF ↗</a>
        </div>`;
      break;

    case 'docx':
      container.innerHTML = `<p class="text-gray-500">正在解析 Word 文件...</p>`;
      const res = await fetch(post.file_url);
      const arrayBuffer = await res.arrayBuffer();
      const result = await window.mammoth.convertToHtml({ arrayBuffer });
      container.innerHTML = `<div class="prose max-w-none bg-white p-6 rounded-lg border">${cleanHTML(result.value)}</div>`;
      break;

    case 'pptx':
      const encoded = encodeURIComponent(post.file_url);
      container.innerHTML = `
        <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encoded}" class="w-full h-[78vh] rounded-lg border"></iframe>
        <p class="mt-2 text-xs text-gray-500">若簡報無法載入，請確認檔案為公開存取或直接 <a href="${post.file_url}" class="text-blue-600 underline">下載原檔</a>。</p>`;
      break;

    default:
      container.innerHTML = `<p class="text-red-500">不支援的檔案格式：${post.format}</p>`;
  }
}
