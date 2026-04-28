const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

// 1. Move all files to components/
function flattenDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            flattenDirectory(itemPath);
            // Move all files from this sub-directory to componentsDir
            const subItems = fs.readdirSync(itemPath);
            for (const subItem of subItems) {
                const subItemPath = path.join(itemPath, subItem);
                if (fs.statSync(subItemPath).isFile()) {
                    const destPath = path.join(componentsDir, subItem);
                    // Handle name collisions if any
                    if (fs.existsSync(destPath)) {
                        console.log(`COLLISION: ${subItem} already exists in ${componentsDir}`);
                    } else {
                        fs.renameSync(subItemPath, destPath);
                    }
                }
            }
            // Remove the empty directory
            fs.rmdirSync(itemPath);
        }
    }
}

console.log("Flattening components directory...");
flattenDirectory(componentsDir);

// 2. Update imports in all files
function updateImports(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            updateImports(itemPath);
        } else if (itemPath.endsWith('.js') || itemPath.endsWith('.jsx')) {
            let content = fs.readFileSync(itemPath, 'utf-8');
            let originalContent = content;

            // Replace imports like "@/components/layout/TopBar" -> "@/components/TopBar"
            content = content.replace(/@\/components\/(ui|layout|shared|listings|report|profile|calculator)\//g, '@/components/');

            // Replace relative imports like "../ui/button" -> "./button" or "../button"
            // This is tricky because the file itself moved. 
            // If the file was in components/layout/TopBar.jsx, it moved to components/TopBar.jsx.
            // Old relative path from components/layout/TopBar.jsx to components/ui/button.jsx was "../ui/button"
            // Now both are in components/, so it should be "./button"
            
            // To make it safe, let's just replace any relative import that matches the subdirectories
            // Since all components are now in components/, any relative import to another component 
            // from within components/ should be `./ComponentName`
            
            if (itemPath.includes(componentsDir)) {
                // For files inside components/, any import to another component is now in the same dir
                content = content.replace(/from\s+['"](?:\.\.\/|\.\/)(?:ui|layout|shared|listings|report|profile|calculator)\/([^'"]+)['"]/g, 'from "./$1"');
                // Also handle cases like "../shared/AiChatWidget" -> "./AiChatWidget"
                content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, (match, p1) => {
                     // check if p1 is a component file that exists
                     if (fs.existsSync(path.join(componentsDir, p1 + '.jsx')) || fs.existsSync(path.join(componentsDir, p1 + '.js')) || fs.existsSync(path.join(componentsDir, p1))) {
                         return `from "./${p1}"`;
                     }
                     // check if it was referring to lib, hooks, etc. e.g. "../../lib/utils" -> "../lib/utils"
                     if (p1.startsWith('../lib/') || p1.startsWith('../hooks/') || p1.startsWith('../data/') || p1.startsWith('../stores/')) {
                         return `from "${p1.substring(3)}"`; // remove one level of ../
                     }
                     if (p1.startsWith('lib/') || p1.startsWith('hooks/')) {
                         return `from "../${p1}"`;
                     }
                     return match;
                });
                
                // Fix imports to hooks, lib, data which used to be `../../hooks` now should be `../hooks`
                content = content.replace(/from\s+['"]\.\.\/\.\.\/(lib|hooks|data|stores)\/([^'"]+)['"]/g, 'from "../$1/$2"');
            } else {
                // For files outside components/ (like pages/, App.jsx, etc.)
                // They were importing like `../components/layout/TopBar` -> `../components/TopBar`
                content = content.replace(/from\s+['"]((?:\.\.\/)+|\.\/)components\/(?:ui|layout|shared|listings|report|profile|calculator)\/([^'"]+)['"]/g, 'from "$1components/$2"');
            }

            if (content !== originalContent) {
                fs.writeFileSync(itemPath, content);
                console.log(`Updated imports in ${itemPath}`);
            }
        }
    }
}

console.log("Updating imports...");
updateImports(srcDir);
console.log("Done!");
