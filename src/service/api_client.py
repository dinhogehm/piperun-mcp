"""
Cliente API para integração com o PipeRun.
Este módulo implementa um cliente para realizar requisições à API do PipeRun.
"""
import json
import logging
from typing import Dict, List, Optional, Union, Any

import requests
from requests.exceptions import RequestException

from ..config import Config

# Configuração de logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PipeRunApiClient:
    """
    Cliente para interagir com a API do PipeRun.
    """
    
    def __init__(self, api_token: Optional[str] = None, base_url: Optional[str] = None):
        """
        Inicializa o cliente da API do PipeRun.
        
        Args:
            api_token (Optional[str]): Token de API para autenticação.
                                      Se não fornecido, será buscado nas variáveis de ambiente.
            base_url (Optional[str]): URL base da API do PipeRun.
                                     Se não fornecido, será usado o valor padrão.
        """
        self.api_token = api_token or Config.get_api_token()
        self.base_url = base_url or Config.BASE_URL
        self.headers = Config.get_headers(self.api_token)
    
    def _handle_response(self, response: requests.Response) -> Dict:
        """
        Processa a resposta da API e verifica erros.
        
        Args:
            response (requests.Response): Resposta da requisição.
            
        Returns:
            Dict: Conteúdo da resposta como dicionário.
            
        Raises:
            ValueError: Se a resposta contém erros.
        """
        try:
            logger.info(f"Corpo da resposta: {response.text}")
            
            data = response.json()
            logger.info(f"Dados JSON da resposta: {data}")
            
            if not response.ok:
                error_msg = data.get("error", {}).get("message", "Erro desconhecido")
                logger.error(f"Erro na API: {error_msg}")
                raise ValueError(f"Erro na API do PipeRun: {error_msg}")
            
            if data.get("success") is False:  # Verifica explicitamente se success é False
                error_msg = data.get("message", "Erro desconhecido")
                logger.error(f"Operação não teve sucesso: {error_msg}")
                raise ValueError(f"Operação não teve sucesso: {error_msg}")
            
            # Retorna o objeto de resposta completo, mantendo a estrutura original
            return data
            
        except json.JSONDecodeError:
            logger.error(f"Erro ao decodificar JSON: {response.text}")
            raise ValueError(f"Resposta inválida da API: {response.text}")
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """
        Realiza uma requisição GET à API do PipeRun.
        
        Args:
            endpoint (str): Endpoint da API (sem a URL base).
            params (Optional[Dict]): Parâmetros para a requisição.
            
        Returns:
            Dict: Resposta da API como dicionário.
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        logger.info(f"GET {url}")
        logger.info(f"Headers: {self.headers}")
        logger.info(f"Params: {params}")
        
        try:
            response = requests.get(
                url, 
                headers=self.headers, 
                params=params, 
                timeout=Config.DEFAULT_TIMEOUT
            )
            logger.info(f"URL completa: {response.request.url}")
            logger.info(f"Status: {response.status_code}")
            return self._handle_response(response)
        except Exception as e:
            logger.error(f"Erro na requisição GET para {url}: {str(e)}")
            raise
    
    def post(self, endpoint: str, data: Dict) -> Dict:
        """
        Realiza uma requisição POST à API do PipeRun.
        
        Args:
            endpoint (str): Endpoint da API (sem a URL base).
            data (Dict): Dados para enviar no corpo da requisição.
            
        Returns:
            Dict: Resposta da API como dicionário.
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        logger.info(f"POST {url}")
        
        try:
            response = requests.post(
                url, 
                headers=self.headers, 
                json=data, 
                timeout=Config.DEFAULT_TIMEOUT
            )
            return self._handle_response(response)
        except Exception as e:
            logger.error(f"Erro na requisição POST para {url}: {str(e)}")
            raise
    
    def put(self, endpoint: str, data: Dict) -> Dict:
        """
        Realiza uma requisição PUT à API do PipeRun.
        
        Args:
            endpoint (str): Endpoint da API (sem a URL base).
            data (Dict): Dados para enviar no corpo da requisição.
            
        Returns:
            Dict: Resposta da API como dicionário.
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        logger.info(f"PUT {url}")
        
        try:
            response = requests.put(
                url, 
                headers=self.headers, 
                json=data, 
                timeout=Config.DEFAULT_TIMEOUT
            )
            return self._handle_response(response)
        except Exception as e:
            logger.error(f"Erro na requisição PUT para {url}: {str(e)}")
            raise
    
    def delete(self, endpoint: str) -> Dict:
        """
        Realiza uma requisição DELETE à API do PipeRun.
        
        Args:
            endpoint (str): Endpoint da API (sem a URL base).
            
        Returns:
            Dict: Resposta da API como dicionário.
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        logger.info(f"DELETE {url}")
        
        try:
            response = requests.delete(
                url, 
                headers=self.headers, 
                timeout=Config.DEFAULT_TIMEOUT
            )
            return self._handle_response(response)
        except Exception as e:
            logger.error(f"Erro na requisição DELETE para {url}: {str(e)}")
            raise
