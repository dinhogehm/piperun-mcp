FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Porta que será exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
