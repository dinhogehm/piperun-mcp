import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Lê o conteúdo de um arquivo
 * @param {string} filePath - Caminho absoluto para o arquivo
 * @param {number} offset - Linha inicial (opcional)
 * @param {number} limit - Número de linhas a ler (opcional)
 * @returns {Promise<string>} - Conteúdo do arquivo
 */
export async function readFile(filePath, offset = 0, limit = 0) {
  try {
    // Verifica se o arquivo existe
    await fs.access(filePath);

    // Lê o arquivo completo
    const content = await fs.readFile(filePath, 'utf8');
    
    // Se não tiver offset ou limit, retorna o conteúdo completo
    if (!offset && !limit) {
      return content;
    }
    
    // Divide o conteúdo em linhas
    const lines = content.split('\n');
    
    // Calcula o intervalo de linhas a retornar
    const startLine = Math.max(0, offset);
    const endLine = limit ? Math.min(lines.length, startLine + limit) : lines.length;
    
    // Retorna as linhas solicitadas
    return lines.slice(startLine, endLine).join('\n');
  } catch (error) {
    throw new Error(`Erro ao ler arquivo ${filePath}: ${error.message}`);
  }
}

/**
 * Lista arquivos e diretórios em um caminho
 * @param {string} directoryPath - Caminho do diretório
 * @returns {Promise<Array>} - Lista de arquivos e diretórios
 */
export async function listFiles(directoryPath) {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    
    const fileInfoPromises = entries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      
      // Obtém informações do arquivo/diretório
      const stats = await fs.stat(fullPath);
      
      return {
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: stats.size,
        modifiedTime: stats.mtime
      };
    });
    
    return await Promise.all(fileInfoPromises);
  } catch (error) {
    throw new Error(`Erro ao listar diretório ${directoryPath}: ${error.message}`);
  }
}

/**
 * Procura arquivos que correspondam a um padrão glob
 * @param {string} pattern - Padrão glob
 * @param {string} searchPath - Diretório de busca (opcional)
 * @returns {Promise<Array<string>>} - Lista de arquivos encontrados
 */
export async function searchGlob(pattern, searchPath = '.') {
  try {
    // Usa find com -name para buscar arquivos
    const command = `find ${searchPath} -type f -name "${pattern}" | sort`;
    const { stdout } = await execPromise(command);
    
    // Retorna a lista de arquivos encontrados
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    throw new Error(`Erro ao procurar arquivos com padrão ${pattern}: ${error.message}`);
  }
}

/**
 * Procura por texto em arquivos
 * @param {string} pattern - Padrão de texto a procurar
 * @param {string} searchPath - Diretório de busca (opcional)
 * @param {string} include - Padrão de arquivos a incluir (opcional)
 * @returns {Promise<string>} - Resultados da busca
 */
export async function grepSearch(pattern, searchPath = '.', include) {
  try {
    let command = `grep -r "${pattern}" ${searchPath}`;
    
    // Adiciona filtro por tipo de arquivo, se especificado
    if (include) {
      command += ` --include="${include}"`;
    }
    
    const { stdout } = await execPromise(command);
    return stdout.trim();
  } catch (error) {
    // grep retorna código 1 quando não encontra resultados, o que não é um erro
    if (error.code === 1 && !error.stderr) {
      return "Nenhum resultado encontrado.";
    }
    
    throw new Error(`Erro ao procurar texto "${pattern}": ${error.message}`);
  }
}

/**
 * Escreve conteúdo em um arquivo
 * @param {string} filePath - Caminho do arquivo
 * @param {string} content - Conteúdo a escrever
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content) {
  try {
    // Cria diretórios necessários
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    
    // Escreve o conteúdo no arquivo
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Erro ao escrever no arquivo ${filePath}: ${error.message}`);
  }
}
