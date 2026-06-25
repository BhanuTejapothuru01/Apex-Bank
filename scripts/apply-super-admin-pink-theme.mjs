/**
 * One-time theme migration: dark navy panels → pink palette (super-admin).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '../src/features/super-admin');

const REPLACEMENTS = [
  // Backgrounds
  ['bg-[#070c2e]/95', 'bg-[#FCE7F3]/95'],
  ['bg-[#070c2e]/90', 'bg-[#FCE7F3]/90'],
  ['bg-[#070c2e]/80', 'bg-[#FCE7F3]/90'],
  ['bg-[#070c2e]/60', 'bg-[#FCE7F3]/80'],
  ['bg-[#070c2e]/50', 'bg-[#FCE7F3]/70'],
  ['bg-[#070c2e]/40', 'bg-[#FCE7F3]/60'],
  ['bg-[#070c2e]/30', 'bg-[#FCE7F3]/50'],
  ['bg-[#070c2e]/20', 'bg-[#FCE7F3]/40'],
  ['bg-[#070c2e]/10', 'bg-[#FCE7F3]/30'],
  ['bg-[#070c2e]', 'bg-[#FCE7F3]'],
  ['bg-[#0a1135]', 'bg-[#FFF1F5]'],
  ['bg-[#04081c]/80', 'bg-[#FFF5F8]/90'],
  ['bg-[#04081c]/70', 'bg-[#FFF5F8]/85'],
  ['bg-[#04081c]/60', 'bg-[#FFF5F8]/80'],
  ['bg-[#04081c]/40', 'bg-[#FFF5F8]/70'],
  ['bg-[#04081c]', 'bg-[#FFF5F8]'],
  ['bg-[#03061c]/80', 'bg-[#FFF5F8]/90'],
  ['bg-[#03061c]/60', 'bg-[#FFF5F8]/80'],
  ['bg-[#03061c]/40', 'bg-[#FFF5F8]/70'],
  ['bg-[#03061c]/30', 'bg-[#FFF5F8]/60'],
  ['bg-[#03061c]/20', 'bg-[#FFF5F8]/50'],
  ['bg-[#03061c]', 'bg-[#FFF5F8]'],
  ['bg-[#060a24]/80', 'bg-[#FDF2F8]/90'],
  ['bg-[#060a24]', 'bg-[#FDF2F8]'],
  ['bg-[#060a28]', 'bg-[#FDF2F8]'],
  ['bg-[#090f2b]', 'bg-[#FCE7F3]'],
  ['bg-[#0d153a]', 'bg-[#FDF2F8]'],
  ['bg-[#0c143d]/50', 'bg-[#FDF4F9]/80'],
  ['bg-[#0c143d]/30', 'bg-[#FDF4F9]/70'],
  ['bg-[#0c143d]', 'bg-[#FDF4F9]'],
  ['bg-[#05091a]', 'bg-[#FFF1F5]'],
  ['bg-[#05081b]', 'bg-[#FFF1F5]'],
  ['bg-[#050920]', 'bg-[#831843]'],
  ['bg-[#040822]', 'bg-[#FFF1F5]'],
  ['bg-[#08020e]/80', 'bg-[#FCE7F3]/90'],
  ['bg-[#08020e]', 'bg-[#FCE7F3]'],
  ['bg-[#1a0a14]', 'bg-[#FCE7F3]'],
  ['bg-[#010520]', 'bg-[#FFF1F5]'],
  ['bg-[#121c4b]/50', 'bg-[#FBCFE8]/70'],
  ['bg-[#121c4b]', 'bg-[#FBCFE8]'],
  ['bg-[#18214d]', 'bg-[#F9A8D4]/40'],
  ['bg-[#1a0a14]', 'bg-[#FCE7F3]'],
  ['bg-slate-950/40', 'bg-pink-50/80'],
  ['bg-slate-900', 'bg-[#FFF1F5]'],
  ['bg-slate-800', 'bg-[#FDF2F8]'],
  // Borders
  ['border-[#17235a]/90', 'border-[#F9A8D4]/90'],
  ['border-[#17235a]/80', 'border-[#F9A8D4]/80'],
  ['border-[#17235a]/70', 'border-[#F9A8D4]/70'],
  ['border-[#17235a]/60', 'border-[#F9A8D4]'],
  ['border-[#17235a]/40', 'border-[#FBCFE8]'],
  ['border-[#17235a]/25', 'border-[#FBCFE8]'],
  ['border-[#17235a]', 'border-[#F9A8D4]'],
  ['border-[#1b2559]/40', 'border-[#F9A8D4]/60'],
  ['border-[#1b2559]', 'border-[#F9A8D4]'],
  ['border-[#1b2557]', 'border-[#F9A8D4]'],
  ['border-[#141c48]/80', 'border-[#FBCFE8]'],
  ['border-[#141c48]', 'border-[#FBCFE8]'],
  ['border-[#141b44]', 'border-[#FBCFE8]'],
  ['border-[#141b4a]', 'border-[#FBCFE8]'],
  ['border-[#232d66]', 'border-[#F9A8D4]'],
  ['border-dashed border-[#17235a]', 'border-dashed border-[#F9A8D4]'],
  // Muted text on panels
  ['text-[#556994]', 'text-[#9D174D]/80'],
  ['text-[#8496bf]', 'text-[#BE185D]/75'],
  ['text-[#4d5c87]', 'text-[#9D174D]/70'],
  ['placeholder-[#4d5c87]', 'placeholder-[#EC4899]/50'],
  ['placeholder-[#8496bf]', 'placeholder-[#EC4899]/45'],
  ['text-slate-100', 'text-[#4A044E]'],
  ['text-slate-200', 'text-[#701a75]'],
  ['text-slate-300', 'text-[#831843]'],
  ['text-slate-400', 'text-[#9D174D]/85'],
  ['text-slate-500', 'text-[#9D174D]/75'],
  // Panel headings — white on dark → plum on pink
  ['font-bold text-white ', 'font-bold text-[#4A044E] '],
  ['font-semibold text-white ', 'font-semibold text-[#4A044E] '],
  ['text-white font-', 'text-[#4A044E] font-'],
  ['text-white mt-', 'text-[#4A044E] mt-'],
  ['text-white uppercase', 'text-[#4A044E] uppercase'],
  ['text-white placeholder', 'text-[#4A044E] placeholder'],
  ['text-white p-', 'text-[#4A044E] p-'],
  ['text-white pl-', 'text-[#4A044E] pl-'],
  ['text-white text-', 'text-[#4A044E] text-'],
  ['text-white outline', 'text-[#4A044E] outline'],
  ['text-white hover', 'text-[#4A044E] hover'],
  ['hover:text-white ', 'hover:text-[#4A044E] '],
  ['text-white rounded', 'text-[#4A044E] rounded'],
  ['text-white border', 'text-[#4A044E] border'],
  ['text-white flex', 'text-[#4A044E] flex'],
  ['text-white tracking', 'text-[#4A044E] tracking'],
  ['text-white break', 'text-[#4A044E] break'],
  ['text-white truncate', 'text-[#4A044E] truncate'],
  ['text-white selection', 'text-[#4A044E] selection'],
  ['text-white col-span', 'text-[#4A044E] col-span'],
  ['text-white shadow', 'text-[#4A044E] shadow'],
  ['text-white animate', 'text-[#4A044E] animate'],
  ['text-white cursor', 'text-[#4A044E] cursor'],
  ['text-white disabled', 'text-[#4A044E] disabled'],
  ['text-white transition', 'text-[#4A044E] transition'],
  ['text-white group', 'text-[#4A044E] group'],
  ['text-white shrink', 'text-[#4A044E] shrink'],
  ['text-white min-', 'text-[#4A044E] min-'],
  ['text-white max-', 'text-[#4A044E] max-'],
  ['text-white w-', 'text-[#4A044E] w-'],
  ['text-white h-', 'text-[#4A044E] h-'],
  ['text-white gap-', 'text-[#4A044E] gap-'],
  ['text-white space', 'text-[#4A044E] space'],
  ['text-white relative', 'text-[#4A044E] relative'],
  ['text-white absolute', 'text-[#4A044E] absolute'],
  ['text-white block', 'text-[#4A044E] block'],
  ['text-white inline', 'text-[#4A044E] inline'],
  ['text-white tabular', 'text-[#4A044E] tabular'],
  ['text-white leading', 'text-[#4A044E] leading'],
  ['text-white opacity', 'text-[#4A044E] opacity'],
  ['text-white sr-only', 'text-[#4A044E] sr-only'],
  ['text-white">', 'text-[#4A044E]">'],
  ['text-white\'', 'text-[#4A044E]\''],
  ['className="text-white"', 'className="text-[#4A044E]"'],
  ['text-white\n', 'text-[#4A044E]\n'],
  // Keep white on gradient buttons / active sidebar (restore after broad replace)
];

// Sidebar active items & gold buttons need white text — handled in CSS !important already

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

let total = 0;
for (const file of walk(ROOT)) {
  let src = readFileSync(file, 'utf8');
  const before = src;
  for (const [from, to] of REPLACEMENTS) {
    src = src.split(from).join(to);
  }
  if (src !== before) {
    writeFileSync(file, src);
    total++;
    console.log('updated', file.replace(ROOT + '/', ''));
  }
}
console.log(`Done. ${total} files updated.`);
