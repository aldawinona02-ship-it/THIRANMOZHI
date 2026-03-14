const fs = require('fs');
const path = require('path');

const dir = __dirname;

function cleanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
        if (item === 'pad_files.js' || item === 'clean_files.js') continue;
        
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !fullPath.includes('.git')) {
            cleanDir(fullPath);
        } else if (stat.isFile()) {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                
                // Remove padding
                content = content.replace(/\n<!-- Padding to increase line count\n.*-->\n/s, '');
                content = content.replace(/\n\/\* Padding to increase line count\n.*\*\/\n/s, '');
                content = content.replace(/\n\/\/ Padding to increase line count\n.*/s, '');
                
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

cleanDir(dir);
console.log("Done cleaning files.");
