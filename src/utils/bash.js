import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Executa um comando de shell e retorna a saída
 * @param {string} command - O comando a ser executado
 * @param {number} timeout - Tempo limite em milissegundos (opcional, padrão: 10000ms)
 * @returns {Promise<string>} - A saída do comando (stdout ou stderr em caso de erro)
 */
export async function executeCommand(command, timeout = 10000) {
  try {
    // Define um tempo limite máximo para evitar comandos que nunca terminam
    const maxTimeout = Math.min(timeout || 10000, 600000); // Máximo de 10 minutos
    
    console.error(`Executando comando: ${command}`);
    
    const options = {
      timeout: maxTimeout,
      maxBuffer: 10 * 1024 * 1024 // 10MB de buffer para saídas grandes
    };
    
    const { stdout, stderr } = await execPromise(command, options);
    
    if (stderr && stderr.trim()) {
      console.error(`Aviso ao executar comando: ${stderr}`);
    }
    
    return stdout;
  } catch (error) {
    // Em caso de erro, retorna a mensagem de erro e o stderr se disponível
    const errorMessage = `Erro ao executar comando: ${error.message}`;
    if (error.stderr) {
      return `${errorMessage}\n${error.stderr}`;
    }
    return errorMessage;
  }
}
