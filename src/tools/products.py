"""
Ferramentas para gerenciamento de produtos no PipeRun.
Este módulo implementa as funções para interagir com a API de produtos do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..service.api_client import PipeRunApiClient


def list_products(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    page: Optional[int] = None,
    show: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar produtos no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome do produto.
        page (Optional[int]): Número da página para paginação.
        show (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de produtos e metadados.
    """
    # Configurar parâmetros da requisição
    params = {}
    if search:
        params["search"] = search
    if page:
        params["page"] = page
    if show:
        params["show"] = show
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/items"  # Endpoint correto para produtos é 'items'
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição GET
        logger.info(f"Fazendo requisição GET para {url} com params={params}")
        response = requests.get(url, headers=headers, params=params, timeout=30)
        
        # Verificar se a resposta é válida
        if response.status_code != 200:
            logger.error(f"Erro na requisição: Status {response.status_code}")
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}",
                "items": []
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Resposta da API: {data}")
        
        # Retornar no formato esperado
        return {
            "success": True,
            "items": data.get("data", []),
            "pagination": data.get("meta", {})
        }
        
    except Exception as e:
        logger.error(f"Erro ao listar produtos: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao listar produtos: {str(e)}",
            "items": []
        }


def get_product(
    product_id: int, 
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um produto específico no PipeRun.
    
    Args:
        product_id (int): ID do produto a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do produto.
    """
    if not product_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do produto"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"items/{product_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_product(
    name: str,
    price: float,
    description: Optional[str] = None,
    sku: Optional[str] = None,
    unit: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo produto no PipeRun.
    
    Args:
        name (str): Nome do produto.
        price (float): Preço do produto.
        description (Optional[str]): Descrição do produto.
        sku (Optional[str]): Código SKU do produto.
        unit (Optional[str]): Unidade de medida do produto.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do produto.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome do produto é obrigatório"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    data = {
        "name": name,
        "price": price
    }
    
    if description:
        data["description"] = description
    if sku:
        data["sku"] = sku
    if unit:
        data["unit"] = unit
    if custom_fields:
        data["custom_fields"] = custom_fields
    
    try:
        response = client.post("items", data=data)
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Produto criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_product(
    product_id: int,
    name: Optional[str] = None,
    price: Optional[float] = None,
    description: Optional[str] = None,
    sku: Optional[str] = None,
    unit: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um produto existente no PipeRun.
    
    Args:
        product_id (int): ID do produto a ser atualizado.
        name (Optional[str]): Nome do produto.
        price (Optional[float]): Preço do produto.
        description (Optional[str]): Descrição do produto.
        sku (Optional[str]): Código SKU do produto.
        unit (Optional[str]): Unidade de medida do produto.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do produto.
    """
    if not product_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do produto"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, price, description, sku, unit, custom_fields]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    data = {}
    if name:
        data["name"] = name
    if price:
        data["price"] = price
    if description:
        data["description"] = description
    if sku:
        data["sku"] = sku
    if unit:
        data["unit"] = unit
    if custom_fields:
        data["custom_fields"] = custom_fields
    
    try:
        response = client.put(f"items/{product_id}", data=data)
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Produto atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_product(
    product_id: int, 
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para excluir um produto do PipeRun.
    
    Args:
        product_id (int): ID do produto a ser excluído.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not product_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do produto"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"items/{product_id}")
        
        return {
            "success": True,
            "message": "Produto excluído com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
