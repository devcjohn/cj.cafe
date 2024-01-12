# cj.cafe

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

## Cloud tools used

- AWS: Cloud hosting.
- GitHub: Code hosting and version control.
- Sentry: Error tracking.
- reCAPTCHA: User verification.



## Docker commands

### Build

docker build . -t cj-cafe:latest

### Run locally

docker run -p 80:80 --name cj-cafe-container cj-cafe:latest

### Delete container

docker rm cj-cafe-container 

### Tag and push to docker hub
docker tag cj-cafe:latest devcjohn/cj-cafe:latest
docker push devcjohn/cj-cafe:latest

## Deploying to AWS

Prerequisites:
- Update terraform files to match your domain name, AWS region, docker image, etc
- Authenticate Terraform with AWS via terraform login

### Create prerequites AWS resources
In AWS Route53, create a hosted zone for the domain name you want to use, if it does not already exist.
In main.tf, update the route53 record names to match this domain (eg name = "cj.cafe" -> name = "your-domain.com")
This applies regardless of whether AWS is your domain registrar or not.
If AWS is not your domain registrar, you will need to update the nameservers in your domain registrar to match the ones in the AWS hosted zone.


### Run terraform
terraform -chdir=tf init
terraform -chdir=tf plan
terraform -chdir=tf apply

### 🎉 Visit website 🎉

In browser, go to https://{domain}

## Debugging: Calling the website directly from the ECS container

### Get Website IP

run `/devscripts/getECS-IP.sh`

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

## TODO:
- Configure load balancer to be useful
- Test that load balancer actually routes traffic and provides high availability
- Separate tf.main into separate files, one for each group of resources
- Use tf local state instead of hardcoding domain name

