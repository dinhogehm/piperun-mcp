FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração de dependências
COPY package*.json tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/
COPY .env.example ./.env

# Compilar o TypeScript
RUN npm run build

# Expor porta para servidor HTTP
EXPOSE 3000

# Comando para iniciar o servidor HTTP
CMD ["npm", "run", "start:docker"]
