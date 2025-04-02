#!/bin/bash

# Script de configuração e inicialização do servidor MCP para o Piperun
# Este script instala as dependências, cria o arquivo .env e compila o projeto

# Definindo cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Configuração do Servidor MCP para Piperun ===${NC}"

# Verificando se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Por favor, instale o Node.js versão 18 ou superior.${NC}"
    exit 1
fi

# Verificando a versão do Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Versão do Node.js incompatível. É necessário o Node.js 18 ou superior.${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js versão $(node -v) encontrado.${NC}"

# Instalando dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
npm install

# Verificando se a instalação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar dependências. Verifique o log acima para mais detalhes.${NC}"
    exit 1
fi

# Criando arquivo .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}Criando arquivo .env a partir do modelo .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Arquivo .env criado. Por favor, edite-o para adicionar suas credenciais da API Piperun.${NC}"
else
    echo -e "${GREEN}Arquivo .env já existe.${NC}"
fi

# Compilando o projeto
echo -e "${YELLOW}Compilando o projeto...${NC}"
npm run build

# Verificando se a compilação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao compilar o projeto. Verifique o log acima para mais detalhes.${NC}"
    exit 1
fi

echo -e "${GREEN}Projeto compilado com sucesso.${NC}"
echo -e "${GREEN}=== Configuração concluída! ===${NC}"
echo -e "${YELLOW}Para iniciar o servidor no modo stdio (padrão):${NC} npm start"
echo -e "${YELLOW}Para iniciar o servidor no modo HTTP:${NC} MCP_TRANSPORT=http npm start"
echo -e "${YELLOW}Para iniciar o servidor em modo de desenvolvimento:${NC} npm run dev"
