"""
Ferramentas para gerenciamento de negócios (deals) no PipeRun.
Este módulo implementa as funções para interagir com a API de negócios do PipeRun.
"""
from typing import Dict, Any, Optional, List, Union
from decimal import Decimal

from ..schemas.deals import DealCreate, DealUpdate, DealStageUpdate
from ..service.api_client import PipeRunApiClient


def list_deals(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    pipeline_id: Optional[int] = None,
    stage_id: Optional[int] = None,
    company_id: Optional[int] = None,
    contact_id: Optional[int] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    page: Optional[int] = None,
    show: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar negócios no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por título do negócio.
        pipeline_id (Optional[int]): Filtrar por ID do funil.
        stage_id (Optional[int]): Filtrar por ID da etapa.
        company_id (Optional[int]): Filtrar por ID da empresa.
        contact_id (Optional[int]): Filtrar por ID do contato.
        user_id (Optional[int]): Filtrar por ID do usuário responsável.
        status (Optional[str]): Filtrar por status (won, lost, open).
        page (Optional[int]): Número da página para paginação.
        show (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de negócios e metadados.
    """
    # Configurar parâmetros da requisição
    params = {}
    if search:
        params["search"] = search
    if pipeline_id:
        params["pipeline_id"] = pipeline_id
    if stage_id:
        params["stage_id"] = stage_id
    if company_id:
        params["company_id"] = company_id
    if contact_id:
        params["person_id"] = contact_id  # Na API é 'person_id' para contatos
    if user_id:
        params["user_id"] = user_id
    if status:
        params["status"] = status
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
    url = f"{Config.BASE_URL}/deals"
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
        logger.error(f"Erro ao listar negócios: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao listar negócios: {str(e)}",
            "items": []
        }


def get_deal(deal_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um negócio específico no PipeRun.
    
    Args:
        deal_id (int): ID do negócio a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do negócio.
    """
    if not deal_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do negócio"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"deals/{deal_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_deal(
    title: str,
    pipeline_id: int,
    stage_id: int,
    company_id: Optional[int] = None,
    contact_id: Optional[int] = None,
    user_id: Optional[int] = None,
    value: Optional[Union[float, Decimal]] = None,
    expected_close_date: Optional[str] = None,
    notes: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo negócio no PipeRun.
    
    Args:
        title (str): Título do negócio.
        pipeline_id (int): ID do funil.
        stage_id (int): ID da etapa.
        company_id (Optional[int]): ID da empresa.
        contact_id (Optional[int]): ID do contato.
        user_id (Optional[int]): ID do usuário responsável.
        value (Optional[Union[float, Decimal]]): Valor do negócio.
        expected_close_date (Optional[str]): Data esperada de fechamento (YYYY-MM-DD).
        notes (Optional[str]): Observações sobre o negócio.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados do negócio.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do negócio.
    """
    if not title:
        return {
            "success": False,
            "message": "O título do negócio é obrigatório"
        }
    
    if not pipeline_id:
        return {
            "success": False,
            "message": "O ID do funil é obrigatório"
        }
    
    if not stage_id:
        return {
            "success": False,
            "message": "O ID da etapa é obrigatório"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    deal_data = DealCreate(
        title=title,
        pipeline_id=pipeline_id,
        stage_id=stage_id,
        company_id=company_id,
        contact_id=contact_id,
        user_id=user_id,
        value=value,
        expected_close_date=expected_close_date,
        notes=notes,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "deals", 
            data=deal_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Negócio criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_deal(
    deal_id: int,
    title: Optional[str] = None,
    pipeline_id: Optional[int] = None,
    stage_id: Optional[int] = None,
    company_id: Optional[int] = None,
    contact_id: Optional[int] = None,
    user_id: Optional[int] = None,
    value: Optional[Union[float, Decimal]] = None,
    expected_close_date: Optional[str] = None,
    notes: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um negócio existente no PipeRun.
    
    Args:
        deal_id (int): ID do negócio a ser atualizado.
        title (Optional[str]): Título do negócio.
        pipeline_id (Optional[int]): ID do funil.
        stage_id (Optional[int]): ID da etapa.
        company_id (Optional[int]): ID da empresa.
        contact_id (Optional[int]): ID do contato.
        user_id (Optional[int]): ID do usuário responsável.
        value (Optional[Union[float, Decimal]]): Valor do negócio.
        expected_close_date (Optional[str]): Data esperada de fechamento (YYYY-MM-DD).
        notes (Optional[str]): Observações sobre o negócio.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados do negócio.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do negócio.
    """
    if not deal_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do negócio"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([title, pipeline_id, stage_id, company_id, contact_id, user_id, 
               value, expected_close_date, notes, custom_fields]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    deal_data = DealUpdate(
        title=title,
        pipeline_id=pipeline_id,
        stage_id=stage_id,
        company_id=company_id,
        contact_id=contact_id,
        user_id=user_id,
        value=value,
        expected_close_date=expected_close_date,
        notes=notes,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"deals/{deal_id}", 
            data=deal_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Negócio atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_deal(deal_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir um negócio do PipeRun.
    
    Args:
        deal_id (int): ID do negócio a ser excluído.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not deal_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do negócio"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"deals/{deal_id}")
        
        return {
            "success": True,
            "message": "Negócio excluído com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def move_deal_stage(
    deal_id: int,
    stage_id: int,
    reason: Optional[str] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para mover um negócio para outra etapa do funil.
    
    Args:
        deal_id (int): ID do negócio a ser movido.
        stage_id (int): ID da nova etapa.
        reason (Optional[str]): Motivo da mudança de etapa.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da operação.
    """
    if not deal_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do negócio"
        }
    
    if not stage_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da nova etapa"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    stage_data = DealStageUpdate(
        stage_id=stage_id,
        reason=reason
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"deals/{deal_id}/move", 
            data=stage_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Negócio movido com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
