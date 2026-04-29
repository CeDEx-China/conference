# CeDEx China Annual Conference 2026

Conference website for the CeDEx China Annual Conference, co-hosted by CHE and CeDEx China, and hosted as a GitHub Pages site under the `cedex-china` GitHub organisation.

**Live site:** https://cedex-china.github.io/conference/

## Structure

```
conference/
├── index.html          # Single-page conference site
├── styles.css          # All styles (UNNC brand palette)
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions → GitHub Pages
```

## Local preview

Open `index.html` directly in a browser, or serve with any static server:

```sh
npx serve .
# or
python -m http.server 8080
```

## Deployment

Push to the `main` branch. The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically publishes the site to GitHub Pages from the repo root.

Make sure **GitHub Pages** is enabled for this repository in  
*Settings → Pages → Source: GitHub Actions*.

## Updating content

| What to change | Where |
|---|---|
| Conference dates / prices | `index.html` — respective sections |
| Speaker details (name, photo, bio) | `index.html` — `#speakers` section |
| Brand colours / typography | `styles.css` — `:root` custom properties |
| Past editions links | `index.html` — `.editions-dropdown` |

## Contact

CedexChina@nottingham.edu.cn
