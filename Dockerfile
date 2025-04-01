FROM node:18-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala todas as dependências, garantindo que a flag --production não esteja ativa
RUN npm config set legacy-peer-deps true \
    && npm install --no-production --verbose \
    && echo "Verificando se o SDK está instalado:" \
    && ls -la node_modules/@modelcontextprotocol \
    && cat node_modules/@modelcontextprotocol/sdk/package.json

# Copia o restante dos arquivos 
COPY . .

# Verificar se o tsconfig.json tem o conteúdo correto
RUN cat tsconfig.json

# Build da aplicação com verbose
RUN npm run build -- --verbose

# Porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
