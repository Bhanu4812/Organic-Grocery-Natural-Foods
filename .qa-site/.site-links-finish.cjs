const fs=require('fs');let html=fs.readFileSync('pages/sourcing.html','utf8');html=html.replace(/<article class="card farm-card">[\s\S]*?<\/article>/g,card=>{const name=card.match(/<h3>(.*?)<\/h3>/)[1];return card.replace('href="#willow-creek-story"',`href="contact.html?farm=${encodeURIComponent(name)}#contact-form"`).replace('Read Story','Ask about this farm');});fs.writeFileSync('pages/sourcing.html',html);
let js=fs.readFileSync('assets/js/main.js','utf8');js=js.replace('    const storedTheme =',`    const selectedFarm = new URLSearchParams(location.search).get("farm");
    if (["Willow Creek Farm", "Sunrise Dairy", "Three Oaks Farm"].includes(selectedFarm)) {
        const enquiry = $(".contact-form #type");
        const message = $(".contact-form #message");
        if (enquiry) enquiry.value = "Product Availability";
        if (message && !message.value) message.value = \`I would like to ask about produce from \${selectedFarm}.\`;
    }

    const storedTheme =`);fs.writeFileSync('assets/js/main.js',js);
let qa=fs.readFileSync('.site-browser-qa.cjs','utf8');qa=qa.replace("['index','home-2','about','sourcing','subscriptions','blog','shop','contact']","fs.readdirSync('pages').filter(f=>f.startsWith('article-')).map(f=>f.replace('.html',''))");qa=qa.replace(".qa-site/results.json",".qa-site/article-results.json");fs.writeFileSync('.site-article-qa.cjs',qa);
