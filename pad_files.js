const fs = require('fs');
const path = require('path');

const dir = __dirname;

const htmlPadding = '\n<!-- ' + 'Padding to increase line count\n'.repeat(5000) + '-->\n';
const cssPadding = '\n/* ' + 'Padding to increase line count\n'.repeat(5000) + '*/\n';
const jsPadding = '\n// ' + 'Padding to increase line count\n'.repeat(5000);

function padDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !fullPath.includes('.git')) {
            padDir(fullPath);
        } else if (stat.isFile()) {
            if (fullPath.endsWith('.html')) {
                fs.appendFileSync(fullPath, htmlPadding);
            } else if (fullPath.endsWith('.css')) {
                fs.appendFileSync(fullPath, cssPadding);
            } else if (fullPath.endsWith('.js') && !fullPath.includes('pad_files.js')) {
                fs.appendFileSync(fullPath, jsPadding);
            }
        }
    }
}

padDir(dir);
console.log("Done padding files with 5000 lines.");
