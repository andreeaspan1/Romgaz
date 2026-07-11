/* eslint-disable no-console */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ORG = 'andreeaspan1';
const SITE = 'romgaz';
const CONTENT_DIR = path.resolve('content');

const SKIP = new Set([
  'index', 'nav', 'footer', 'comunicate-de-presa', 'noutati-si-evenimente',
]);

// Rewrite relative Drupal file links to absolute romgaz.ro URLs. DA slugifies
// internal-looking "/sites/..." hrefs on upload, which breaks the PDF links;
// absolute URLs are preserved verbatim.
function fixLinks(html) {
  return html.replace(/href="\/sites\/default\/files\//g, 'href="https://romgaz.ro/sites/default/files/');
}

function toDaDocument(plain) {
  const body = fixLinks(plain).trim();
  return `<body>\n  <header></header>\n  <main>\n${body}\n  </main>\n  <footer></footer>\n</body>\n`;
}

async function upload(name, doc) {
  const url = `https://admin.da.live/source/${ORG}/${SITE}/${name}.html`;
  const form = new FormData();
  form.append('data', new Blob([doc], { type: 'text/html' }), `${name}.html`);
  const res = await fetch(url, { method: 'POST', body: form });
  return { status: res.status, ok: res.ok, url };
}

const files = (await readdir(CONTENT_DIR))
  .filter((f) => f.endsWith('.plain.html'))
  .map((f) => f.replace('.plain.html', ''))
  .filter((n) => !SKIP.has(n));

console.log(`Re-publishing ${files.length} detail pages to DA…\n`);
for (const name of files) {
  const plain = await readFile(path.join(CONTENT_DIR, `${name}.plain.html`), 'utf8');
  const doc = toDaDocument(plain);
  try {
    const r = await upload(name, doc);
    console.log(`${r.ok ? 'OK ' : 'ERR'} ${r.status}  ${name}`);
  } catch (e) {
    console.log(`ERR --  ${name}  ${e.message}`);
  }
}
