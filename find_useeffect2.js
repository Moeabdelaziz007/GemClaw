const fs = require('fs');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = dir + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = [...walk('app'), ...walk('components'), ...walk('lib'), ...walk('hooks')];

files.forEach(f => {
    const code = fs.readFileSync(f, 'utf8');
    // If we use useEffect()
    if (code.includes('useEffect(') && !code.includes('React.useEffect(')) {
        // Find if we import useEffect
        const hasImport = code.match(/import\s*\{[^}]*useEffect[^}]*\}\s*from\s*['"]react['"]/);
        if (!hasImport) {
            console.log('MISSING IMPORT IN:', f);
        }
    }
});
