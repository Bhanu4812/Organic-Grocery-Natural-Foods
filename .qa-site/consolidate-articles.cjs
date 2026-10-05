const fs=require('fs'),path=require('path');
const files=fs.readdirSync('pages').filter(f=>/^article-.*\.html$/.test(f));
if(files.length!==15)throw Error('Expected fifteen source articles');
const articles={};
for(const file of files){const html=fs.readFileSync('pages/'+file,'utf8');const id=file.slice(8,-5);const title=html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1];const content=html.match(/<article class="container journal-article">([\s\S]*?)<\/article>/)?.[1];const description=html.match(/name="description"\s+content="([^"]*)"/)?.[1];if(!title||!content||!description)throw Error('Incomplete article '+file);articles[id]={title,description,content};}
const fallback=`<main id="main">
            <section class="page-hero"><div class="container"><span class="eyebrow">Everleaf Journal</span><h1 id="article-title">Explore the Everleaf Journal</h1></div></section>
            <section class="section"><article class="container journal-article" id="article-content"><h2>Choose a story to read</h2><p>This article link is missing or no longer available. Browse the journal to find practical ideas for seasonal meals and organic living.</p><a class="btn btn-primary" href="blog.html">Browse the journal</a><noscript><p>Enable JavaScript to open individual stories.</p></noscript></article></section>
        </main>`;
let template=fs.readFileSync('pages/'+files[0],'utf8');template=template.replace(/<main id="main">[\s\S]*?<\/main>/,fallback).replace(/<title>[\s\S]*?<\/title>/,'<title>Everleaf Journal | Article</title>').replace(/<link rel="canonical"[^>]*\/>/,'<link rel="canonical" href="blog-details.html" />').replace(/(<meta\s+name="description"\s+content=")[^"]*/,'$1Read practical ideas for seasonal meals and organic living in the Everleaf Journal.').replace(/(<meta\s+property="og:title"\s+content=")[^"]*/,'$1Everleaf Journal | Article').replace(/(<meta\s+property="og:description"\s+content=")[^"]*/,'$1Read practical ideas for seasonal meals and organic living in the Everleaf Journal.').replace('<script src="../assets/js/main.js" defer></script>','<script src="../assets/js/blog-articles.js" defer></script>\n        <script src="../assets/js/main.js" defer></script>');
fs.writeFileSync('pages/blog-details.html',template);
const script=`(() => {
    "use strict";
    // Preserved content from the original article pages. IDs remain stable in card links.
    const articles = ${JSON.stringify(articles,null,4)};
    const id = new URLSearchParams(location.search).get("article");
    const article = Object.hasOwn(articles, id) ? articles[id] : null;
    if (!article) {
        document.title = "Article unavailable | Everleaf Journal";
        document.querySelector('meta[name="robots"]')?.remove();
        const robots = document.createElement("meta");
        robots.name = "robots";
        robots.content = "noindex";
        document.head.appendChild(robots);
        return;
    }
    document.getElementById("article-title").textContent = article.title;
    // Content is trusted, local HTML; the query parameter only selects a known ID.
    document.getElementById("article-content").innerHTML = article.content;
    document.title = article.title + " | Everleaf Journal";
    document.querySelector('meta[name="description"]').content = article.description;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = article.description;
    const canonical = new URL("blog-details.html", location.href);
    canonical.searchParams.set("article", id);
    document.querySelector('link[rel="canonical"]').href = canonical.href;
    const image = document.querySelector("#article-content img");
    if (image) document.querySelector('meta[property="og:image"]').content = image.src;
})();
`;
fs.writeFileSync('assets/js/blog-articles.js',script);
for(const file of fs.readdirSync('pages').filter(f=>f.endsWith('.html')&&!f.startsWith('article-'))){const original=fs.readFileSync('pages/'+file,'utf8');const updated=original.replace(/href="article-([^"]+)\.html"/g,(_,id)=>{if(!Object.hasOwn(articles,id))throw Error('Unknown article link '+id);return `href="blog-details.html?article=${id}"`;});if(updated!==original)fs.writeFileSync('pages/'+file,updated);}
fs.writeFileSync('.qa-site/article-migration.json',JSON.stringify({articles,sourceFiles:files},null,2));
console.log('Preserved '+files.length+' article bodies and metadata; updated all card links. Source pages retained until verification.');
