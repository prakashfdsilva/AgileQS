const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/<img[^>]+class="marquee-logo"[^>]*>/g, (match) => {
    let newMatch = match.replace(/\s*loading="lazy"/g, ' decoding="async"');
    return newMatch;
});

fs.writeFileSync('index.html', content);

let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('color: transparent;')) {
    css = css.replace('.marquee-logo {', '.marquee-logo {\n  color: transparent;\n  font-size: 0;\n  min-width: 100px;');
    fs.writeFileSync('style.css', css);
}

console.log('Done optimizing index.html and style.css');
