# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Vite bakes VITE_* vars in at build time — set them as build variables in Coolify
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_LOTS_INSTALLER

COPY . .
RUN npm run build

# Runtime stage: static file server with SPA fallback
FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4 --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/dist ./dist

ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:$PORT"]
