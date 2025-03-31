"""
Configurações do Model Context Protocol (MCP) para o PipeRun MCP.

Este módulo define as configurações específicas para o MCP, seguindo as
especificações e melhores práticas do protocolo MCP.
"""
from typing import Dict, Any, List, Optional
import os
import json
import logging

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MCPConfig:
    """Configuração do servidor MCP para o PipeRun."""
    
    def __init__(self):
        """Inicializa as configurações do MCP."""
        self.server_name = "piperun-mcp"
        self.server_version = "1.0.0"
        self.server_description = "Servidor MCP para integração com o CRM PipeRun"
        
        # Configurações de ferramentas
        self.tool_categories = [
            "empresas", 
            "contatos", 
            "negócios", 
            "funis", 
            "etapas", 
            "tarefas", 
            "relatórios",
            "prompts"
        ]
        
        # Configurações de autenticação
        self.require_auth = False
        self.auth_method = "token"
        
        # Suporte a recursos
        self.support_resources = False
        
        # Suporte a prompts
        self.support_prompts = True
        
        # Configurações de transporte
        self.transports = ["http", "jsonrpc"]
        
        # Limites e restrições
        self.max_concurrent_requests = 10
        self.request_timeout_seconds = 30
        self.max_tool_execution_time_seconds = 60
        
        # Carrega configurações do arquivo se existir
        self._load_config_from_file()
    
    def _load_config_from_file(self):
        """Carrega as configurações de um arquivo JSON se existir."""
        config_path = os.path.join(os.path.dirname(__file__), '..', 'mcp_config.json')
        
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                # Atualiza as configurações com base no arquivo
                for key, value in config.items():
                    if hasattr(self, key):
                        setattr(self, key, value)
                
                logger.info(f"Configurações MCP carregadas de {config_path}")
            except Exception as e:
                logger.error(f"Erro ao carregar configurações MCP: {str(e)}")
    
    def to_dict(self) -> Dict[str, Any]:
        """Converte as configurações para um dicionário."""
        return {
            "server": {
                "name": self.server_name,
                "version": self.server_version,
                "description": self.server_description
            },
            "capabilities": {
                "tools": True,
                "resources": self.support_resources,
                "prompts": self.support_prompts
            },
            "tool_categories": self.tool_categories,
            "authentication": {
                "required": self.require_auth,
                "method": self.auth_method
            },
            "transports": self.transports,
            "limits": {
                "max_concurrent_requests": self.max_concurrent_requests,
                "request_timeout_seconds": self.request_timeout_seconds,
                "max_tool_execution_time_seconds": self.max_tool_execution_time_seconds
            }
        }
    
    def save_to_file(self):
        """Salva as configurações em um arquivo JSON."""
        config_path = os.path.join(os.path.dirname(__file__), '..', 'mcp_config.json')
        
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.to_dict(), f, indent=2)
            
            logger.info(f"Configurações MCP salvas em {config_path}")
        except Exception as e:
            logger.error(f"Erro ao salvar configurações MCP: {str(e)}")

# Instância global de configuração
mcp_config = MCPConfig()
