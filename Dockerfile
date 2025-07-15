# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or bun.lockb)
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
# Using bun if bun.lockb exists, otherwise npm
RUN if [ -f bun.lockb ]; then \
      npm install -g bun && bun install; \
    else \
      npm install; \
    fi

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]