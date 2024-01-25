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

### Code Tools Used

- VSCode: IDE.
- Vite: Build tool.
- React: UI library.
- TypeScript: Static type checker.
- tailwindcss: Utility-first CSS framework.
- Terraform: Infrastructure as code.
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

## Docker commands

### Build

docker build . -t cj-cafe:1.1

### Run locally

docker run -p 80:80 --name cj-cafe-container cj-cafe:1.1

### Delete container

docker rm cj-cafe-container

### Tag and push to docker hub

docker tag cj-cafe:1.1 devcjohn/cj-cafe:1.1
docker push devcjohn/cj-cafe:1.1

### Deploying to AWS

Prerequisites:

- Update terraform files to match your domain name, AWS region, docker image, etc
- Authenticate Terraform with AWS via terraform login

### Create prerequites AWS resources

In AWS Route53, create a hosted zone for the domain name you want to use, if it does not already exist.
In variables.tf, update the route53 record names to match this domain (eg name = "cj.cafe" -> name = "your-domain.com")
This applies regardless of whether AWS is your domain registrar or not.
If AWS is not your domain registrar, you will need to update the nameservers in your domain registrar to match the ones in the AWS Hosted Zone.

### Run terraform

cd tf
terraform init
terraform plan
terraform apply

### 🎉 Visit website 🎉

In browser, go to https://{domain}

## Testing & Debugging

### Remote Into Container

aws ecs execute-command
--region us-east-2
--cluster {cluster_name}  
 --task {taskId}  
 --container frontend-container  
 --command "sh"  
 --interactive

### Cause CPU spike (simulate high traffic) to trigger autoscaling

dd if=/dev/zero of=/dev/null

## TODO:

- Better nginx error pages
- route all traffic to cj.cafe
