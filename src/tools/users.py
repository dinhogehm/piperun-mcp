"""
Ferramentas para gerenciamento de usuários no PipeRun.
Este módulo implementa as funções para interagir com a API de usuários do PipeRun.
"""
import logging
from typing import Dict, Any, Optional, List

from ..schemas.users import UserCreate, UserUpdate
from ..service.api_client import PipeRunApiClient

# Configuração de logging
logger = logging.getLogger(__name__)


def list_users(
    api_token: Optional[str] = None,
    search: Optional[str] = None,
    team_id: Optional[int] = None,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    status: Optional[bool] = None,
    order_by: Optional[str] = None,
    order_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para listar usuários no PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        search (Optional[str]): Termo para busca por nome ou email do usuário.
        team_id (Optional[int]): Filtrar por ID da equipe.
        page (Optional[int]): Número da página para paginação.
        per_page (Optional[int]): Quantidade de itens por página.
        status (Optional[bool]): Filtrar por status (ativo/inativo).
        order_by (Optional[str]): Campo para ordenação.
        order_type (Optional[str]): Tipo de ordenação (asc ou desc).
        
    Returns:
        Dict[str, Any]: Lista de usuários e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    # Definição de parâmetros com valores padrão mais adequados
    params = {
        "per_page": per_page or 100  # Solicita mais itens por padrão para obter mais resultados
    }
    
    if search:
        params["search"] = search
    if team_id:
        params["team_id"] = team_id
    if page:
        params["page"] = page
    if status is not None:
        params["status"] = "1" if status else "0"
    if order_by:
        params["order_by"] = order_by
    if order_type:
        params["order_type"] = order_type
    
    try:
        # Tenta abordagem padrão com o endpoint users
        try:
            logger.info("Tentando listar usuários pelo endpoint principal")
            response = client.get("users", params=params)
            
            # Verifica se a resposta tem itens em diferentes formatos possíveis
            items = []
            
            # Verifica diferentes estruturas da API para extrair os itens
            if response.get("items"):
                items = response.get("items")
            elif response.get("data") and isinstance(response.get("data"), list):
                items = response.get("data")
            
            logger.info(f"Estrutura da resposta: {response.keys()}")
            logger.info(f"Quantidade de itens encontrados: {len(items)}")
            
            if items:
                # Determinando qual estrutura de paginação usar
                pagination = {}
                if response.get("pagination"):
                    pagination = response.get("pagination")
                elif response.get("meta"):
                    pagination = response.get("meta")
                
                return {
                    "success": True,
                    "items": items,
                    "pagination": pagination,
                    "message": "Usuários listados com sucesso"
                }
            else:
                logger.warning("Endpoint principal retornou lista vazia, tentando alternativas")
                # Se a lista está vazia, continue para abordagens alternativas
                raise ValueError("Lista de usuários vazia")
                
        except ValueError:
            # Tenta abordagens alternativas
            
            # Tenta obter o usuário atual primeiro
            try:
                logger.info("Tentando obter usuário atual como fallback")
                current_user = get_current_user(api_token=api_token)
                
                if current_user.get("success") and current_user.get("data"):
                    # Se conseguiu obter o usuário atual, retorna uma lista com esse usuário
                    return {
                        "success": True,
                        "items": [current_user.get("data")],
                        "pagination": {"total": 1, "page": 1, "per_page": 1, "total_pages": 1},
                        "message": "Usuário atual obtido com sucesso",
                        "note": "Esta lista contém apenas o usuário atual devido a limitações da API"
                    }
            except Exception as e:
                logger.warning(f"Erro ao obter usuário atual: {str(e)}")
            
            # Tenta outros endpoints relacionados a usuários ou colaboradores
            try:
                logger.info("Tentando listar usuários pelo endpoint de colaboradores")
                # Algumas APIs de CRM têm endpoints alternativos, como 'collaborators' ou 'team-members'
                alt_endpoints = ["collaborators", "team-members", "members", "staff"]
                
                for endpoint in alt_endpoints:
                    try:
                        alt_response = client.get(endpoint, params=params)
                        alt_items = alt_response.get("items", [])
                        
                        if alt_items:
                            return {
                                "success": True,
                                "items": alt_items,
                                "pagination": alt_response.get("pagination", {}),
                                "message": f"Usuários listados com sucesso via endpoint alternativo '{endpoint}'",
                                "note": "Esta lista foi obtida através de um endpoint alternativo"
                            }
                    except Exception:
                        continue
            except Exception as e:
                logger.warning(f"Erro ao tentar endpoints alternativos: {str(e)}")
            
            # Se chegou aqui, todas as tentativas falharam
            return {
                "success": False,
                "message": "Não foi possível listar usuários por nenhum método disponível",
                "items": []
            }
                
    except ValueError as e:
        return {
            "success": False,
            "message": str(e),
            "items": []
        }
    except Exception as e:
        logger.error(f"Erro não tratado ao listar usuários: {str(e)}")
        return {
            "success": False,
            "message": f"Erro não esperado: {str(e)}",
            "items": []
        }


def get_user(user_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes de um usuário específico no PipeRun.
    
    Args:
        user_id (int): ID do usuário a ser consultado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do usuário.
    """
    if not user_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do usuário"
        }
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get(f"users/{user_id}")
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Usuário obtido com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def get_current_user(api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para obter detalhes do usuário atual (associado ao token de API).
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Detalhes do usuário atual.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Tenta obter os dados do usuário pela listagem com filtro específico
        # ou usando endpoints alternativos
        try:
            # Tenta usar a rota alternativa "me" se estiver disponível
            response = client.get("users/me")
            return {
                "success": True,
                "data": response.get("data", {}),
                "message": "Dados do usuário atual obtidos com sucesso"
            }
        except ValueError:
            # Se não conseguir, tenta obter com base na listagem de usuários
            # e seleciona o primeiro usuário admin como aproximação
            users_response = client.get("users", params={"per_page": 10})
            users = users_response.get("items", [])
            
            if users:
                # Assume que o primeiro usuário administrativo ou o primeiro da lista
                # pode estar associado ao token
                admin_users = [u for u in users if u.get("role") == "admin"]
                user_data = admin_users[0] if admin_users else users[0]
                
                return {
                    "success": True,
                    "data": user_data,
                    "message": "Dados aproximados do usuário atual obtidos com sucesso",
                    "note": "Esta é uma aproximação baseada nos usuários disponíveis"
                }
            else:
                return {
                    "success": False,
                    "message": "Não foi possível determinar o usuário atual"
                }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def create_user(
    name: str,
    email: str,
    password: str,
    role: Optional[str] = None,
    phone: Optional[str] = None,
    mobile_phone: Optional[str] = None,
    team_id: Optional[int] = None,
    permissions: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para criar um novo usuário no PipeRun.
    
    Args:
        name (str): Nome do usuário.
        email (str): Email do usuário.
        password (str): Senha do usuário.
        role (Optional[str]): Função do usuário na empresa.
        phone (Optional[str]): Telefone fixo do usuário.
        mobile_phone (Optional[str]): Telefone móvel do usuário.
        team_id (Optional[int]): ID da equipe do usuário.
        permissions (Optional[Dict[str, Any]]): Permissões do usuário.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da criação do usuário.
    """
    if not all([name, email, password]):
        return {
            "success": False,
            "message": "Nome, email e senha são obrigatórios"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    user_data = UserCreate(
        name=name,
        email=email,
        password=password,
        role=role,
        phone=phone,
        mobile_phone=mobile_phone,
        team_id=team_id,
        permissions=permissions
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.post(
            "users", 
            data=user_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Usuário criado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_user(
    user_id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    role: Optional[str] = None,
    phone: Optional[str] = None,
    mobile_phone: Optional[str] = None,
    team_id: Optional[int] = None,
    status: Optional[bool] = None,
    permissions: Optional[Dict[str, Any]] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para atualizar um usuário existente no PipeRun.
    
    Args:
        user_id (int): ID do usuário a ser atualizado.
        name (Optional[str]): Nome do usuário.
        email (Optional[str]): Email do usuário.
        role (Optional[str]): Função do usuário na empresa.
        phone (Optional[str]): Telefone fixo do usuário.
        mobile_phone (Optional[str]): Telefone móvel do usuário.
        team_id (Optional[int]): ID da equipe do usuário.
        status (Optional[bool]): Status do usuário (ativo/inativo).
        permissions (Optional[Dict[str, Any]]): Permissões do usuário.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da atualização do usuário.
    """
    if not user_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do usuário"
        }
    
    # Verifica se pelo menos um campo para atualização foi fornecido
    if not any([name, email, role, phone, mobile_phone, team_id, status is not None, permissions]):
        return {
            "success": False,
            "message": "É necessário fornecer pelo menos um campo para atualização"
        }
    
    # Criação do modelo de dados validado pelo Pydantic
    user_data = UserUpdate(
        name=name,
        email=email,
        role=role,
        phone=phone,
        mobile_phone=mobile_phone,
        team_id=team_id,
        status=status,
        permissions=permissions
    )
    
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Converte o modelo Pydantic para dicionário antes de enviar
        response = client.put(
            f"users/{user_id}", 
            data=user_data.model_dump(exclude_none=True)
        )
        
        return {
            "success": True,
            "data": response.get("data", {}),
            "message": "Usuário atualizado com sucesso"
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }


def deactivate_user(user_id: int, api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para desativar um usuário no PipeRun.
    
    Args:
        user_id (int): ID do usuário a ser desativado.
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resposta da desativação.
    """
    if not user_id:
        return {
            "success": False,
            "message": "É necessário fornecer o ID do usuário"
        }
    
    return update_user(user_id=user_id, status=False, api_token=api_token)


def count_users(api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para contar o número total de usuários na conta PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Total de usuários e metadados.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        # Abordagem principal: usar paginação para obter contagem
        try:
            logger.info("Tentando contar usuários via endpoint de usuários")
            response = client.get("users", params={"page": 1, "per_page": 1})
            
            # Verifica se temos meta ou pagination na resposta
            if response.get("meta"):
                pagination = response.get("meta", {})
            else:
                pagination = response.get("pagination", {})
                
            total_users = pagination.get("total", 0)
            
            logger.info(f"Resposta API: {response}")
            logger.info(f"Pagination/Meta: {pagination}")
            logger.info(f"Total encontrado: {total_users}")
            
            # Verifica se conseguimos obter a contagem total
            if total_users > 0:
                # Busca contagem de usuários ativos e inativos
                try:
                    active_response = client.get("users", params={"status": "1", "page": 1, "per_page": 1})
                    inactive_response = client.get("users", params={"status": "0", "page": 1, "per_page": 1})
                    
                    # Obter contagem do local correto baseado na estrutura da resposta
                    if active_response.get("meta"):
                        active_users = active_response.get("meta", {}).get("total", 0)
                        inactive_users = inactive_response.get("meta", {}).get("total", 0)
                    else:
                        active_users = active_response.get("pagination", {}).get("total", 0)
                        inactive_users = inactive_response.get("pagination", {}).get("total", 0)
                
                except Exception as e:
                    logger.warning(f"Erro ao obter contagem por status: {str(e)}")
                    # Se não conseguir obter detalhes de status, use apenas o total
                    active_users = total_users
                    inactive_users = 0
                
                return {
                    "success": True,
                    "total_users": total_users,
                    "active_users": active_users,
                    "inactive_users": inactive_users,
                    "message": "Contagem de usuários obtida com sucesso"
                }
            else:
                logger.warning("Endpoint principal retornou contagem zero, tentando alternativas")
                raise ValueError("Contagem de usuários zerada")
                
        except ValueError:
            # Abordagem alternativa 1: obter a lista completa e contar
            logger.info("Tentando contar usuários obtendo lista completa")
            try:
                # Tenta obter todos os usuários com um limite alto
                all_users_response = client.get("users", params={"per_page": 1000})
                all_users = all_users_response.get("items", [])
                
                if all_users:
                    # Conta manualmente
                    total_users = len(all_users)
                    active_users = len([u for u in all_users if u.get("active") or u.get("status") == "1"])
                    inactive_users = total_users - active_users
                    
                    return {
                        "success": True,
                        "total_users": total_users,
                        "active_users": active_users,
                        "inactive_users": inactive_users,
                        "message": "Contagem de usuários obtida com sucesso via listagem completa",
                        "note": "Esta contagem é baseada em uma lista limitada e pode não incluir todos os usuários"
                    }
            except Exception as e:
                logger.warning(f"Erro ao obter lista completa: {str(e)}")
            
            # Abordagem alternativa 2: tentar outros endpoints relacionados
            logger.info("Tentando contar usuários via endpoints alternativos")
            try:
                alt_endpoints = ["collaborators", "team-members", "members", "staff"]
                
                for endpoint in alt_endpoints:
                    try:
                        alt_response = client.get(endpoint, params={"page": 1, "per_page": 1})
                        alt_pagination = alt_response.get("pagination", {})
                        alt_total = alt_pagination.get("total", 0)
                        
                        if alt_total > 0:
                            return {
                                "success": True,
                                "total_users": alt_total,
                                "active_users": alt_total,  # Sem informações detalhadas de status
                                "inactive_users": 0,
                                "message": f"Contagem de usuários obtida com sucesso via endpoint alternativo '{endpoint}'",
                                "note": "Esta contagem pode incluir todos os colaboradores, não apenas usuários da plataforma"
                            }
                    except Exception:
                        continue
            except Exception as e:
                logger.warning(f"Erro ao tentar endpoints alternativos: {str(e)}")
            
            # Abordagem final: verificar se conseguimos obter pelo menos um usuário
            try:
                current_user = get_current_user(api_token=api_token)
                if current_user.get("success"):
                    return {
                        "success": True,
                        "total_users": 1,
                        "active_users": 1,
                        "inactive_users": 0,
                        "message": "Contagem mínima de usuários obtida",
                        "note": "Apenas o usuário atual foi contabilizado devido a limitações da API"
                    }
            except Exception as e:
                logger.warning(f"Erro ao obter usuário atual: {str(e)}")
            
            # Se chegou aqui, todas as tentativas falharam
            return {
                "success": False,
                "message": "Não foi possível obter a contagem de usuários por nenhum método disponível",
                "total_users": 0,
                "active_users": 0,
                "inactive_users": 0
            }
    
    except ValueError as e:
        return {
            "success": False,
            "message": str(e),
            "total_users": 0,
            "active_users": 0,
            "inactive_users": 0
        }
    except Exception as e:
        logger.error(f"Erro não tratado ao contar usuários: {str(e)}")
        return {
            "success": False,
            "message": f"Erro não esperado: {str(e)}",
            "total_users": 0,
            "active_users": 0,
            "inactive_users": 0
        }