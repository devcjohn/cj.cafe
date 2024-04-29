# cj.cafe

## Overview

This is my personal portfolio website.
It contains an overview of who I am, a blog, a word game, and some miscellanous demos.
This website was built to be responsibe, so every page should work well on both mobile and larger screens.

### Credits

- Styling and theme inspiration
  - https://atom.redpixelthemes.com/
- Icons
  - https://www.iconfinder.com/iconsets/circle-icons-1
  - https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg
  - https://www.iconpacks.net/free-icon/gear-1213.html
- Laptop Pic
  - https://unsplash.com/photos/95YRwf6CNw8?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
- Word Hints for Hintle
  - https://www.datamuse.com/api/
- Helpful Gist by https://github.com/Al-un
  - https://gist.github.com/Al-un/1793f4491d2783d7974bb284188611d1

### Code Tools Used

- VSCode: IDE.
- Vite: Build tool.
- React: UI library.
- TypeScript: Static type checker.
- tailwindcss: Utility-first CSS framework.
- AWS Cloudformation: Infrastructure as code.
- Git: Version control.
- react-router-dom: Navigation components.
- @sentry/react: Crash reporting.
- react-test-renderer: Render React components to JS objects.
- @testing-library/react: React DOM testing utilities.
- @testing-library/user-event: Simulate user events.
- eslint: Code linting.
- prettier: Code formatting.
- postcss: Transform CSS with JS plugins.
- vitest: Test runner for Vite.
- vite-bundle-visualizer: Visualize bundle content.
- react-simple-keyboard: On-screen keyboard.
- react-markdown: Render markdown as React components.
- react-syntax-highlighter: Syntax highlighting for code blocks.

### Cloud tools used

- AWS: Cloud hosting.
- GitHub: Code hosting and version control.
- Sentry: Error tracking.
- reCAPTCHA: User verification.

## Dev Setup and Deployment

## Testing & Debugging

- Better nginx error pages
- route all traffic to cj.cafe

# Cloudformation Infrastructure Deployment

### Prerequisites:

- Have a hosted zone for a domain in AWS Route53.
  - In my case this is cj.cafe
- If Route53 is your domain registrar, no further work is needed.
- If AWS is not your domain registrar, you will need to update the nameservers in your domain registrar to match the ones in the AWS Hosted Zone.
- Go to AWS Certificate Manager and create a certificate for the hosted zone
- Take the ARN of that Certificate and add it as a parameter in './infrastructure-deploy.sh'
  - It should look something like: arn:aws:acm:us-east-1:aws-account-#:certificate/id

### Validating template

```
brew install cfn-lint
cfn-lint aws-cloudformation-stack.yml
aws cloudformation validate-template --template-body file://aws-cloudformation-stack.yml
```

### Deploying infraustructure

```
./infrastructure-deploy.sh
```

### Deploying Code

After infrastructure has finished deploying, run:

```
./code-deploy.sh
```

### Tear down infrastructure

```
aws cloudformation delete-stack --stack cj-cafe-stack
```

## Infra TODO:

make bucket publicly accessible?
In Cloudformation, add 404 and 403 redirects to index.html with 200 OK
