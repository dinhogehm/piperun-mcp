"""
Utilitários para as ferramentas de interação com o PipeRun.
Este módulo contém funções auxiliares comuns a várias ferramentas.
"""
import json
import os
from typing import Dict, Any, Optional, List

from ..service.api_client import PipeRunApiClient


def format_date(date: str) -> str:
    """
    Formata uma data para o padrão aceito pela API (YYYY-MM-DD).
    
    Args:
        date (str): Data no formato aceito pelo Python (pode ser DD/MM/YYYY ou YYYY-MM-DD).
        
    Returns:
        str: Data formatada para o padrão da API.
    """
    # Verifica se a data já está no padrão correto
    if len(date) == 10 and date[4] == '-' and date[7] == '-':
        return date
    
    # Tenta converter de DD/MM/YYYY para YYYY-MM-DD
    try:
        if '/' in date:
            day, month, year = date.split('/')
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
    except ValueError:
        pass
    
    # Retorna a string original se não for possível formatar
    return date


def save_token_to_env(token: str) -> bool:
    """
    Salva o token de API em um arquivo .env.
    
    Args:
        token (str): Token de API do PipeRun.
        
    Returns:
        bool: True se o token foi salvo com sucesso, False caso contrário.
    """
    try:
        # Verifica se .env já existe e preserva seu conteúdo
        env_content = {}
        if os.path.exists('.env'):
            with open('.env', 'r') as env_file:
                for line in env_file:
                    if '=' in line:
                        key, value = line.strip().split('=', 1)
                        env_content[key] = value
        
        # Atualiza o token
        env_content['PIPERUN_API_TOKEN'] = token
        
        # Escreve o arquivo .env atualizado
        with open('.env', 'w') as env_file:
            for key, value in env_content.items():
                env_file.write(f"{key}={value}\n")
        
        return True
    except Exception:
        return False


def build_query_params(
    search: Optional[str] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Constrói parâmetros de consulta para requisições à API.
    
    Args:
        search (Optional[str]): Termo para busca.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        **kwargs: Parâmetros adicionais específicos de cada endpoint.
        
    Returns:
        Dict[str, Any]: Dicionário de parâmetros para a requisição.
    """
    params = {}
    
    if search:
        params["search"] = search
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    # Adiciona parâmetros específicos
    for key, value in kwargs.items():
        if value is not None:
            if isinstance(value, bool):
                params[key] = 1 if value else 0
            else:
                params[key] = value
    
    return params


def validate_enum(value: str, valid_options: List[str], field_name: str) -> Optional[str]:
    """
    Valida se um valor está entre as opções válidas para um campo.
    
    Args:
        value (str): Valor a ser validado.
        valid_options (List[str]): Lista de opções válidas.
        field_name (str): Nome do campo para mensagem de erro.
        
    Returns:
        Optional[str]: Mensagem de erro se inválido, None se válido.
    """
    if value and value not in valid_options:
        valid_opts_str = "', '".join(valid_options)
        return f"{field_name} inválido. Use: '{valid_opts_str}'"
    
    return None


def log_api_response(response: Dict[str, Any], operation: str) -> None:
    """
    Registra em log uma resposta da API.
    
    Args:
        response (Dict[str, Any]): Resposta da API.
        operation (str): Descrição da operação realizada.
        
    Returns:
        None
    """
    success = response.get("success", False)
    status = "Sucesso" if success else "Falha"
    
    print(f"[{status}] {operation}")
    if not success and "message" in response:
        print(f"Mensagem: {response['message']}")
