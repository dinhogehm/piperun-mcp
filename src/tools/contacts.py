"""
Ferramentas para gerenciamento de contatos no PipeRun.
Este módulo implementa as funções para interagir com a API de contatos do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..schemas.contacts import ContactCreate, ContactUpdate
from ..service.api_client import PipeRunApiClient


def list_contacts(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    company_id: Optional[int] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar contatos no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome do contato.
        company_id (Optional[int]): Filtrar contatos por ID da empresa.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de contatos e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    params = {}
    if search:
        params["search"] = search
    if company_id:
        params["company_id"] = company_id
    if page:
        params["page"] = page
    if per_page:
        params["per_page"] = per_page
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    try:
        response = client.get("persons", params=params)
        
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


def get_contact(contact_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um contato específico no PipeRun.
    
    Args:
        contact_id (int): ID do contato a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do contato.
    """
    if not contact_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do contato"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"persons/{contact_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_contact(
    name: str,
    email: Optional[str] = None,
    company_id: Optional[int] = None,
    phone: Optional[str] = None,
    mobile_phone: Optional[str] = None,
    position: Optional[str] = None,
    notes: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo contato no PipeRun.
    
    Args:
        name (str): Nome do contato.
        email (Optional[str]): Email do contato.
        company_id (Optional[int]): ID da empresa do contato.
        phone (Optional[str]): Telefone do contato.
        mobile_phone (Optional[str]): Celular do contato.
        position (Optional[str]): Cargo do contato.
        notes (Optional[str]): Observações sobre o contato.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados do contato.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do contato.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome do contato é obrigatório"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    contact_data = ContactCreate(
        name=name,
        email=email,
        company_id=company_id,
        phone=phone,
        mobile_phone=mobile_phone,
        position=position,
        notes=notes,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "persons", 
            data=contact_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Contato criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_contact(
    contact_id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    company_id: Optional[int] = None,
    phone: Optional[str] = None,
    mobile_phone: Optional[str] = None,
    position: Optional[str] = None,
    notes: Optional[str] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um contato existente no PipeRun.
    
    Args:
        contact_id (int): ID do contato a ser atualizado.
        name (Optional[str]): Nome do contato.
        email (Optional[str]): Email do contato.
        company_id (Optional[int]): ID da empresa do contato.
        phone (Optional[str]): Telefone do contato.
        mobile_phone (Optional[str]): Celular do contato.
        position (Optional[str]): Cargo do contato.
        notes (Optional[str]): Observações sobre o contato.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados do contato.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do contato.
    """
    if not contact_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do contato"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, email, company_id, phone, mobile_phone, position, notes, custom_fields]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    contact_data = ContactUpdate(
        name=name,
        email=email,
        company_id=company_id,
        phone=phone,
        mobile_phone=mobile_phone,
        position=position,
        notes=notes,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"persons/{contact_id}", 
            data=contact_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Contato atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_contact(contact_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir um contato do PipeRun.
    
    Args:
        contact_id (int): ID do contato a ser excluído.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not contact_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do contato"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"persons/{contact_id}")
        
        return {
            "success": True,
            "message": "Contato excluído com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
