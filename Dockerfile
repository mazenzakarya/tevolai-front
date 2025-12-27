# Stage 1 — build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2 — serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/tevolai/browser /usr/share/nginx/html
EXPOSE 80
