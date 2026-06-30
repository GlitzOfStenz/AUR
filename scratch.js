const fs = require('fs');
let content = fs.readFileSync('src/app/components/Homepage.tsx', 'utf8');

// Replace accent colors
content = content.replace(/accent:\s*"#[a-fA-F0-9]+"/g, 'accent: "var(--aur-text)"');

// Replace background gradients
content = content.replace(/bg:\s*"linear-gradient[^"]+"/g, 'bg: "var(--aur-surface)"');

fs.writeFileSync('src/app/components/Homepage.tsx', content);
console.log("Replaced colors successfully.");
