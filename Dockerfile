# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Create a basic nginx configuration that routes everything to index.html for React Router
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
# Use a script to inject the GEMINI_API_KEY environment variable before starting nginx
CMD ["/bin/sh", "-c", "echo \"window.ENV = { GEMINI_API_KEY: '${GEMINI_API_KEY}' };\" > /usr/share/nginx/html/env.js && nginx -g \"daemon off;\""]
