################################
## BUILD ENVIRONMENT ###########
################################

# Usar la imagen oficial de Node.js
FROM node:20-alpine3.20 As build

WORKDIR /usr/src/app

COPY package*.json package-lock.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

################################
#### PRODUCTION ENVIRONMENT ####
################################

FROM nginx:stable-alpine as production

# Copiar la configuración de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copiar la salida del build al directorio html de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
