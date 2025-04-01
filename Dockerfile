FROM node:18-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala todas as dependências, incluindo devDependencies, para garantir a compilação
RUN npm install --verbose

# Copia o restante dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

# Porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
