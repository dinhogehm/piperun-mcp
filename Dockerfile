FROM node:18-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala todas as dependências, garantindo que a flag --production não esteja ativa
RUN npm config set legacy-peer-deps true \
    && npm install --no-production \
    && echo "Verificando se o SDK está instalado:" \
    && ls -la node_modules/@modelcontextprotocol

# Copia o restante dos arquivos 
COPY . .

# Verificar se o tsconfig.json tem o conteúdo correto
RUN cat tsconfig.json

# Alternativa: instalar o SDK globalmente para garantir que o TypeScript o encontre
RUN npm install -g @modelcontextprotocol/sdk@1.8.0 \
    && npm list -g @modelcontextprotocol/sdk

# Build da aplicação
RUN npm run build

# Porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
