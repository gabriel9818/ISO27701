# Usa imagen oficial de Node.js
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copia dependencias
COPY package*.json ./
RUN npm install --omit=dev

# Copia el resto de la app
COPY . .

# Expone el puerto proporcionado por Railway
EXPOSE 8080

# Inicia el servidor
CMD [ "npm", "start" ]
