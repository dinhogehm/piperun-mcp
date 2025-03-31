"""
Servidor JSON-RPC para o PipeRun MCP.
Este módulo implementa um servidor JSON-RPC que oferece as funcionalidades
do PipeRun MCP através do protocolo MCP (Model Context Protocol).
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from jsonrpc import JSONRPCResponseManager, dispatcher
import time

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Carrega as variáveis de ambiente
load_dotenv()

# Importa as ferramentas do PipeRun MCP
from src.tools import (
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

# Importa a configuração MCP
from src.mcp_config import mcp_config

# Importa as interfaces REST
from src.tools_interface import tools_bp, mcp_bp, register_tools, run_tool

# Inicializa a aplicação Flask
app = Flask(__name__)

# Registra os blueprints para as rotas REST
app.register_blueprint(tools_bp)
app.register_blueprint(mcp_bp)

# Dicionário com metadados das ferramentas para JSON-RPC
TOOLS_METADATA = {
    "listar_empresas": {
        "function": list_companies,
        "description": "Lista as empresas cadastradas no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome da empresa"},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "obter_empresa": {
        "function": get_company,
        "description": "Obtém detalhes de uma empresa específica",
        "parameters": {
            "company_id": {"type": "integer", "description": "ID da empresa", "required": True}
        }
    },
    "listar_contatos": {
        "function": list_contacts,
        "description": "Lista os contatos cadastrados no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome do contato"},
            "company_id": {"type": "integer", "description": "Filtrar contatos por ID da empresa"},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "obter_contato": {
        "function": get_contact,
        "description": "Obtém detalhes de um contato específico",
        "parameters": {
            "contact_id": {"type": "integer", "description": "ID do contato", "required": True}
        }
    },
    "listar_negocios": {
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
    "listar_funis": {
        "function": list_pipelines,
        "description": "Lista os funis de vendas no PipeRun",
        "parameters": {
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "listar_etapas_funil": {
        "function": list_stages,
        "description": "Lista as etapas de um funil específico no PipeRun",
        "parameters": {
            "pipeline_id": {"type": "integer", "description": "ID do funil", "required": True},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "listar_produtos": {
        "function": list_products,
        "description": "Lista os produtos cadastrados no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome do produto"},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "exportar_empresas_csv": {
        "function": export_companies_csv,
        "description": "Exporta empresas para formato CSV",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome da empresa"},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "exportar_contatos_csv": {
        "function": export_contacts_csv,
        "description": "Exporta contatos para formato CSV",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome do contato"},
            "company_id": {"type": "integer", "description": "ID da empresa para filtrar contatos"},
            "page": {"type": "integer", "description": "Número da página para paginação"},
            "show": {"type": "integer", "description": "Quantidade de itens por página"}
        }
    },
    "obter_estatisticas_funil": {
        "function": get_pipeline_statistics,
        "description": "Obtém estatísticas detalhadas de um funil de vendas",
        "parameters": {
            "pipeline_id": {"type": "integer", "description": "ID do funil de vendas", "required": True},
            "start_date": {"type": "string", "description": "Data inicial para filtro (YYYY-MM-DD)"},
            "end_date": {"type": "string", "description": "Data final para filtro (YYYY-MM-DD)"}
        }
    },
    "gerar_resumo_vendas": {
        "function": generate_sales_summary,
        "description": "Gera um resumo de vendas para um período específico",
        "parameters": {
            "period": {"type": "string", "description": "Período: day, week, month, quarter, year"}
        }
    },
    "verificar_saude_servidor": {
        "function": get_server_health,
        "description": "Verifica o estado de saúde do servidor MCP",
        "parameters": {}
    },
    "obter_diagnostico_servidor": {
        "function": get_diagnostics,
        "description": "Obtém informações de diagnóstico detalhadas sobre o servidor MCP",
        "parameters": {}
    },
    "resetar_metricas_servidor": {
        "function": reset_metrics,
        "description": "Reinicia todas as métricas coletadas pelo servidor",
        "parameters": {}
    },
    "verificar_conexao_api": {
        "function": check_api_connection,
        "description": "Verifica a conexão com a API do PipeRun",
        "parameters": {}
    }
}

# Função para listar as ferramentas disponíveis
@dispatcher.add_method
def mcp_list_tools(**kwargs) -> Dict[str, Any]:
    """
    Lista todas as ferramentas disponíveis no PipeRun MCP.
    
    Returns:
        Dict[str, Any]: Lista de ferramentas e suas descrições.
    """
    logger.info("Listando todas as ferramentas disponíveis (JSON-RPC)")
    
    tools_list = []
    
    for name, metadata in TOOLS_METADATA.items():
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
    
    return {"tools": tools_list}

# Função para executar uma ferramenta
@dispatcher.add_method
def mcp_run_tool(**kwargs) -> Dict[str, Any]:
    """
    Executa uma ferramenta específica do PipeRun MCP.
    
    Args:
        tool_name (str): Nome da ferramenta a ser executada.
        parameters (Dict[str, Any]): Parâmetros para a ferramenta.
        
    Returns:
        Dict[str, Any]: Resultado da execução da ferramenta.
    """
    tool_name = kwargs.get("tool_name")
    parameters = kwargs.get("parameters", {})
    
    logger.info(f"Executando ferramenta: {tool_name} (JSON-RPC)")
    logger.debug(f"Parâmetros: {parameters}")
    
    if not tool_name:
        error_msg = "Parâmetro 'tool_name' é obrigatório"
        logger.error(error_msg)
        track_error("MissingParameter", error_msg)
        return {
            "error": {
                "code": 400,
                "message": error_msg
            }
        }
    
    if tool_name not in TOOLS_METADATA:
        error_msg = f"Ferramenta '{tool_name}' não encontrada"
        logger.error(error_msg)
        track_error("ToolNotFound", error_msg)
        return {
            "error": {
                "code": 404,
                "message": error_msg
            }
        }
    
    try:
        # Registra a requisição para métricas
        track_request()
        
        # Inicia o timer para medir o tempo de execução
        start_time = time.time()
        
        # Executa a função correspondente à ferramenta
        tool_function = TOOLS_METADATA[tool_name]["function"]
        result = tool_function(**parameters)
        
        # Registra métricas de execução
        execution_time = time.time() - start_time
        track_tool_execution(tool_name, execution_time)
        
        return {"result": result}
    
    except Exception as e:
        error_msg = f"Erro ao executar a ferramenta {tool_name}: {str(e)}"
        logger.error(error_msg)
        track_error(type(e).__name__, str(e))
        return {
            "error": {
                "code": 500,
                "message": error_msg
            }
        }

# Rota para receber requisições JSON-RPC
@app.route('/jsonrpc', methods=['POST'])
def handle_jsonrpc():
    """Manipula requisições JSON-RPC."""
    logger.info("Recebida requisição JSON-RPC")
    
    # Registra a requisição para métricas
    track_request()
    
    response = JSONRPCResponseManager.handle(
        request.data, dispatcher
    )
    return jsonify(response.data)

# Rota raiz para verificar se o servidor está rodando
@app.route('/', methods=['GET'])
def index():
    """Rota raiz para verificar se o servidor está rodando."""
    logger.info("Verificação de status do servidor")
    
    return jsonify({
        "status": "online",
        "name": mcp_config.server_name,
        "version": mcp_config.server_version,
        "description": mcp_config.server_description,
        "endpoints": {
            "jsonrpc": "/jsonrpc",
            "tools": "/tools",
            "mcp": "/mcp"
        },
        "timestamp": datetime.now().isoformat()
    })

# Inicia o servidor
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    # Salva a configuração MCP
    mcp_config.save_to_file()
    
    logger.info(f"Iniciando servidor PipeRun MCP em {host}:{port}")
    app.run(debug=True, host=host, port=port)
