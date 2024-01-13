# Step 1: Build the application
# Use an official Node runtime as a parent image
FROM node:20.10 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json files from your project into the container
COPY package*.json ./
COPY public/ public/
COPY src/ src/

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the application
FROM nginx:alpine

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Open port to the outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
