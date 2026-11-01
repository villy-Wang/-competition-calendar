import fs from 'node:fs';

const catalogPath = new URL('../public/competitions.json', import.meta.url);
const referencePath = new URL('../data/kmu-2025-reference-links.json', import.meta.url);
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
let added = 0;

for (const competition of catalog) {
  if (!competition.catalogNumber || competition.sourceUrl) continue;
  const entry = reference.entries[competition.catalogNumber];
  if (!entry) continue;
  competition.sourceUrl = entry.url;
  competition.source = `${competition.source}；官网入口参考：昆明学院教务处 2025-12-03 汇总（当前届次未核验）`;
  added++;
}

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Added ${added} reference links; verification flags and deadlines unchanged.`);
