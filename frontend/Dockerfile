# Etapa de construcción de Next.js
FROM node:20 AS builder

WORKDIR /app

# Copiar archivos y paquetes
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Construir Next.js
RUN npm run build

# Etapa de producción con Node.js
FROM node:20-alpine

WORKDIR /app

# Copiar solo el build de Next.js
COPY --from=builder /app ./

# Exponer el puerto del frontend
EXPOSE 3000

# Iniciar Next.js
CMD ["npm", "start"]
