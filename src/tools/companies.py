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
    show: Optional[int] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None,
    status: Optional[bool] = None,
    account_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar empresas no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome da empresa.
        page (Optional[int]): Número da página para paginação.
        show (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        status (Optional[bool]): Status da empresa (ativo/inativo).
        account_id (Optional[int]): ID da conta à qual as empresas pertencem.
        
    Returns:
        Dict[str, Any]: Lista de empresas e metadados.
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
    if status is not None:
        params["status"] = 1 if status else 0
    if account_id:
        params["account_id"] = account_id
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/companies"
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
        logger.error(f"Erro ao listar empresas: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao listar empresas: {str(e)}",
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/companies/{company_id}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição GET
        logger.info(f"Fazendo requisição GET para {url}")
        response = requests.get(url, headers=headers, timeout=30)
        
        # Verificar se a resposta é válida
        if response.status_code != 200:
            logger.error(f"Erro na requisição: Status {response.status_code}")
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}"
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Resposta da API: {data}")
        
        # Retornar no formato esperado
        return {
            "success": True,
            "data": data.get("data", {})
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter empresa: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao obter empresa: {str(e)}"
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import json
    import logging
    from ..config import Config
    from ..schemas.companies import CompanyCreate
    
    logger = logging.getLogger(__name__)
    
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
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/companies"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição POST
        payload = company_data.model_dump(exclude_none=True)
        logger.info(f"Fazendo requisição POST para {url} com payload={payload}")
        
        response = requests.post(
            url,
            headers=headers,
            data=json.dumps(payload),
            timeout=30
        )
        
        # Verificar se a resposta é válida
        if response.status_code not in [200, 201]:
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {"text": response.text}
                
            logger.error(f"Erro na requisição: Status {response.status_code}")
            logger.error(f"Detalhes do erro: {error_data}")
            
            # Mensagem de erro mais detalhada
            error_message = f"Erro na requisição: Status {response.status_code}"
            if 'message' in error_data:
                error_message += f" - {error_data['message']}"
            elif 'errors' in error_data:
                error_message += f" - {error_data['errors']}"
                
            return {
                "success": False,
                "message": error_message,
                "error_details": error_data
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Resposta da API: {data}")
        
        # Retornar no formato esperado
        return {
            "success": True,
            "data": data.get("data", {}),
            "message": "Empresa criada com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao criar empresa: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao criar empresa: {str(e)}"
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import json
    import logging
    from ..config import Config
    from ..schemas.companies import CompanyUpdate
    
    logger = logging.getLogger(__name__)
    
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
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/companies/{company_id}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição PUT
        payload = company_data.model_dump(exclude_none=True)
        logger.info(f"Fazendo requisição PUT para {url} com payload={payload}")
        
        response = requests.put(
            url,
            headers=headers,
            data=json.dumps(payload),
            timeout=30
        )
        
        # Verificar se a resposta é válida
        if response.status_code != 200:
            logger.error(f"Erro na requisição: Status {response.status_code}")
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}"
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Resposta da API: {data}")
        
        # Retornar no formato esperado
        return {
            "success": True,
            "data": data.get("data", {}),
            "message": "Empresa atualizada com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao atualizar empresa: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao atualizar empresa: {str(e)}"
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/companies/{company_id}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição DELETE
        logger.info(f"Fazendo requisição DELETE para {url}")
        response = requests.delete(url, headers=headers, timeout=30)
        
        # Verificar se a resposta é válida
        if response.status_code not in [200, 204]:
            logger.error(f"Erro na requisição: Status {response.status_code}")
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}"
            }
        
        # Retornar sucesso
        logger.info("Empresa excluída com sucesso")
        return {
            "success": True,
            "message": "Empresa excluída com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao excluir empresa: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao excluir empresa: {str(e)}"
        }
