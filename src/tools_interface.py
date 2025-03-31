"""
Interface REST para ferramentas do PipeRun MCP.
Este módulo implementa uma interface REST que expõe as ferramentas do PipeRun MCP
de forma similar ao GitHub MCP.
"""
import logging
from typing import Dict, Any, List, Optional
from flask import Blueprint, jsonify, request

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Importa as ferramentas do PipeRun MCP
from .tools import (
    # Autenticação
    authenticate_user,
    get_api_token,
    revoke_api_token,
    
    # Empresas
    list_companies,
    get_company,
    create_company,
    update_company,
    delete_company,
    
    # Contatos
    list_contacts,
    get_contact,
    create_contact,
    update_contact,
    delete_contact,
    
    # Negócios/Oportunidades
    list_deals,
    get_deal,
    create_deal,
    update_deal,
    move_deal_stage,
    delete_deal,
    
    # Funis
    list_pipelines,
    get_pipeline,
    create_pipeline,
    update_pipeline,
    delete_pipeline,
    
    # Etapas do funil
    list_stages,
    get_stage,
    create_stage,
    update_stage,
    delete_stage,
    
    # Tarefas
    list_tasks,
    get_task,
    create_task,
    update_task,
    complete_task,
    delete_task,
    
    # Times
    list_teams,
    get_team,
    create_team,
    update_team,
    delete_team,
    
    # Campos customizados
    list_custom_fields,
    get_custom_field,
    create_custom_field,
    update_custom_field,
    delete_custom_field,
    
    # Produtos
    list_products,
    get_product,
    create_product,
    update_product,
    delete_product
)

# Blueprint para as rotas da API REST
tools_bp = Blueprint('tools', __name__, url_prefix='/tools')

# Registro das ferramentas disponíveis
def register_tools() -> Dict[str, Dict[str, Any]]:
    """
    Registra todas as ferramentas disponíveis no PipeRun MCP.
    
    Returns:
        Dict[str, Dict[str, Any]]: Dicionário com as ferramentas disponíveis.
    """
    return {
        # Autenticação
        "authenticate_user": {
            "function": authenticate_user,
            "description": "Autentica um usuário no PipeRun",
            "parameters": {
                "email": {"type": "string", "description": "Email do usuário", "required": True},
                "password": {"type": "string", "description": "Senha do usuário", "required": True}
            }
        },
        
        # Empresas
        "list_companies": {
            "function": list_companies,
            "description": "Lista as empresas cadastradas no PipeRun",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome da empresa"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        "get_company": {
            "function": get_company,
            "description": "Obtém detalhes de uma empresa específica",
            "parameters": {
                "company_id": {"type": "integer", "description": "ID da empresa", "required": True}
            }
        },
        "create_company": {
            "function": create_company,
            "description": "Cria uma nova empresa no PipeRun",
            "parameters": {
                "name": {"type": "string", "description": "Nome da empresa", "required": True},
                "email": {"type": "string", "description": "Email da empresa"},
                "phone": {"type": "string", "description": "Telefone da empresa"}
            }
        },
        "update_company": {
            "function": update_company,
            "description": "Atualiza uma empresa existente no PipeRun",
            "parameters": {
                "company_id": {"type": "integer", "description": "ID da empresa", "required": True},
                "name": {"type": "string", "description": "Nome da empresa"},
                "email": {"type": "string", "description": "Email da empresa"},
                "phone": {"type": "string", "description": "Telefone da empresa"}
            }
        },
        "delete_company": {
            "function": delete_company,
            "description": "Exclui uma empresa do PipeRun",
            "parameters": {
                "company_id": {"type": "integer", "description": "ID da empresa", "required": True}
            }
        },
        
        # Contatos
        "list_contacts": {
            "function": list_contacts,
            "description": "Lista os contatos cadastrados no PipeRun",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome do contato"},
                "company_id": {"type": "integer", "description": "Filtrar contatos por ID da empresa"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        "get_contact": {
            "function": get_contact,
            "description": "Obtém detalhes de um contato específico",
            "parameters": {
                "contact_id": {"type": "integer", "description": "ID do contato", "required": True}
            }
        },
        "create_contact": {
            "function": create_contact,
            "description": "Cria um novo contato no PipeRun",
            "parameters": {
                "name": {"type": "string", "description": "Nome do contato", "required": True},
                "email": {"type": "string", "description": "Email do contato"},
                "company_id": {"type": "integer", "description": "ID da empresa do contato"},
                "phone": {"type": "string", "description": "Telefone do contato"}
            }
        },
        "update_contact": {
            "function": update_contact,
            "description": "Atualiza um contato existente no PipeRun",
            "parameters": {
                "contact_id": {"type": "integer", "description": "ID do contato", "required": True},
                "name": {"type": "string", "description": "Nome do contato"},
                "email": {"type": "string", "description": "Email do contato"},
                "company_id": {"type": "integer", "description": "ID da empresa do contato"},
                "phone": {"type": "string", "description": "Telefone do contato"}
            }
        },
        "delete_contact": {
            "function": delete_contact,
            "description": "Exclui um contato do PipeRun",
            "parameters": {
                "contact_id": {"type": "integer", "description": "ID do contato", "required": True}
            }
        },
        
        # Negócios/Oportunidades
        "list_deals": {
            "function": list_deals,
            "description": "Lista os negócios/oportunidades cadastrados no PipeRun",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por título do negócio"},
                "pipeline_id": {"type": "integer", "description": "Filtrar por ID do funil"},
                "stage_id": {"type": "integer", "description": "Filtrar por ID da etapa"},
                "company_id": {"type": "integer", "description": "Filtrar por ID da empresa"},
                "contact_id": {"type": "integer", "description": "Filtrar por ID do contato"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        
        # Funis
        "list_pipelines": {
            "function": list_pipelines,
            "description": "Lista os funis de vendas no PipeRun",
            "parameters": {
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        
        # Etapas
        "list_stages": {
            "function": list_stages,
            "description": "Lista as etapas de um funil específico no PipeRun",
            "parameters": {
                "pipeline_id": {"type": "integer", "description": "ID do funil", "required": True},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        
        # Produtos
        "list_products": {
            "function": list_products,
            "description": "Lista os produtos cadastrados no PipeRun",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome do produto"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        }
        
        # Adicione mais ferramentas conforme necessário
    }

# Rota para listar todas as ferramentas disponíveis
@tools_bp.route('', methods=['GET'])
def list_all_tools():
    """
    Lista todas as ferramentas disponíveis no PipeRun MCP.
    
    Returns:
        JSON: Lista de ferramentas e suas descrições.
    """
    logger.info("Listando todas as ferramentas disponíveis")
    
    tools_dict = register_tools()
    tools_list = []
    
    for name, metadata in tools_dict.items():
        parameters = {}
        for param_name, param_info in metadata.get("parameters", {}).items():
            parameters[param_name] = {
                "type": param_info.get("type", "string"),
                "description": param_info.get("description", ""),
                "required": param_info.get("required", False)
            }
        
        tools_list.append({
            "name": name,
            "description": metadata.get("description", ""),
            "parameters": parameters
        })
    
    return jsonify({"tools": tools_list})

# Rota para executar uma ferramenta específica
@tools_bp.route('/<tool_name>', methods=['POST'])
def execute_tool(tool_name):
    """
    Executa uma ferramenta específica do PipeRun MCP.
    
    Args:
        tool_name (str): Nome da ferramenta a ser executada.
        
    Returns:
        JSON: Resultado da execução da ferramenta.
    """
    logger.info(f"Executando ferramenta: {tool_name}")
    
    tools = register_tools()
    
    if tool_name not in tools:
        logger.error(f"Ferramenta '{tool_name}' não encontrada")
        return jsonify({
            "error": {
                "type": "tool_not_found",
                "message": f"Ferramenta '{tool_name}' não encontrada."
            }
        }), 404
    
    try:
        # Obtém os parâmetros da requisição
        parameters = request.json or {}
        logger.debug(f"Parâmetros: {parameters}")
        
        # Executa a função correspondente à ferramenta
        tool_function = tools[tool_name]["function"]
        result = tool_function(**parameters)
        
        # Retorna o resultado
        return jsonify({"result": result})
    except Exception as e:
        logger.error(f"Erro ao executar a ferramenta {tool_name}: {str(e)}")
        return jsonify({
            "error": {
                "type": "execution_error",
                "message": str(e)
            }
        }), 400

# Função auxiliar para uso direto das ferramentas
def run_tool(tool_name: str, **parameters) -> Dict[str, Any]:
    """
    Executa uma ferramenta diretamente.
    
    Args:
        tool_name (str): Nome da ferramenta a ser executada.
        **parameters: Parâmetros para a ferramenta.
        
    Returns:
        Dict[str, Any]: Resultado da execução da ferramenta.
        
    Raises:
        ValueError: Se a ferramenta não for encontrada.
    """
    tools = register_tools()
    
    if tool_name not in tools:
        raise ValueError(f"Ferramenta '{tool_name}' não encontrada")
    
    try:
        tool_function = tools[tool_name]["function"]
        return tool_function(**parameters)
    except Exception as e:
        raise RuntimeError(f"Erro ao executar a ferramenta {tool_name}: {str(e)}")
