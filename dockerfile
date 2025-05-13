# Usa una imagen oficial de Node.js
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la app
COPY . .

# Expone el puerto que usa Railway (usa la variable de entorno PORT)
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "index.js"]
