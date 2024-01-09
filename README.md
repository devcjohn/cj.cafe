# cj.pro

## Overview

This is my personal portfolio website.
It contains an overview of who I am, a blog, a word game, and some miscellanous demos.
This website was built to be responsibe, so every page should work well on both mobile and larger screens.

## Credits

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

## Development Tools Used

- VSCode: IDE.
- Vite: Build tool.
- React: UI library.
- TypeScript: Static type checker.
- tailwindcss: Utility-first CSS framework.
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

## Cloud tools used

- Netlify: Code deployment.
- GitHub: Code hosting and version control.
- Sentry: Error tracking.
- reCAPTCHA: User verification.


## Docker commands

### Build

docker build . -t cj.pro:latest

### Run locally

docker run -p 80:80 --name cj.pro-container cj.pro:latest

### Delete container

docker rm cj.pro-container 

### Tag and push to docker hub
docker tag cj-pro:latest devcjohn/cj.pro:latest
docker push devcjohn/cj.pro:latest

## Deploying to AWS

Prerequisite: Image referenced in main.tf is built and pushed to docker hub

### Run terraform
terraform init
terraform plan
terraform apply

### Get Website IP

run /devscripts/getECS-IP.sh

OR

In AWS console -> 
Amazon Elastic Container Service -> 
Clusters -> 
my-app-cluster-name -> 
Services -> 
app -> 
Tasks -> 
{task ID} eg 58f303d7d4e948559a7c73f1e74c81ca -> 
Configuration -> 
"Public IP"

### Ping the IP
ping {IP from last step}
eg ping 3.17.13.170

### View website
in browser, go to {IP from last step}

