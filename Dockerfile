FROM node:18-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala todas as dependências (incluindo dev dependencies)
RUN npm config set legacy-peer-deps true \
    && npm install

# Copia o restante dos arquivos 
COPY . .

# Build da aplicação usando tsc com a opção --skipLibCheck para evitar problemas de tipos
RUN npm run build -- --skipLibCheck

# Porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
