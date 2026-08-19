# --- Étape 1 : build ---
# Compile le projet React/Vite en fichiers statiques (dist/).
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL doit être connue AU MOMENT DU BUILD (Vite intègre les
# variables d'environnement directement dans le JS généré, contrairement
# au backend où elles sont lues au runtime) — voir docker-compose.yml
# pour la valeur transmise via --build-arg.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Étape 2 : service via Nginx ---
# Image finale minimale : juste Nginx + les fichiers statiques buildés,
# rien de Node ni du code source.
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]