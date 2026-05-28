# CeDEx China Conference Site

Official conference website for CeDEx China (GitHub Pages).

Live site: https://cedex-china.github.io/conference/

## Local Preview

Use Jekyll (required for Liquid templates and `_data` rendering):

```sh
bundle install
bundle exec jekyll serve --livereload
```

Open: http://127.0.0.1:4000/conference/

## Deployment

Push to `main` to trigger GitHub Actions deployment.

Required repo setting:
Settings → Pages → Source: GitHub Actions

Workflow file:
`.github/workflows/deploy.yml`

## Common Content Updates

- 2026 page content: `2026/index.html`
- Speaker/schedule/navigation data: `_data/2026/*.yml`
- Shared layout: `_layouts/conference.html`
- Shared styles: `css/shared/*`
- 2026 styles: `2026/css/*`

## Contact

CedexChina@nottingham.edu.cn
