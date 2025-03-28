"""
Módulo de configuração para a integração com a API do PipeRun.
Este módulo gerencia as configurações necessárias para a conexão com a API.
"""
import os
from typing import Optional
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env, se existir
load_dotenv()

class Config:
    """Classe para gerenciar as configurações da API do PipeRun."""
    
    BASE_URL = "https://api.pipe.run/v1"  # URL base atualizada conforme documentação
    DEFAULT_TIMEOUT = 30  # Tempo limite padrão para requisições em segundos

    @staticmethod
    def get_api_token() -> Optional[str]:
        """
        Obtém o token de API do PipeRun das variáveis de ambiente.
        
        Returns:
            Optional[str]: Token de API ou None se não estiver definido
        """
        return os.getenv("PIPERUN_API_TOKEN")
    
    @staticmethod
    def get_headers(token: Optional[str] = None) -> dict:
        """
        Gera os cabeçalhos padrão para as requisições à API.
        
        Args:
            token (Optional[str]): Token de API opcional. Se não fornecido, 
                                 será obtido das variáveis de ambiente.
        
        Returns:
            dict: Cabeçalhos para as requisições à API
        """
        api_token = token or Config.get_api_token()
        
        if not api_token:
            raise ValueError(
                "Token de API não encontrado. Configure a variável de ambiente "
                "PIPERUN_API_TOKEN ou forneça o token como parâmetro."
            )
        
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Token": api_token
        }
