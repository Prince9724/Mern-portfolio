const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Frontend path
const frontendPath = path.join(__dirname, '../../frontend/src');
const files = glob.sync(`${frontendPath}/**/*.{js,jsx}`, { nodir: true });

let missingCredentials = [];

files.forEach(file => {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  
  lines.forEach((line, idx) => {
    // Check for axios calls
    if (/axios\.(get|post|put|delete)\(/.test(line)) {
      let block = line;
      for (let j = idx + 1; j < Math.min(idx + 6, lines.length); j++) {
        block += '\n' + lines[j];
      }
      // Check if withCredentials is present
      if (!/withCredentials\s*:\s*true/.test(block)) {
        missingCredentials.push({
          file: file.replace(frontendPath, 'src'),
          line: idx + 1,
          code: line.trim()
        });
      }
    }
  });
});

console.log('📊 Files without withCredentials:');
console.log(JSON.stringify(missingCredentials, null, 2));
console.log(`\n📊 Total: ${missingCredentials.length} issues found`);