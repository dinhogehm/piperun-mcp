"""
Ferramentas para gerenciamento de empresas no PipeRun.
Este módulo implementa as funções para interagir com a API de empresas do PipeRun.
"""
from typing import Dict, Any, Optional, List

from ..schemas.companies import CompanyCreate, CompanyUpdate
from ..service.api_client import PipeRunApiClient


def list_companies(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar empresas no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome da empresa.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de empresas e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
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
    
    try:
        response = client.get("companies", params=params)
        
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


def get_company(company_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de uma empresa específica no PipeRun.
    
    Args:
        company_id (int): ID da empresa a ser consultada.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes da empresa.
    """
    if not company_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da empresa"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"companies/{company_id}")
        
        return {
            "success": True,
            "data": response.get("data", {})
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_company(
    name: str,
    address: Optional[str] = None,
    city_id: Optional[int] = None,
    phone: Optional[str] = None,
    email: Optional[str] = None,
    website: Optional[str] = None,
    cnpj: Optional[str] = None,
    category_id: Optional[int] = None,
    responsable_id: Optional[int] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar uma nova empresa no PipeRun.
    
    Args:
        name (str): Nome da empresa.
        address (Optional[str]): Endereço da empresa.
        city_id (Optional[int]): ID da cidade.
        phone (Optional[str]): Telefone da empresa.
        email (Optional[str]): Email da empresa.
        website (Optional[str]): Website da empresa.
        cnpj (Optional[str]): CNPJ da empresa.
        category_id (Optional[int]): ID da categoria da empresa.
        responsable_id (Optional[int]): ID do usuário responsável pela empresa.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados da empresa.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação da empresa.
    """
    if not name:
        return {
            "success": False,
            "message": "O nome da empresa é obrigatório"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    company_data = CompanyCreate(
        name=name,
        address=address,
        city_id=city_id,
        phone=phone,
        email=email,
        website=website,
        cnpj=cnpj,
        category_id=category_id,
        responsable_id=responsable_id,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "companies", 
            data=company_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Empresa criada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_company(
    company_id: int,
    name: Optional[str] = None,
    address: Optional[str] = None,
    city_id: Optional[int] = None,
    phone: Optional[str] = None,
    email: Optional[str] = None,
    website: Optional[str] = None,
    cnpj: Optional[str] = None,
    category_id: Optional[int] = None,
    responsable_id: Optional[int] = None,
    custom_fields: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar uma empresa existente no PipeRun.
    
    Args:
        company_id (int): ID da empresa a ser atualizada.
        name (Optional[str]): Nome da empresa.
        address (Optional[str]): Endereço da empresa.
        city_id (Optional[int]): ID da cidade.
        phone (Optional[str]): Telefone da empresa.
        email (Optional[str]): Email da empresa.
        website (Optional[str]): Website da empresa.
        cnpj (Optional[str]): CNPJ da empresa.
        category_id (Optional[int]): ID da categoria da empresa.
        responsable_id (Optional[int]): ID do usuário responsável pela empresa.
        custom_fields (Optional[Dict[str, Any]]): Campos customizados da empresa.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização da empresa.
    """
    if not company_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da empresa"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, address, city_id, phone, email, website, cnpj, 
                category_id, responsable_id, custom_fields]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    company_data = CompanyUpdate(
        name=name,
        address=address,
        city_id=city_id,
        phone=phone,
        email=email,
        website=website,
        cnpj=cnpj,
        category_id=category_id,
        responsable_id=responsable_id,
        custom_fields=custom_fields
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"companies/{company_id}", 
            data=company_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Empresa atualizada com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_company(company_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para excluir uma empresa do PipeRun.
    
    Args:
        company_id (int): ID da empresa a ser excluída.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da exclusão.
    """
    if not company_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID da empresa"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.delete(f"companies/{company_id}")
        
        return {
            "success": True,
            "message": "Empresa excluída com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
