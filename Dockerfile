# Base image
FROM nginx:alpine

# Copy hasil build
# COPY dist/ /usr/share/nginx/html

# Ganti default config NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3001

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]