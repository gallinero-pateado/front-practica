################################
## BUILD ENVIRONMENT ###########
################################

# Usa la imagen oficial de Node.js
FROM node:20-alpine3.20 As build

WORKDIR /usr/src/app

# Copia los archivos de configuración y dependencias
COPY package*.json package-lock.json ./
RUN npm ci

# Copia todo el código fuente del proyecto
COPY ./ ./

# Ejecuta la build de Vite (React)
RUN npm run build

# Depuración: Verifica que los archivos de la build estén en la carpeta dist
RUN ls -al /usr/src/app/dist

################################
#### PRODUCTION ENVIRONMENT ####
################################

# Usa la imagen oficial de NGINX para producción
FROM nginx:stable-alpine as production

# Copia la configuración de Nginx al contenedor
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copia los archivos generados por Vite (build) al directorio html de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Ejecuta Nginx en primer plano
ENTRYPOINT ["nginx", "-g", "daemon off;"]
