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
    show: Optional[int] = None,
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
        show (Optional[int]): Quantidade de itens por página.
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de contatos e metadados.
    """
    # Configurar parâmetros da requisição
    params = {}
    if search:
        params["search"] = search
    if company_id:
        params["company_id"] = company_id
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
    url = f"{Config.BASE_URL}/persons"
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
                "data": []
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Resposta da API: {data}")
        
        # Retornar no formato esperado
        return {
            "success": True,
            "data": data.get("data", []),
            "pagination": data.get("meta", {})
        }
        
    except Exception as e:
        logger.error(f"Erro ao listar contatos: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao listar contatos: {str(e)}",
            "data": []
        }


def get_contact(
    contact_id: int,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um contato específico no PipeRun.
    
    Esta ferramenta recupera informações detalhadas sobre um contato específico 
    com base no seu ID. Inclui dados pessoais, empresas associadas e histórico.
    
    Exemplos de uso:
    1. Obter detalhes do contato: get_contact(contact_id=123)
    2. Obter detalhes com token específico: get_contact(contact_id=123, api_token="seu_token")
    
    Args:
        contact_id (int): ID do contato a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Dicionário contendo:
            - success (bool): Se a operação foi bem-sucedida.
            - data (Dict): Dados do contato quando encontrado.
            - message (str): Mensagem de erro em caso de falha.
    """
    # Validação de parâmetros
    if not isinstance(contact_id, int) or contact_id <= 0:
        return {
            "success": False,
            "message": "ID do contato deve ser um número inteiro positivo",
            "data": {}
        }
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/contacts/{contact_id}"
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
        if response.status_code == 404:
            logger.warning(f"Contato não encontrado: ID {contact_id}")
            return {
                "success": False,
                "message": f"Contato com ID {contact_id} não encontrado",
                "data": {}
            }
        elif response.status_code != 200:
            logger.error(f"Erro na requisição: Status {response.status_code}")
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}",
                "data": {}
            }
        
        # Processar a resposta
        data = response.json()
        logger.info(f"Contato obtido com sucesso: {data.get('data', {}).get('name', '')}")
        
        # A API do PipeRun retorna os dados em 'data'
        return {
            "success": True,
            "data": data.get("data", {}),
            "message": "Contato obtido com sucesso"
        }
    except Exception as e:
        logger.error(f"Erro ao obter contato: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao obter contato: {str(e)}",
            "data": {}
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import json
    import logging
    from ..config import Config
    from ..schemas.contacts import ContactCreate
    
    logger = logging.getLogger(__name__)
    
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
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/persons"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição POST
        payload = contact_data.model_dump(exclude_none=True)
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
            "message": "Contato criado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao criar contato: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao criar contato: {str(e)}"
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import json
    import logging
    from ..config import Config
    from ..schemas.contacts import ContactUpdate
    
    logger = logging.getLogger(__name__)
    
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
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/persons/{contact_id}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token
    }
    
    try:
        # Fazer a requisição PUT
        payload = contact_data.model_dump(exclude_none=True)
        logger.info(f"Fazendo requisição PUT para {url} com payload={payload}")
        
        response = requests.put(
            url,
            headers=headers,
            data=json.dumps(payload),
            timeout=30
        )
        
        # Verificar se a resposta é válida
        if response.status_code != 200:
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
            "message": "Contato atualizado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao atualizar contato: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao atualizar contato: {str(e)}"
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
    
    # Realizar a requisição HTTP diretamente usando requests
    import requests
    import logging
    from ..config import Config
    
    logger = logging.getLogger(__name__)
    
    # Obter token de API
    token = api_token or Config.get_api_token()
    
    # Configurar URL e headers
    url = f"{Config.BASE_URL}/persons/{contact_id}"
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
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {"text": response.text}
                
            logger.error(f"Erro na requisição: Status {response.status_code}")
            logger.error(f"Detalhes do erro: {error_data}")
            
            return {
                "success": False,
                "message": f"Erro na requisição: Status {response.status_code}"
            }
        
        # Retornar sucesso
        logger.info("Contato excluído com sucesso")
        return {
            "success": True,
            "message": "Contato excluído com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao excluir contato: {str(e)}")
        return {
            "success": False,
            "message": f"Erro ao excluir contato: {str(e)}"
        }
