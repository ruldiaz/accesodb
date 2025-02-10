# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos y paquetes
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Comando para iniciar el backend
CMD ["npm", "start"]
