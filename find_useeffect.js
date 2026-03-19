const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('components'), ...walk('lib'), ...walk('hooks')];

files.forEach(f => {
    const code = fs.readFileSync(f, 'utf8');
    if (code.includes('useEffect(') && !code.includes('React.useEffect(')) {
        if (!code.includes('useEffect') || !code.match(/import\s+.*useEffect.*\s+from/)) {
            console.log('MISSING IMPORT IN:', f);
        }
    }
});
