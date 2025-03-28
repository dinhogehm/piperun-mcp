"""
Ferramentas para gerenciamento de funis (pipelines) no PipeRun.
Este módulo implementa as funções para interagir com a API de funis do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..schemas.pipelines import PipelineCreate, PipelineUpdate
from ..service.api_client import PipeRunApiClient


def list_pipelines(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    team_id: Optional[int] = None,
    active: Optional[bool] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar funis no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome do funil.
        team_id (Optional[int]): Filtrar por ID da equipe.
        active (Optional[bool]): Filtrar por status de ativação.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de funis e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if search:
        params["search"] = search
    if team_id:
        params["team_id"] = team_id
    if active is not None:
        params["active"] = 1 if active else 0
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    try:
        response = client.get("pipelines", params=params)
        
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


def get_pipeline(pipeline_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um funil específico no PipeRun.
    
    Args:
        pipeline_id (int): ID do funil a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do funil.
    """
    if not pipeline_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do funil"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"pipelines/{pipeline_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_pipeline(
    name: str,
    description: Optional[str] = None,
    team_id: Optional[int] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo funil no PipeRun.
    
    Args:
        name (str): Nome do funil.
        description (Optional[str]): Descrição do funil.
        team_id (Optional[int]): ID da equipe responsável pelo funil.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do funil.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome do funil é obrigatório"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    pipeline_data = PipelineCreate(
        name=name,
        description=description,
        team_id=team_id
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "pipelines", 
            data=pipeline_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Funil criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_pipeline(
    pipeline_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    team_id: Optional[int] = None,
    active: Optional[bool] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um funil existente no PipeRun.
    
    Args:
        pipeline_id (int): ID do funil a ser atualizado.
        name (Optional[str]): Nome do funil.
        description (Optional[str]): Descrição do funil.
        team_id (Optional[int]): ID da equipe responsável pelo funil.
        active (Optional[bool]): Status de ativação do funil.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do funil.
    """
    if not pipeline_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do funil"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, description, team_id, active is not None]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    pipeline_data = PipelineUpdate(
        name=name,
        description=description,
        team_id=team_id,
        active=active
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"pipelines/{pipeline_id}", 
            data=pipeline_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Funil atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_pipeline(pipeline_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir um funil do PipeRun.
    
    Args:
        pipeline_id (int): ID do funil a ser excluído.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not pipeline_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do funil"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"pipelines/{pipeline_id}")
        
        return {
            "success": True,
            "message": "Funil excluído com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
