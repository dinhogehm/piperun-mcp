"""
Ferramentas para gerenciamento de tarefas no PipeRun.
Este módulo implementa as funções para interagir com a API de tarefas do PipeRun.
"""
from typing import Dict, Any, Optional, List
from datetime import datetime

from ..schemas.tasks import TaskCreate, TaskUpdate
from ..service.api_client import PipeRunApiClient
from ..tools.utils import format_date


def list_tasks(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    deal_id: Optional[int] = None,
    person_id: Optional[int] = None,
    company_id: Optional[int] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar tarefas no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por título da tarefa.
        deal_id (Optional[int]): Filtrar tarefas por ID da oportunidade.
        person_id (Optional[int]): Filtrar tarefas por ID da pessoa.
        company_id (Optional[int]): Filtrar tarefas por ID da empresa.
        user_id (Optional[int]): Filtrar tarefas por ID do usuário responsável.
        status (Optional[str]): Filtrar por status ("open" ou "closed").
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de tarefas e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if search:
        params["search"] = search
    if deal_id:
        params["deal_id"] = deal_id
    if person_id:
        params["person_id"] = person_id
    if company_id:
        params["company_id"] = company_id
    if user_id:
        params["user_id"] = user_id
    if status:
        params["status"] = status
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    try:
        response = client.get("activities", params=params)
        
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


def get_task(task_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de uma tarefa específica no PipeRun.
    
    Args:
        task_id (int): ID da tarefa a ser consultada.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes da tarefa.
    """
    if not task_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da tarefa"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"activities/{task_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_task(
    title: str,
    due_date: Optional[str] = None,
    description: Optional[str] = None,
    deal_id: Optional[int] = None,
    person_id: Optional[int] = None,
    company_id: Optional[int] = None,
    user_id: Optional[int] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar uma nova tarefa no PipeRun.
    
    Args:
        title (str): Título da tarefa.
        due_date (Optional[str]): Data de vencimento (formato: YYYY-MM-DD).
        description (Optional[str]): Descrição da tarefa.
        deal_id (Optional[int]): ID da oportunidade relacionada.
        person_id (Optional[int]): ID da pessoa relacionada.
        company_id (Optional[int]): ID da empresa relacionada.
        user_id (Optional[int]): ID do usuário responsável.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação da tarefa.
    """
    if not title:
        return {
            "success": False,
            "message": "O título da tarefa é obrigatório"
        }
    
    # Formata a data de vencimento se fornecida
    formatted_due_date = None
    if due_date:
        try:
            formatted_due_date = format_date(due_date)
        except ValueError as e:
            return {
                "success": False,
                "message": f"Formato de data inválido: {str(e)}"
            }
    
    # Criação do modelo de dados validado pelo Pydantic
    task_data = TaskCreate(
        title=title,
        due_date=formatted_due_date,
        description=description,
        deal_id=deal_id,
        person_id=person_id,
        company_id=company_id,
        user_id=user_id,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.post(
            "activities", 
            data=task_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Tarefa criada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_task(
    task_id: int,
    title: Optional[str] = None,
    due_date: Optional[str] = None,
    description: Optional[str] = None,
    deal_id: Optional[int] = None,
    person_id: Optional[int] = None,
    company_id: Optional[int] = None,
    user_id: Optional[int] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar uma tarefa existente no PipeRun.
    
    Args:
        task_id (int): ID da tarefa a ser atualizada.
        title (Optional[str]): Título da tarefa.
        due_date (Optional[str]): Data de vencimento (formato: YYYY-MM-DD).
        description (Optional[str]): Descrição da tarefa.
        deal_id (Optional[int]): ID da oportunidade relacionada.
        person_id (Optional[int]): ID da pessoa relacionada.
        company_id (Optional[int]): ID da empresa relacionada.
        user_id (Optional[int]): ID do usuário responsável.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização da tarefa.
    """
    if not task_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da tarefa"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([title, due_date, description, deal_id, person_id, company_id, user_id, custom_fields]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Formata a data de vencimento se fornecida
    formatted_due_date = None
    if due_date:
        try:
            formatted_due_date = format_date(due_date)
        except ValueError as e:
            return {
                "success": False,
                "message": f"Formato de data inválido: {str(e)}"
            }
    
    # Criação do modelo de dados validado pelo Pydantic
    task_data = TaskUpdate(
        title=title,
        due_date=formatted_due_date,
        description=description,
        deal_id=deal_id,
        person_id=person_id,
        company_id=company_id,
        user_id=user_id,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.put(
            f"activities/{task_id}", 
            data=task_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Tarefa atualizada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def complete_task(task_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para marcar uma tarefa como concluída no PipeRun.
    
    Args:
        task_id (int): ID da tarefa a ser concluída.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da conclusão da tarefa.
    """
    if not task_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da tarefa"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.put(f"activities/{task_id}/complete")
        
        return {
            "success": True,
            "message": "Tarefa concluída com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_task(task_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir uma tarefa do PipeRun.
    
    Args:
        task_id (int): ID da tarefa a ser excluída.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not task_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da tarefa"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"activities/{task_id}")
        
        return {
            "success": True,
            "message": "Tarefa excluída com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
