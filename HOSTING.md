# GitHub Pages Hosting Guide

Your GitHub username: **sohanur083**

You have two options for hosting.

---

## Option A: User site (recommended)

URL will be: **`https://sohanur083.github.io`** — clean, short, owns your name.

### One-time setup

1. Go to https://github.com/new
2. Repository name: **`sohanur083.github.io`** (exact spelling — this is required for user-sites)
3. Visibility: **Public**
4. Do NOT initialise with README / license / .gitignore
5. Click **Create repository**

### Push the site

Open a terminal in `personal_website/`:

```bash
git init
git add .
git commit -m "initial personal site"
git branch -M main
git remote add origin https://github.com/sohanur083/sohanur083.github.io.git
git push -u origin main
```

GitHub will prompt for login — use a **personal access token** (not your password):
- https://github.com/settings/tokens → Generate new token (classic) → tick `repo` scope → copy token
- Paste token when `git push` asks for password

### Enable Pages

1. Repo → **Settings** → **Pages** (left sidebar)
2. Source: **Deploy from a branch**
3. Branch: **`main`** · Folder: **`/ (root)`** → **Save**
4. Wait ~1 minute. Site live at `https://sohanur083.github.io`

Every `git push` after this auto-deploys in ~30 seconds.

---

## Option B: Project site

URL will be: **`https://sohanur083.github.io/personal-website`** — longer URL, but you can have multiple.

Same steps as Option A but:
- Repo name can be anything, e.g. `personal-website`
- In Settings → Pages you get the same `main` + `/ (root)` config
- Final URL: `https://sohanur083.github.io/<repo-name>`

---

## Want me to do it for you?

I can't push to GitHub on your behalf without your credentials, and you shouldn't give those
to anyone. But I can:

1. **Prepare the git repo locally** — run `git init`, stage everything, make the first commit, so all you need is `git push`.
2. **Walk you through `gh` CLI setup** — `gh auth login` handles tokens for you. Then `gh repo create sohanur083.github.io --public --source . --push` ships everything in one command.

Say the word and I'll run option 1 or guide option 2 step-by-step.

---

## After it's live

- **Custom domain (optional)** — buy `mdsohanur.com` or similar. In repo Settings → Pages → Custom domain, add it. Create a CNAME DNS record pointing to `sohanur083.github.io`. HTTPS auto-provisioned.
- **Future updates** — edit any file locally, then:
  ```bash
  git add .
  git commit -m "update research section"
  git push
  ```
  30 seconds later the live site updates.
- **Analytics (optional)** — add Plausible, Umami, or GoatCounter script to `index.html` footer. Free, privacy-respecting, no cookies.
