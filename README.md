# Md Sohanur Rahman — Personal Website

Portfolio site for PhD CS Candidate at UTSA. Research on LLM trustworthiness, hallucination mitigation, medical NLP, explainable AI.

## File tree

```
personal_website/
├── index.html              # Main page (hero, about, research, pubs, experience, skills, awards, mentoring, contact)
├── css/style.css           # Main stylesheet
├── js/main.js              # Typewriter, neural canvas, scroll reveal, nav
├── blog/
│   ├── index.html          # Blog landing (post grid)
│   ├── ai.html             # "What is AI, really?" + perceptron demo
│   ├── ml.html             # "How models actually learn" + regression demo
│   ├── llm.html            # "Inside an LLM" + tokenizer + attention heatmap
│   ├── xai.html            # "Opening the black box" + Shapley demo
│   ├── css/blog.css        # Blog-specific styles
│   └── js/widgets.js       # All interactive widgets
├── *.pdf                   # CV + resume
└── README.md
```

## Run locally

```bash
# Python (recommended)
python -m http.server 8000

# or Node
npx serve .
```

Open http://localhost:8000

## How to update content (no coding needed)

### Add a new research project
Open `index.html`, find the `ADD NEW RESEARCH` comment in the `#research` section. Copy any
existing `<article class="research-card">...</article>` block, paste above the comment, edit:
- `.research-tag` — date + status
- `<h3>` — title
- `.venue` — venue
- `<p>` — description
- `.research-stack` — tags

### Add a new publication
Same idea: `index.html` → `#publications` → `ADD NEW PUBLICATION` comment. Copy one
`<div class="pub">...</div>`, paste newest on top, edit year, title, authors, venue.

### Add a new award
`index.html` → `#awards` → `ADD NEW AWARD` comment. Copy one `<div class="award">`, edit year + text.

### Add a new blog post
1. Copy `blog/ai.html` → `blog/my-topic.html`
2. Edit the `<h1>`, `<span class="post-tag">`, lead paragraph, and `.post-body`
3. Remove the interactive widget `<div class="widget">` if you don't need one
4. Update `blog/index.html` → add a new `<a class="post-card" href="my-topic.html">` card
5. (Optional) Write a new widget in `blog/js/widgets.js` — see `initPerceptron`, `initRegression` etc. as templates

### Add a new interactive widget
Open `blog/js/widgets.js`. Each widget is a self-contained function. Pattern:
```js
window.initMyWidget = function () {
  const canvas = document.getElementById('my-canvas');
  if (!canvas) return;
  // ... your code ...
};
```
Then in your blog post: `<script>initMyWidget();</script>` at the bottom.

## Deploy to GitHub Pages

1. Create GitHub repo. Use `<username>.github.io` for user-site, or any name for project-site.
2. Push contents of this folder to `main`:
   ```bash
   git init
   git add .
   git commit -m "initial site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. Repo → **Settings** → **Pages** → Source: `main`, Folder: `/ (root)` → Save
4. Live in ~1 minute at `https://<username>.github.io/` or `https://<username>.github.io/<repo>/`

## Interactive demos included

| Page | Demo |
|------|------|
| `blog/ai.html` | Live perceptron — drag weights, watch decision boundary move |
| `blog/ml.html` | Click-to-add regression — fits line on the fly, shows residuals |
| `blog/llm.html` | Live tokenizer + attention heatmap (toy example) |
| `blog/xai.html` | Feature importance bars — drag sliders, bars reorder |

## Stack

Pure HTML / CSS / JS. No build step. No frameworks. Works on any static host.
