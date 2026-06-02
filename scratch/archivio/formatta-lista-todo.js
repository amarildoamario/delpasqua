const fs = require('fs');
const path = require('path');

const docsDir = 'c:\\Users\\Utente\\Desktop\\React\\delpasqua\\docs';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace headers and text states with consistent emoji prefixes
  // Avoid double prefixing by matching optionally present emojis
  content = content.replace(/\[(?:✅\s*)?RISOLTO\]/g, '[✅ RISOLTO]');
  content = content.replace(/\[(?:⏳\s*|📋\s*|❌\s*)?TODO\]/g, '[⏳ TODO]');
  content = content.replace(/\[(?:⚠️\s*)?PARZIALE\]/g, '[⚠️ PARZIALE]');

  // 2. Replace markdown checkbox-style lists:
  // [x] -> [✅ RISOLTO]
  // [ ] -> [⏳ TODO]
  // Note: we target lines starting with [x] or [ ] or - [x] or - [ ]
  content = content.replace(/^(\s*-?\s*)\[x\]/gm, '$1[✅ RISOLTO]');
  content = content.replace(/^(\s*-?\s*)\[ \]/gm, '$1[⏳ TODO]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${path.basename(filePath)}`);
}

// Read all files in docs directory
const files = fs.readdirSync(docsDir);
files.forEach(file => {
  if (file.endsWith('.md') && file.startsWith('to_do_')) {
    processFile(path.join(docsDir, file));
  }
});
