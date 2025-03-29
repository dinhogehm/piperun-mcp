#!/usr/bin/env python3
"""
Script ponte para conectar o protocolo STDIO esperado pelo MCP do Windsurf
com o servidor HTTP JSON-RPC do PipeRun.

Este script:
1. Lê solicitações JSON-RPC do stdin
2. Envia essas solicitações para o servidor HTTP JSON-RPC
3. Retorna as respostas para o stdout

Executar como:
python mcp_bridge.py
"""
import sys
import json
import requests
from urllib.parse import urljoin

# Configurações
SERVER_URL = "http://localhost:8000/jsonrpc"
DEBUG = False

def debug_log(message):
    """Função para log de depuração."""
    if DEBUG:
        with open("/tmp/mcp_bridge.log", "a") as log_file:
            log_file.write(f"{message}\n")

def main():
    """Função principal que processa a entrada e saída."""
    debug_log("Iniciando MCP Bridge")
    
    # Lê linhas do stdin
    for line in sys.stdin:
        try:
            # Tenta fazer o parse da linha como JSON
            request = json.loads(line)
            debug_log(f"Requisição recebida: {request}")
            
            # Envia a requisição para o servidor HTTP
            response = requests.post(
                SERVER_URL,
                json=request,
                headers={"Content-Type": "application/json"}
            )
            
            # Verifica se a requisição foi bem-sucedida
            if response.status_code == 200:
                try:
                    result = response.json()
                    debug_log(f"Resposta recebida: {result}")
                    
                    # Envia a resposta para o stdout
                    print(json.dumps(result))
                    sys.stdout.flush()
                except json.JSONDecodeError:
                    error_response = {
                        "jsonrpc": "2.0",
                        "error": {
                            "code": -32603,
                            "message": "Erro interno do servidor: resposta inválida"
                        },
                        "id": request.get("id")
                    }
                    print(json.dumps(error_response))
                    sys.stdout.flush()
            else:
                # Em caso de erro, retorna uma resposta de erro padrão
                error_response = {
                    "jsonrpc": "2.0",
                    "error": {
                        "code": -32603,
                        "message": f"Erro do servidor: {response.status_code}"
                    },
                    "id": request.get("id")
                }
                debug_log(f"Erro HTTP: {response.status_code}")
                print(json.dumps(error_response))
                sys.stdout.flush()
                
        except json.JSONDecodeError:
            debug_log(f"Erro ao processar JSON: {line}")
            
            # Se a entrada não for um JSON válido, ignora
            continue
        except Exception as e:
            debug_log(f"Erro inesperado: {str(e)}")
            
            # Em caso de erro inesperado, tenta continuar
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
