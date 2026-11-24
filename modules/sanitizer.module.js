import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3/+esm';

export function cleanHTML(dirtyHtml) {
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true }
  });
}
