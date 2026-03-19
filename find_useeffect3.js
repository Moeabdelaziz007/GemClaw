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
    if (code.includes('useEffect(') && !code.includes('React.useEffect(')) {
        // Simple check: does the file even contain the word 'useEffect' in the vicinity of 'import'?
        // Actually, let's just use string slicing to check the import block
        const lines = code.split('\n');
        let hasImport = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('import') && lines[i].includes('react') && lines[i].includes('useEffect')) {
                hasImport = true;
                break;
            }
        }
        // multi-line
        if (!hasImport) {
            const importMatch = code.match(/import\s+[\s\S]*?from\s+['"]react['"]/g);
            if (importMatch && importMatch.some(m => m.includes('useEffect'))) {
                hasImport = true;
            }
        }
        if (!hasImport) {
            console.log('REAL MISSING IMPORT IN:', f);
        }
    }
});
