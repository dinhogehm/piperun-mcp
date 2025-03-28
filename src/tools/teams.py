"""
Ferramentas para gerenciamento de equipes no PipeRun.
Este módulo implementa as funções para interagir com a API de equipes do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..schemas.teams import TeamCreate, TeamUpdate
from ..service.api_client import PipeRunApiClient


def list_teams(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    group_id: Optional[int] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar equipes no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome da equipe.
        group_id (Optional[int]): Filtrar por ID do grupo de equipe.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de equipes e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if search:
        params["search"] = search
    if group_id:
        params["group_id"] = group_id
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    try:
        response = client.get("teams", params=params)
        
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


def get_team(team_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de uma equipe específica no PipeRun.
    
    Args:
        team_id (int): ID da equipe a ser consultada.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes da equipe.
    """
    if not team_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da equipe"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"teams/{team_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_team(
    name: str,
    description: Optional[str] = None,
    manager_id: Optional[int] = None,
    group_id: Optional[int] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar uma nova equipe no PipeRun.
    
    Args:
        name (str): Nome da equipe.
        description (Optional[str]): Descrição da equipe.
        manager_id (Optional[int]): ID do gestor da equipe.
        group_id (Optional[int]): ID do grupo de equipe.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação da equipe.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome da equipe é obrigatório"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    team_data = TeamCreate(
        name=name,
        description=description,
        manager_id=manager_id,
        group_id=group_id
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "teams", 
            data=team_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Equipe criada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_team(
    team_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    manager_id: Optional[int] = None,
    group_id: Optional[int] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar uma equipe existente no PipeRun.
    
    Args:
        team_id (int): ID da equipe a ser atualizada.
        name (Optional[str]): Nome da equipe.
        description (Optional[str]): Descrição da equipe.
        manager_id (Optional[int]): ID do gestor da equipe.
        group_id (Optional[int]): ID do grupo de equipe.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização da equipe.
    """
    if not team_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da equipe"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, description, manager_id, group_id]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    team_data = TeamUpdate(
        name=name,
        description=description,
        manager_id=manager_id,
        group_id=group_id
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"teams/{team_id}", 
            data=team_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Equipe atualizada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_team(team_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir uma equipe do PipeRun.
    
    Args:
        team_id (int): ID da equipe a ser excluída.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not team_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da equipe"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"teams/{team_id}")
        
        return {
            "success": True,
            "message": "Equipe excluída com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
