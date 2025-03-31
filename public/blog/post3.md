---
title: Post 3 title
date: 2024-10-15
tags: AI, ChatGPT
---

# Post 3 title

### Charles Johnson, Software Engineer

#### 10-15-2024

Revisiting the site after a year

- Make sure the app can still run
  - `npm run dev`
  - The site comes up!
- Update node version from v20.12.0 to current LTS version (v22.14.0)
  - Run `nvm install --lts`
  - "LTS" means Long Term Support, so it's likely to continue working for longer and have fewer bugs than the latest version
- Update dependencies in package.json based on semver
  - Run `npm upgrade`
- Check for major version upgrades - Run `npm outdated`
  npm outdated
  Package Current Wanted Latest Location Depended by
  @sentry/react 7.120.3 7.120.3 9.10.1 node_modules/@sentry/react cj.cafe
  @sentry/vite-plugin 2.23.0 2.23.0 3.2.4 node_modules/@sentry/vite-plugin cj.cafe
  @testing-library/react 14.3.1 14.3.1 16.2.0 node_modules/@testing-library/react cj.cafe
  @tldraw/tldraw 2.0.0-alpha.14 2.0.0-alpha.14 3.11.0 node_modules/@tldraw/tldraw cj.cafe
  @types/node 20.17.28 20.17.28 22.13.14 node_modules/@types/node cj.cafe
  @types/react 18.3.20 18.3.20 19.0.12 node_modules/@types/react cj.cafe
  @types/react-dom 18.3.5 18.3.5 19.0.4 node_modules/@types/react-dom cj.cafe
  @typescript-eslint/eslint-plugin 6.21.0 6.21.0 8.28.0 node_modules/@typescript-eslint/eslint-plugin cj.cafe
  @typescript-eslint/parser 6.21.0 6.21.0 8.28.0 node_modules/@typescript-eslint/parser cj.cafe
  eslint 8.57.1 8.57.1 9.23.0 node_modules/eslint cj.cafe
  eslint-plugin-react-hooks 4.6.2 4.6.2 5.2.0 node_modules/eslint-plugin-react-hooks cj.cafe
  eslint-plugin-testing-library 6.5.0 6.5.0 7.1.1 node_modules/eslint-plugin-testing-library cj.cafe
  jsdom 22.1.0 22.1.0 26.0.0 node_modules/jsdom cj.cafe
  react 18.3.1 18.3.1 19.1.0 node_modules/react cj.cafe
  react-dom 18.3.1 18.3.1 19.1.0 node_modules/react-dom cj.cafe
  react-helmet-async 1.3.0 1.3.0 2.0.5 node_modules/react-helmet-async cj.cafe
  react-markdown 9.1.0 9.1.0 10.1.0 node_modules/react-markdown cj.cafe
  react-router-dom 6.30.0 6.30.0 7.4.1 node_modules/react-router-dom cj.cafe
  tailwindcss 3.4.17 3.4.17 4.0.17 node_modules/tailwindcss cj.cafe
  vite 5.4.15 5.4.15 6.2.3 node_modules/vite cj.cafe
  vite-bundle-visualizer 0.10.1 0.10.1 1.2.1 node_modules/vite-bundle-visualizer cj.cafe
  vitest 0.34.6 0.34.6 3.0.9 node_modules/vitest cj.cafe

I'm going to force update all my packages to the latest available versions. This will probably break things.
`npx npm-check-updates -u`
`npm install --force`

There are some errors shown in the console:

- eslint-plugin-tailwindcss@latest doesn't support tailwind 4. Let's uninstall that.
  - `npm uninstall eslint-plugin-tailwindcss --force`
- react-helmet-async doesn't support React 19. Let's look for a replacement.
  - I was using this library to render MD files as blog posts, in particular with metadata tags.
  - I found this article after googling. https://blog.logrocket.com/guide-react-19-new-document-metadata-feature/
  - Looks like we might not need react-helmet-async, but it will take some work to remove. Let's try it
    `npm uninstall react-helmet-async --force`
  - Note: Here I replaced calls that library: e.g `<Helmet> -> <article>`
- Lets start up the app again
  - `npm run dev`
  - 8:25:35 PM [vite] Internal server error: [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
