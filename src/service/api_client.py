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
        Processa a resposta da API e trata erros.
        
        Args:
            response (requests.Response): Resposta da requisição.
            
        Returns:
            Dict: Resposta processada como dicionário.
            
        Raises:
            ValueError: Se a resposta contiver erro.
        """
        try:
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            logger.error(f"Erro na requisição: {str(e)}")
            error_message = "Erro de conexão com a API"
            
            if response.text:
                try:
                    error_data = response.json()
                    if "error" in error_data:
                        error_message = f"Erro da API: {error_data['error']}"
                    elif "message" in error_data:
                        error_message = f"Erro da API: {error_data['message']}"
                except json.JSONDecodeError:
                    error_message = f"Erro da API: {response.text}"
            
            raise ValueError(f"{error_message} (Status: {response.status_code})")
    
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
        
        try:
            response = requests.get(
                url, 
                headers=self.headers, 
                params=params, 
                timeout=Config.DEFAULT_TIMEOUT
            )
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
