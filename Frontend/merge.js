const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'components');

function mergeCategory(categoryName, outputFilename) {
    const dir = path.join(srcDir, categoryName);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
    if (files.length === 0) return;

    console.log(`Merging ${files.length} files from ${categoryName} into ${outputFilename}...`);

    let allImports = [];
    let allCode = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const lines = content.split('\n');
        
        let inImport = false;
        let fileCode = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Very naive import parsing
            if (line.trim().startsWith('import ') || inImport) {
                // If it's a relative import to another file in the same directory, we should ignore it
                // e.g. import NotificationPanel from "./NotificationPanel"
                if (line.includes('from "./') || line.includes("from './")) {
                    // skip this import as they will be in the same file
                } else {
                    allImports.push(line);
                }
                
                if (!line.includes(';') && !line.includes('from')) {
                    inImport = true;
                } else {
                    inImport = false;
                }
            } else {
                fileCode.push(line);
            }
        }
        
        allCode.push(`// --- ${file} ---`);
        allCode.push(fileCode.join('\n'));
    });

    // Deduplicate imports
    const uniqueImports = [...new Set(allImports)];
    
    const finalContent = uniqueImports.join('\n') + '\n\n' + allCode.join('\n\n');
    fs.writeFileSync(path.join(srcDir, outputFilename), finalContent);
    console.log(`Created ${outputFilename}`);
}

// Just printing for now to see if the approach is sound
console.log("Ready to merge");
