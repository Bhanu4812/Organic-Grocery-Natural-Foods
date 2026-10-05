const fs=require('fs');
const files=fs.readdirSync('pages').filter(f=>f.startsWith('article-'));
const topics={
'breakfast':['Make mornings easier','Try oats with fruit, yogurt with berries, toast with nut butter, a fruit smoothie, or eggs with greens. Prepare toppings the evening before and let everyone choose their own combination.'],
'leafy-greens':['Give greens a place in the week','Use leafy greens in a salad, a soup, a stir-fry, a grain bowl, a sandwich, a pasta sauce, or a breakfast scramble. Start with a small amount and choose the preparation you enjoy most.'],
'soil':['Look beneath the harvest','A farm story starts with the soil. Ask growers about their approach to compost, crop rotation, cover crops, and water use. Our sourcing page is a starting point for exploring those conversations.'],
'compost':['Ask about growing practices','When visiting a farm or market, ask how the grower uses compost and cover crops, and how they choose what to plant next. The answers give you a clearer picture of the work behind the harvest.'],
'crates':['Reuse what you already have','Keep a shopping bag or reusable container near the door. After unpacking groceries, set reusable packaging aside for its next trip and ask the store which containers it can accept back.'],
'low-waste':['Plan for the whole basket','Check what you already have before ordering. Choose a few flexible meals, unpack produce where you can see it, and keep a short list of ingredients to use first.'],
'willow':['Get to know a grower','Explore the Willow Creek feature on our sourcing page, then compare the foods you enjoy with the ingredients in your next basket. Questions about growing and harvesting can make the connection between farm and meal more tangible.'],
'ingredient':['Read beyond the front of the pack','Turn the package over and review its ingredient list. Compare similar products, check the preparation instructions, and choose the one that fits the meal you want to make.'],
'certification':['Ask clear questions about a label','Look for the certification information on the packaging and ask the seller which organization verifies it. For specific certification requirements, consult that organization directly rather than relying on a marketing phrase.'],
'pantry':['Build a flexible dinner shelf','Choose a grain, a pulse, a cooking oil, and a few seasonings you enjoy. Combine those staples with fresh vegetables for a soup, a bowl, or a simple pan meal. Replace what you use before adding more.'],
'kitchen':['Reset one shelf at a time','Start by checking your fridge and cupboard. Bring ingredients you want to use soon to the front, plan a few meals around them, and leave space for fresh seasonal additions.'],
'seasonal':['Let the market guide a meal','Choose a vegetable that catches your eye, then pair it with a familiar grain or pulse. Ask the market what is available this week and keep a flexible shopping list so you can make swaps.']};
for(const file of files){let html=fs.readFileSync('pages/'+file,'utf8');let topic=Object.entries(topics).find(([key])=>file.includes(key))?.[1]||topics.kitchen;html=html.replace(/<h2>Start with what is in season<\/h2>[\s\S]*?(?=<div class="actions">)/,`<h2>${topic[0]}</h2><p>${topic[1]}</p><p>Explore the ingredients in our shop or visit our sourcing page to learn more about the market.</p>`);const title=html.match(/<title>(.*?) \|/)[1];html=html.replace(/content="Learn how Everleaf[^"\n]*"/g,`content="${title}. Practical ideas from the Everleaf Journal."`).replace('content="About Everleaf | Good Food Starts With Good Soil"',`content="${title} | Everleaf Journal"`);fs.writeFileSync('pages/'+file,html);}
let source=fs.readFileSync('pages/sourcing.html','utf8');source=source.replace('<h2>Three generations at Willow Creek.</h2>','<h2 id="willow-creek-story">Three generations at Willow Creek.</h2>');source=source.replace(/href="sourcing.html">(\s*Read Story)/g,'href="#willow-creek-story">$1');fs.writeFileSync('pages/sourcing.html',source);
let js=fs.readFileSync('assets/js/main.js','utf8');js=js.replace('    const storedTheme =',`    const selectedPlan = new URLSearchParams(location.search).get("plan");
    if (["Essential Organic Box", "Family Harvest Box", "Healthy Pantry Box"].includes(selectedPlan)) {
        const enquiry = $(".contact-form #type");
        const message = $(".contact-form #message");
        if (enquiry) enquiry.value = "Subscription";
        if (message && !message.value) message.value = \`I would like to learn more about the \${selectedPlan}.\`;
    }

    const storedTheme =`);fs.writeFileSync('assets/js/main.js',js);
