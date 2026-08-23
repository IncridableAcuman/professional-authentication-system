# --- Stage 1: Build the static assets ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies using clean install
COPY package*.json ./
RUN npm ci

# Copy source files and build the app
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:1.25-alpine

# Copy the custom nginx configuration for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
