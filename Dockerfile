# Etapa de construcción
FROM node:16-alpine AS build

# Directorio de trabajo en el contenedor
WORKDIR /app

# Instala las dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente y crea los archivos de producción
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos construidos desde la fase de build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
