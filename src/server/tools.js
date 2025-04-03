import { executeCommand } from "../utils/bash.js"; // Using .js extension for ESM compatibility
import { readFile, listFiles, searchGlob, grepSearch, writeFile } from "../utils/file.js";

/**
 * Configura as ferramentas básicas no servidor MCP
 * @param server Instância do servidor MCP a ser configurada
 */
export function setupTools(server) {
  // Bash Tool - Permite executar comandos de shell
  server.tool(
    "bash",
    "Executa um comando de shell",
    {
      command: "string",
      timeout: { type: "number", optional: true }
    },
    async ({ command, timeout }) => {
      try {
        // Verifica comandos proibidos
        const bannedCommands = [
          'alias', 'curl', 'curlie', 'wget', 'axel', 'aria2c', 'nc', 'telnet',
          'lynx', 'w3m', 'links', 'httpie', 'xh', 'http-prompt', 'chrome', 'firefox', 'safari'
        ];
        
        const commandParts = command.split(' ');
        if (bannedCommands.includes(commandParts[0])) {
          return {
            content: [{ 
              type: "text", 
              text: `Erro: O comando '${commandParts[0]}' não é permitido por razões de segurança.`
            }],
            isError: true
          };
        }
        
        const result = await executeCommand(command, timeout);
        return {
          content: [{ type: "text", text: result }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true
        };
      }
    }
  );

  // File Read Tool - Permite ler arquivos do sistema de arquivos
  server.tool(
    "readFile",
    "Lê um arquivo do sistema de arquivos local",
    {
      file_path: "string",
      offset: { type: "number", optional: true },
      limit: { type: "number", optional: true }
    },
    async ({ file_path, offset, limit }) => {
      try {
        const content = await readFile(file_path, offset, limit);
        return {
          content: [{ type: "text", text: content }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true
        };
      }
    }
  );

  // List Files Tool - Lista arquivos e diretórios em um determinado caminho
  server.tool(
    "listFiles",
    "Lista arquivos e diretórios em um determinado caminho",
    {
      path: "string"
    },
    async ({ path }) => {
      try {
        const files = await listFiles(path);
        return {
          content: [{ type: "text", text: JSON.stringify(files, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true
        };
      }
    }
  );

  // Search Glob Tool - Procura arquivos que correspondam a um padrão
  server.tool(
    "searchGlob",
    "Procura arquivos que correspondam a um padrão",
    {
      pattern: "string",
      path: { type: "string", optional: true }
    },
    async ({ pattern, path }) => {
      try {
        const results = await searchGlob(pattern, path);
        return {
          content: [{ type: "text", text: results.join('\n') }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true
        };
      }
    }
  );

  // Grep Tool - Procura texto em arquivos
  server.tool(
    "grep",
    "Procura texto em arquivos",
    {
      pattern: "string",
      path: { type: "string", optional: true },
      include: { type: "string", optional: true }
    },
    async ({ pattern, path, include }) => {
      try {
        const results = await grepSearch(pattern, path, include);
        return {
          content: [{ type: "text", text: results }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true
        };
      }
    }
  );

  // Think Tool - Ferramenta para pensar/raciocinar
  server.tool(
    "think",
    "Uma ferramenta para pensar através de problemas complexos",
    {
      thought: "string"
    },
    async ({ thought }) => {
      return {
        content: [{ 
          type: "text", 
          text: `Processo de pensamento: ${thought}`
        }]
      };
    }
  );
}
