#!/usr/bin/env node

/**
 * Script para corrigir importações relativas para o formato ESM
 * Adiciona a extensão .js nas importações relativas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório base do projeto
const baseDir = path.resolve(__dirname, '../src');

// Expressão regular para encontrar importações relativas sem extensão
const importRegex = /from\s+['"](\.[^'"]+)['"]/g;

// Função para processar um arquivo
function processFile(filePath) {
  // Só processa arquivos .ts
  if (!filePath.endsWith('.ts')) {
    return;
  }

  console.log(`Processando: ${filePath}`);

  // Lê o conteúdo do arquivo
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Encontra e substitui importações relativas
  let modified = content.replace(importRegex, (match, importPath) => {
    // Se já tiver extensão, mantém como está
    if (importPath.includes('.js')) {
      return match;
    }
    // Adiciona a extensão .js
    return `from '${importPath}.js'`;
  });

  // Se houve mudanças, salva o arquivo
  if (content !== modified) {
    console.log(`Atualizando importações em: ${filePath}`);
    fs.writeFileSync(filePath, modified, 'utf8');
  }
}

// Função para percorrer diretórios recursivamente
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      walkDir(filePath);
    } else {
      processFile(filePath);
    }
  });
}

// Inicia o processamento
console.log('Iniciando correção das importações relativas para formato ESM...');
walkDir(baseDir);
console.log('Correção finalizada!');
