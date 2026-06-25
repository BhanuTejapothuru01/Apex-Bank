/**
 * Apply Google Search Console verification to static HTML files.
 *
 * Usage (HTML file method — paste the filename Google gives you, without .html):
 *   npx tsx scripts/apply-google-verification.ts googleAbCdEf1234567890
 *
 * Usage (HTML meta tag method — paste the content= value from the meta tag):
 *   npx tsx scripts/apply-google-verification.ts --meta YOUR_META_TOKEN_HERE
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');

const META_SNIPPET = (token: string) =>
  `<meta name="google-site-verification" content="${token}" />`;

function injectMetaIntoHtml(filePath: string, token: string): void {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('google-site-verification')) {
    html = html.replace(
      /<meta name="google-site-verification" content="[^"]*" \/>/,
      META_SNIPPET(token)
    );
  } else {
    html = html.replace('</head>', `  ${META_SNIPPET(token)}\n</head>`);
  }
  fs.writeFileSync(filePath, html);
  console.log(`  ✓ ${path.relative(root, filePath)}`);
}

function writeVerificationFile(filename: string): void {
  const filePath = path.join(publicDir, filename);
  const content = `google-site-verification: ${filename}\n`;
  fs.writeFileSync(filePath, content);
  console.log(`  ✓ ${path.relative(root, filePath)}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`
Google Search Console verification helper

  HTML file method (recommended on Vercel):
    npx tsx scripts/apply-google-verification.ts googleAbCdEf1234567890

  HTML meta tag method:
    npx tsx scripts/apply-google-verification.ts --meta YOUR_TOKEN

Then deploy: npx vercel deploy --prod
`);
  process.exit(1);
}

console.log('[GSC] Applying Google Search Console verification…\n');

if (args[0] === '--meta') {
  const token = args[1];
  if (!token) {
    console.error('Missing meta token after --meta');
    process.exit(1);
  }
  for (const name of ['landing.html', 'about-demo.html', 'search-console-setup.html']) {
    injectMetaIntoHtml(path.join(publicDir, name), token);
  }
  const indexPath = path.join(root, 'index.html');
  injectMetaIntoHtml(indexPath, token);
  console.log('\nDone. Redeploy, then click Verify in Search Console (HTML tag method).');
} else {
  const filename = args[0].endsWith('.html') ? args[0] : `${args[0]}.html`;
  writeVerificationFile(filename);
  console.log('\nDone. Redeploy, then click Verify in Search Console (HTML file method).');
}
