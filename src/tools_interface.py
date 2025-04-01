"""
Interface REST para ferramentas do PipeRun MCP.
Este módulo implementa uma interface REST que expõe as ferramentas do PipeRun MCP
de forma similar ao GitHub MCP, seguindo as melhores práticas do Model Context Protocol.
"""
import logging
import time
from typing import Dict, Any, List, Optional
from flask import Blueprint, jsonify, request, current_app

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Importa a configuração MCP
from .mcp_config import mcp_config

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
    
    # Usuários
    list_users,
    get_user,
    get_current_user,
    create_user,
    update_user,
    deactivate_user,
    count_users,
    
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
    delete_product,
    
    # Relatórios e estatísticas
    export_companies_csv,
    export_contacts_csv,
    get_pipeline_statistics,
    generate_sales_summary,
    
    # Diagnóstico do servidor MCP
    get_server_health,
    get_diagnostics,
    reset_metrics,
    check_api_connection,
    track_request,
    track_tool_execution,
    track_error
)

# Importação dos templates de prompts
from .prompts.templates import (
    get_lead_analysis_prompt,
    get_contact_activity_summary_prompt,
    get_sales_performance_prompt,
    get_pipeline_analysis_prompt,
    get_follow_up_strategy_prompt
)

# Blueprint para as rotas da API REST
tools_bp = Blueprint('tools', __name__, url_prefix='/tools')

# Blueprint para endpoints MCP específicos
mcp_bp = Blueprint('mcp', __name__, url_prefix='/mcp')

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
        },
        
        # Relatórios e estatísticas
        "export_companies_csv": {
            "function": export_companies_csv,
            "description": "Exporta empresas para formato CSV",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome da empresa"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        "export_contacts_csv": {
            "function": export_contacts_csv,
            "description": "Exporta contatos para formato CSV",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome do contato"},
                "company_id": {"type": "integer", "description": "ID da empresa para filtrar contatos"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "show": {"type": "integer", "description": "Quantidade de itens por página"}
            }
        },
        "get_pipeline_statistics": {
            "function": get_pipeline_statistics,
            "description": "Obtém estatísticas detalhadas de um funil de vendas",
            "parameters": {
                "pipeline_id": {"type": "integer", "description": "ID do funil de vendas", "required": True},
                "start_date": {"type": "string", "description": "Data inicial para filtro (YYYY-MM-DD)"},
                "end_date": {"type": "string", "description": "Data final para filtro (YYYY-MM-DD)"}
            }
        },
        "generate_sales_summary": {
            "function": generate_sales_summary,
            "description": "Gera um resumo de vendas para um período específico",
            "parameters": {
                "period": {"type": "string", "description": "Período: day, week, month, quarter, year"}
            }
        },
        
        # Templates de prompts
        "get_lead_analysis_prompt": {
            "function": get_lead_analysis_prompt,
            "description": "Gera um prompt para análise de lead",
            "parameters": {
                "contact_data": {"type": "object", "description": "Dados do contato", "required": True},
                "interactions": {"type": "array", "description": "Lista de interações com o contato"},
                "deals": {"type": "array", "description": "Lista de oportunidades do contato"}
            }
        },
        "get_contact_activity_summary_prompt": {
            "function": get_contact_activity_summary_prompt,
            "description": "Gera um prompt para resumo de atividades de um contato",
            "parameters": {
                "contact_data": {"type": "object", "description": "Dados do contato", "required": True},
                "activities": {"type": "array", "description": "Lista de atividades do contato"},
                "active_deals": {"type": "array", "description": "Lista de oportunidades ativas"},
                "pending_tasks": {"type": "array", "description": "Lista de tarefas pendentes"},
                "start_date": {"type": "string", "description": "Data inicial (YYYY-MM-DD)", "required": True},
                "end_date": {"type": "string", "description": "Data final (YYYY-MM-DD)", "required": True}
            }
        },
        "get_sales_performance_prompt": {
            "function": get_sales_performance_prompt,
            "description": "Gera um prompt para análise de performance de vendas",
            "parameters": {
                "sales_data": {"type": "object", "description": "Dados gerais de vendas", "required": True},
                "pipeline_data": {"type": "array", "description": "Performance por funil"},
                "sales_rep_data": {"type": "array", "description": "Performance por vendedor"},
                "product_data": {"type": "array", "description": "Performance por produto"},
                "start_date": {"type": "string", "description": "Data inicial (YYYY-MM-DD)", "required": True},
                "end_date": {"type": "string", "description": "Data final (YYYY-MM-DD)", "required": True}
            }
        },
        "get_pipeline_analysis_prompt": {
            "function": get_pipeline_analysis_prompt,
            "description": "Gera um prompt para análise detalhada de um funil de vendas",
            "parameters": {
                "pipeline_data": {"type": "object", "description": "Dados gerais do funil", "required": True},
                "stage_data": {"type": "array", "description": "Dados de cada etapa do funil"},
                "timing_data": {"type": "array", "description": "Dados de tempo médio por etapa"},
                "loss_reasons_data": {"type": "array", "description": "Razões de perda de negócios"},
                "start_date": {"type": "string", "description": "Data inicial (YYYY-MM-DD)", "required": True},
                "end_date": {"type": "string", "description": "Data final (YYYY-MM-DD)", "required": True}
            }
        },
        "get_follow_up_strategy_prompt": {
            "function": get_follow_up_strategy_prompt,
            "description": "Gera um prompt para estratégia de follow-up personalizada",
            "parameters": {
                "contact_data": {"type": "object", "description": "Dados do contato", "required": True},
                "deal_data": {"type": "object", "description": "Dados da oportunidade", "required": True},
                "communication_history": {"type": "array", "description": "Histórico de comunicações"}
            }
        },
        
        # Diagnóstico do servidor MCP
        "get_server_health": {
            "function": get_server_health,
            "description": "Verifica o estado de saúde do servidor MCP",
            "parameters": {}
        },
        "get_diagnostics": {
            "function": get_diagnostics,
            "description": "Obtém informações de diagnóstico detalhadas sobre o servidor MCP",
            "parameters": {}
        },
        "reset_metrics": {
            "function": reset_metrics,
            "description": "Reinicia todas as métricas coletadas pelo servidor",
            "parameters": {}
        },
        "check_api_connection": {
            "function": check_api_connection,
            "description": "Verifica a conexão com a API do PipeRun",
            "parameters": {}
        },
        
        # Usuários
        "list_users": {
            "function": list_users,
            "description": "Lista os usuários cadastrados no PipeRun",
            "parameters": {
                "search": {"type": "string", "description": "Termo para busca por nome ou email do usuário"},
                "team_id": {"type": "integer", "description": "Filtrar por ID da equipe"},
                "page": {"type": "integer", "description": "Número da página para paginação"},
                "per_page": {"type": "integer", "description": "Quantidade de itens por página"},
                "status": {"type": "boolean", "description": "Filtrar por status (ativo/inativo)"}
            }
        },
        "get_user": {
            "function": get_user,
            "description": "Obtém detalhes de um usuário específico no PipeRun",
            "parameters": {
                "user_id": {"type": "integer", "description": "ID do usuário", "required": True}
            }
        },
        "get_current_user": {
            "function": get_current_user,
            "description": "Obtém detalhes do usuário atual (associado ao token de API)",
            "parameters": {}
        },
        "create_user": {
            "function": create_user,
            "description": "Cria um novo usuário no PipeRun",
            "parameters": {
                "name": {"type": "string", "description": "Nome do usuário", "required": True},
                "email": {"type": "string", "description": "Email do usuário", "required": True},
                "password": {"type": "string", "description": "Senha do usuário", "required": True},
                "role": {"type": "string", "description": "Função do usuário na empresa"},
                "phone": {"type": "string", "description": "Telefone fixo do usuário"},
                "mobile_phone": {"type": "string", "description": "Telefone móvel do usuário"},
                "team_id": {"type": "integer", "description": "ID da equipe do usuário"}
            }
        },
        "update_user": {
            "function": update_user,
            "description": "Atualiza um usuário existente no PipeRun",
            "parameters": {
                "user_id": {"type": "integer", "description": "ID do usuário", "required": True},
                "name": {"type": "string", "description": "Nome do usuário"},
                "email": {"type": "string", "description": "Email do usuário"},
                "role": {"type": "string", "description": "Função do usuário na empresa"},
                "phone": {"type": "string", "description": "Telefone fixo do usuário"},
                "mobile_phone": {"type": "string", "description": "Telefone móvel do usuário"},
                "team_id": {"type": "integer", "description": "ID da equipe do usuário"},
                "status": {"type": "boolean", "description": "Status do usuário (ativo/inativo)"}
            }
        },
        "deactivate_user": {
            "function": deactivate_user,
            "description": "Desativa um usuário no PipeRun",
            "parameters": {
                "user_id": {"type": "integer", "description": "ID do usuário", "required": True}
            }
        },
        "count_users": {
            "function": count_users,
            "description": "Conta o número total de usuários na conta PipeRun",
            "parameters": {}
        }
    }

# Middleware para registrar métricas de requisição
@tools_bp.before_request
def before_request():
    """Registra a requisição para métricas antes de processar."""
    track_request()

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
@tools_bp.route('/<tool_name>', methods=['GET', 'POST'])
def execute_tool(tool_name):
    """
    Executa uma ferramenta específica do PipeRun MCP.
    
    Args:
        tool_name (str): Nome da ferramenta a ser executada.
        
    Returns:
        JSON: Resultado da execução da ferramenta.
    """
    logger.info(f"Executando ferramenta: {tool_name} via método {request.method}")
    
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
        # Obtém os parâmetros da requisição com base no método HTTP
        if request.method == 'POST':
            parameters = request.json or {}
        else:  # GET
            parameters = request.args.to_dict()
            
            # Converte valores numéricos de string para número
            for key, value in parameters.items():
                if value.isdigit():
                    parameters[key] = int(value)
                elif value.lower() == 'true':
                    parameters[key] = True
                elif value.lower() == 'false':
                    parameters[key] = False
                    
        logger.debug(f"Parâmetros: {parameters}")
        
        # Inicia o timer para medir o tempo de execução
        start_time = time.time()
        
        # Executa a função correspondente à ferramenta
        tool_function = tools[tool_name]["function"]
        result = tool_function(**parameters)
        
        # Registra métricas de execução
        execution_time = time.time() - start_time
        track_tool_execution(tool_name, execution_time)
        
        # Retorna o resultado diretamente para endpoints que não retornam estrutura result
        if tool_name in ['count_users', 'list_users', 'get_current_user']:
            return jsonify(result)
        else:
            # Retorna o resultado no formato padrão
            return jsonify({"result": result})
    except Exception as e:
        logger.error(f"Erro ao executar a ferramenta {tool_name}: {str(e)}")
        # Registra o erro
        track_error(type(e).__name__, str(e))
        return jsonify({
            "error": {
                "type": "execution_error",
                "message": str(e)
            }
        }), 400

# Rota para exibir informações sobre o servidor MCP
@mcp_bp.route('/info', methods=['GET'])
def get_mcp_info():
    """
    Retorna informações sobre o servidor MCP e suas capacidades.
    
    Returns:
        JSON: Informações sobre o servidor MCP.
    """
    logger.info("Exibindo informações do servidor MCP")
    
    return jsonify({
        "mcp_version": "1.0",
        "server": {
            "name": mcp_config.server_name,
            "version": mcp_config.server_version,
            "description": mcp_config.server_description
        },
        "capabilities": {
            "tools": True,
            "resources": mcp_config.support_resources,
            "prompts": mcp_config.support_prompts
        },
        "transport_protocols": mcp_config.transports,
        "tool_categories": mcp_config.tool_categories
    })

# Rota para verificar a saúde do servidor MCP
@mcp_bp.route('/health', methods=['GET'])
def health_check():
    """
    Verifica a saúde do servidor MCP.
    
    Returns:
        JSON: Estado de saúde do servidor.
    """
    logger.info("Verificando saúde do servidor MCP")
    
    health_data = get_server_health()
    
    # Definir o código de status HTTP baseado no estado de saúde
    status_code = 200
    if health_data.get("status") == "warning":
        status_code = 200  # Ainda OK, mas com avisos
    elif health_data.get("status") == "error":
        status_code = 500  # Erro interno do servidor
    
    return jsonify(health_data), status_code

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
        # Inicia o timer para medir o tempo de execução
        start_time = time.time()
        
        # Executa a função
        tool_function = tools[tool_name]["function"]
        result = tool_function(**parameters)
        
        # Registra métricas de execução
        execution_time = time.time() - start_time
        track_tool_execution(tool_name, execution_time)
        
        return result
    except Exception as e:
        # Registra o erro
        track_error(type(e).__name__, str(e))
        raise RuntimeError(f"Erro ao executar a ferramenta {tool_name}: {str(e)}")
