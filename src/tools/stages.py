"""
Ferramentas para gerenciamento de etapas do funil no PipeRun.
Este módulo implementa as funções para interagir com a API de etapas do funil do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..schemas.stages import StageCreate, StageUpdate
from ..service.api_client import PipeRunApiClient


def list_stages(
    pipeline_id: Optional[int] = None,
    search: Optional[str] = None,
    active: Optional[bool] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar etapas do funil no PipeRun.
    
    Args:
        pipeline_id (Optional[int]): Filtrar por ID do funil.
        search (Optional[str]): Termo para busca por nome da etapa do funil.
        active (Optional[bool]): Filtrar por status de ativação.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Lista de etapas do funil e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if pipeline_id:
        params["pipeline_id"] = pipeline_id
    if search:
        params["search"] = search
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
        response = client.get("stages", params=params)
        
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


def get_stage(stage_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de uma etapa específica do funil no PipeRun.
    
    Args:
        stage_id (int): ID da etapa do funil a ser consultada.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes da etapa do funil.
    """
    if not stage_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da etapa do funil"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"stages/{stage_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_stage(
    name: str,
    pipeline_id: int,
    order: Optional[int] = None,
    color: Optional[str] = None,
    status: Optional[str] = None,
    probability: Optional[int] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar uma nova etapa do funil no PipeRun.
    
    Args:
        name (str): Nome da etapa do funil.
        pipeline_id (int): ID do funil ao qual a etapa pertence.
        order (Optional[int]): Ordem da etapa no funil.
        color (Optional[str]): Cor da etapa no formato hexadecimal (ex: #FF0000).
        status (Optional[str]): Status da etapa (open, win, lost).
        probability (Optional[int]): Probabilidade de fechamento (0-100).
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação da etapa do funil.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome da etapa do funil é obrigatório"
        }
    
    if not pipeline_id:
        return {
            "success": False,
            "message": "O ID do funil é obrigatório"
        }
    
    # Validação do status
    if status and status not in ["open", "win", "lost"]:
        return {
            "success": False,
            "message": "Status inválido. Use 'open', 'win' ou 'lost'"
        }
    
    # Validação da probabilidade
    if probability is not None and (probability < 0 or probability > 100):
        return {
            "success": False,
            "message": "Probabilidade deve estar entre 0 e 100"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    stage_data = StageCreate(
        name=name,
        pipeline_id=pipeline_id,
        order=order,
        color=color,
        status=status,
        probability=probability
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "stages", 
            data=stage_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Etapa do funil criada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_stage(
    stage_id: int,
    name: Optional[str] = None,
    order: Optional[int] = None,
    color: Optional[str] = None,
    status: Optional[str] = None,
    probability: Optional[int] = None,
    active: Optional[bool] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar uma etapa do funil existente no PipeRun.
    
    Args:
        stage_id (int): ID da etapa do funil a ser atualizada.
        name (Optional[str]): Novo nome da etapa do funil.
        order (Optional[int]): Nova ordem da etapa no funil.
        color (Optional[str]): Nova cor da etapa no formato hexadecimal (ex: #FF0000).
        status (Optional[str]): Novo status da etapa (open, win, lost).
        probability (Optional[int]): Nova probabilidade de fechamento (0-100).
        active (Optional[bool]): Novo status de ativação da etapa.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização da etapa do funil.
    """
    if not stage_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da etapa do funil"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, order is not None, color, status, probability is not None, active is not None]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Validação do status
    if status and status not in ["open", "win", "lost"]:
        return {
            "success": False,
            "message": "Status inválido. Use 'open', 'win' ou 'lost'"
        }
    
    # Validação da probabilidade
    if probability is not None and (probability < 0 or probability > 100):
        return {
            "success": False,
            "message": "Probabilidade deve estar entre 0 e 100"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    stage_data = StageUpdate(
        name=name,
        order=order,
        color=color,
        status=status,
        probability=probability,
        active=active
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"stages/{stage_id}", 
            data=stage_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Etapa do funil atualizada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_stage(stage_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir uma etapa do funil do PipeRun.
    
    Args:
        stage_id (int): ID da etapa do funil a ser excluída.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not stage_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da etapa do funil"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"stages/{stage_id}")
        
        return {
            "success": True,
            "message": "Etapa do funil excluída com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
