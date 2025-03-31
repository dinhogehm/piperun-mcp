#!/usr/bin/env python3
"""
Script ponte para conectar o protocolo STDIO esperado pelo MCP
com o servidor HTTP do PipeRun MCP.

Este script implementa um cliente MCP via STDIO que:
1. Lê solicitações JSON do stdin seguindo o protocolo MCP
2. Envia essas solicitações para o servidor HTTP do PipeRun MCP
3. Retorna as respostas para o stdout

Executar como:
python mcp_bridge.py
"""
import sys
import json
import os
import requests
import logging
from typing import Dict, Any, Optional
from urllib.parse import urljoin

# Configurações
DEFAULT_SERVER_URL = "http://localhost:8000"
DEBUG = os.environ.get("MCP_BRIDGE_DEBUG", "false").lower() == "true"

# Configuração de logging
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename="/tmp/mcp_bridge.log" if DEBUG else None
)
logger = logging.getLogger("mcp_bridge")

def debug_log(message):
    """Função para log de depuração."""
    if DEBUG:
        logger.debug(message)

class MCPBridge:
    """Implementação da ponte MCP para PipeRun."""
    
    def __init__(self, server_url: str = DEFAULT_SERVER_URL):
        """
        Inicializa a ponte MCP.
        
        Args:
            server_url: URL base do servidor PipeRun MCP
        """
        self.server_url = server_url
        self.tools_cache = None
        debug_log(f"Iniciando MCP Bridge com servidor: {server_url}")
    
    def fetch_tools(self) -> Dict[str, Any]:
        """
        Busca a lista de ferramentas disponíveis no servidor MCP.
        
        Returns:
            Dict[str, Any]: Lista de ferramentas disponíveis
        """
        if self.tools_cache:
            return self.tools_cache
        
        try:
            response = requests.get(
                urljoin(self.server_url, "/mcp/tools"),
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.tools_cache = response.json()
                return self.tools_cache
            else:
                logger.error(f"Erro ao buscar ferramentas: {response.status_code}")
                return {"tools": []}
        except Exception as e:
            logger.error(f"Erro ao buscar ferramentas: {str(e)}")
            return {"tools": []}
    
    def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executa uma ferramenta específica no servidor MCP.
        
        Args:
            tool_name: Nome da ferramenta a ser executada
            parameters: Parâmetros para a ferramenta
            
        Returns:
            Dict[str, Any]: Resultado da execução da ferramenta
        """
        try:
            payload = {
                "input": parameters
            }
            
            response = requests.post(
                urljoin(self.server_url, f"/mcp/tools/{tool_name}"),
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_data = response.json() if response.content else {"error": {"message": "Erro desconhecido"}}
                return {
                    "status": "error",
                    "error": error_data.get("error", {"message": f"Erro do servidor: {response.status_code}"})
                }
        except Exception as e:
            logger.error(f"Erro ao executar ferramenta: {str(e)}")
            return {
                "status": "error",
                "error": {
                    "type": "execution_error",
                    "message": str(e)
                }
            }
    
    def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processa uma requisição MCP.
        
        Args:
            request: Requisição MCP em formato JSON
            
        Returns:
            Dict[str, Any]: Resposta para a requisição
        """
        debug_log(f"Processando requisição: {request}")
        
        # Identifica o tipo de requisição
        if "method" in request:
            method = request.get("method")
            
            # Lista de ferramentas
            if method == "mcp.list_tools":
                return {
                    "jsonrpc": "2.0",
                    "result": self.fetch_tools(),
                    "id": request.get("id")
                }
            
            # Execução de ferramenta
            elif method == "mcp.run_tool":
                params = request.get("params", {})
                tool_name = params.get("tool_name")
                parameters = params.get("parameters", {})
                
                if not tool_name:
                    return {
                        "jsonrpc": "2.0",
                        "error": {
                            "code": -32602,
                            "message": "Parâmetro 'tool_name' é obrigatório"
                        },
                        "id": request.get("id")
                    }
                
                result = self.execute_tool(tool_name, parameters)
                
                if result.get("status") == "error":
                    return {
                        "jsonrpc": "2.0",
                        "error": {
                            "code": -32000,
                            "message": result.get("error", {}).get("message", "Erro desconhecido")
                        },
                        "id": request.get("id")
                    }
                else:
                    return {
                        "jsonrpc": "2.0",
                        "result": result.get("output"),
                        "id": request.get("id")
                    }
            else:
                return {
                    "jsonrpc": "2.0",
                    "error": {
                        "code": -32601,
                        "message": f"Método não suportado: {method}"
                    },
                    "id": request.get("id")
                }
        else:
            return {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32600,
                    "message": "Requisição inválida"
                },
                "id": request.get("id", None)
            }

def main():
    """Função principal que processa a entrada e saída."""
    server_url = os.environ.get("MCP_SERVER_URL", DEFAULT_SERVER_URL)
    bridge = MCPBridge(server_url)
    
    debug_log("Iniciando MCP Bridge")
    
    # Lê linhas do stdin
    for line in sys.stdin:
        try:
            # Tenta fazer o parse da linha como JSON
            request = json.loads(line)
            debug_log(f"Requisição recebida: {request}")
            
            # Processa a requisição
            response = bridge.process_request(request)
            debug_log(f"Resposta: {response}")
            
            # Envia a resposta para o stdout
            print(json.dumps(response))
            sys.stdout.flush()
                
        except json.JSONDecodeError:
            logger.error(f"Erro ao processar JSON: {line}")
            
            # Se a entrada não for um JSON válido, envia uma resposta de erro
            error_response = {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32700,
                    "message": "Parse error: JSON inválido"
                },
                "id": None
            }
            print(json.dumps(error_response))
            sys.stdout.flush()
            
        except Exception as e:
            logger.error(f"Erro inesperado: {str(e)}")
            
            # Em caso de erro inesperado, envia uma resposta de erro
            error_response = {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32603,
                    "message": f"Erro interno: {str(e)}"
                },
                "id": None
            }
            print(json.dumps(error_response))
            sys.stdout.flush()

if __name__ == "__main__":
    main()
