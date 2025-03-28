"""
Ferramentas para gerenciamento de campos customizados no PipeRun.
Este módulo implementa as funções para interagir com a API de campos customizados do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..service.api_client import PipeRunApiClient


def list_custom_fields(
    api_token: Optional[str] = None,
    entity_type: Optional[str] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar campos customizados no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        entity_type (Optional[str]): Tipo da entidade (deals, companies, persons, etc.).
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        
    Returns:
        Dict[str, Any]: Lista de campos customizados e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if entity_type:
        params["entity_type"] = entity_type
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    
    try:
        # Endpoint correto para campos customizados
        response = client.get("customFields", params=params)
        
        return {
            "success": True,
            "items": response.get("items", []),
            "pagination": response.get("pagination", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e),
            "items": []
        }


def get_custom_field(
    field_id: int, 
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um campo customizado específico no PipeRun.
    
    Args:
        field_id (int): ID do campo customizado a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do campo customizado.
    """
    if not field_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do campo customizado"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"customFields/{field_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_custom_field(
    name: str,
    entity_type: str,
    field_type: str,
    options: Optional[List[str]] = None,
    required: Optional[bool] = False,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo campo customizado no PipeRun.
    
    Args:
        name (str): Nome do campo customizado.
        entity_type (str): Tipo da entidade (deals, companies, persons, etc.).
        field_type (str): Tipo do campo (text, select, date, checkbox, etc.).
        options (Optional[List[str]]): Opções para campos do tipo select.
        required (Optional[bool]): Se o campo é obrigatório.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do campo customizado.
    """
    if not name or not entity_type or not field_type:
        return {
            "success": False,
            "message": "Nome, tipo de entidade e tipo de campo são obrigatórios"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    data = {
        "name": name,
        "entity_type": entity_type,
        "field_type": field_type,
        "required": required
    }
    
    if options and field_type == "select":
        data["options"] = options
    
    try:
        response = client.post("customFields", data=data)
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Campo customizado criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_custom_field(
    field_id: int,
    name: Optional[str] = None,
    options: Optional[List[str]] = None,
    required: Optional[bool] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um campo customizado existente no PipeRun.
    
    Args:
        field_id (int): ID do campo customizado a ser atualizado.
        name (Optional[str]): Novo nome do campo.
        options (Optional[List[str]]): Novas opções para campos do tipo select.
        required (Optional[bool]): Se o campo é obrigatório.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do campo customizado.
    """
    if not field_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do campo customizado"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, options, required is not None]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    data = {}
    if name:
        data["name"] = name
    if options:
        data["options"] = options
    if required is not None:
        data["required"] = required
    
    try:
        response = client.put(f"customFields/{field_id}", data=data)
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Campo customizado atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_custom_field(
    field_id: int, 
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para excluir um campo customizado do PipeRun.
    
    Args:
        field_id (int): ID do campo customizado a ser excluído.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not field_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do campo customizado"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"customFields/{field_id}")
        
        return {
            "success": True,
            "message": "Campo customizado excluído com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
