"""
Servidor JSON-RPC para o PipeRun MCP.
Este módulo implementa um servidor JSON-RPC que oferece as funcionalidades
do PipeRun MCP através do protocolo MCP (Model Context Protocol).
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from jsonrpc import JSONRPCResponseManager, dispatcher

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
    delete_product
)

# Inicializa a aplicação Flask
app = Flask(__name__)

# Define as ferramentas e suas descrições para o MCP
TOOLS_METADATA = {
    "listar_empresas": {
        "function": list_companies,
        "description": "Lista as empresas cadastradas no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome da empresa"},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"},
            "order_by": {"type": "string", "description": "Campo para ordenação"},
            "order_type": {"type": "string", "description": "Tipo de ordenação (asc/desc)"},
            "status": {"type": "boolean", "description": "Status da empresa (true para ativo, false para inativo)"},
            "account_id": {"type": "integer", "description": "ID da conta à qual as empresas pertencem"}
        }
    },
    "criar_empresa": {
        "function": create_company,
        "description": "Cria uma nova empresa no PipeRun",
        "parameters": {
            "name": {"type": "string", "description": "Nome da empresa", "required": True},
            "email": {"type": "string", "description": "Email da empresa"},
            "phone": {"type": "string", "description": "Telefone da empresa"},
            "website": {"type": "string", "description": "Site da empresa"},
            "address": {"type": "string", "description": "Endereço da empresa"}
        }
    },
    "consultar_empresa": {
        "function": get_company,
        "description": "Consulta uma empresa específica pelo ID",
        "parameters": {
            "company_id": {"type": "integer", "description": "ID da empresa a ser consultada", "required": True}
        }
    },
    "listar_contatos": {
        "function": list_contacts,
        "description": "Lista os contatos cadastrados no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome do contato"},
            "company_id": {"type": "integer", "description": "ID da empresa relacionada"},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
    },
    "criar_contato": {
        "function": create_contact,
        "description": "Cria um novo contato no PipeRun",
        "parameters": {
            "name": {"type": "string", "description": "Nome do contato", "required": True},
            "email": {"type": "string", "description": "Email do contato"},
            "company_id": {"type": "integer", "description": "ID da empresa do contato"},
            "phone": {"type": "string", "description": "Telefone do contato"},
            "mobile_phone": {"type": "string", "description": "Celular do contato"},
            "position": {"type": "string", "description": "Cargo do contato"}
        }
    },
    "listar_oportunidades": {
        "function": list_deals,
        "description": "Lista as oportunidades/negócios cadastrados no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por título"},
            "company_id": {"type": "integer", "description": "ID da empresa"},
            "person_id": {"type": "integer", "description": "ID do contato"},
            "pipeline_id": {"type": "integer", "description": "ID do funil"},
            "stage_id": {"type": "integer", "description": "ID da etapa do funil"},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
    },
    "criar_oportunidade": {
        "function": create_deal,
        "description": "Cria uma nova oportunidade/negócio no PipeRun",
        "parameters": {
            "title": {"type": "string", "description": "Título da oportunidade", "required": True},
            "pipeline_id": {"type": "integer", "description": "ID do funil", "required": True},
            "stage_id": {"type": "integer", "description": "ID da etapa do funil", "required": True},
            "company_id": {"type": "integer", "description": "ID da empresa relacionada"},
            "person_id": {"type": "integer", "description": "ID do contato relacionado"},
            "value": {"type": "number", "description": "Valor da oportunidade"},
            "forecast_date": {"type": "string", "description": "Data prevista para fechamento"}
        }
    },
    "listar_funis": {
        "function": list_pipelines,
        "description": "Lista os funis de vendas no PipeRun",
        "parameters": {
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
    },
    "listar_etapas_funil": {
        "function": list_stages,
        "description": "Lista as etapas de um funil específico no PipeRun",
        "parameters": {
            "pipeline_id": {"type": "integer", "description": "ID do funil", "required": True},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
    },
    "listar_campos_customizados": {
        "function": list_custom_fields,
        "description": "Lista os campos customizados no PipeRun",
        "parameters": {
            "entity_type": {"type": "string", "description": "Tipo da entidade"},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
    },
    "listar_produtos": {
        "function": list_products,
        "description": "Lista os produtos cadastrados no PipeRun",
        "parameters": {
            "search": {"type": "string", "description": "Termo para busca por nome do produto"},
            "page": {"type": "integer", "description": "Número da página"},
            "show": {"type": "integer", "description": "Itens por página"}
        }
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
    logger.info("Listando ferramentas disponíveis")
    
    tools = []
    for tool_name, metadata in TOOLS_METADATA.items():
        parameters = {}
        for param_name, param_info in metadata.get("parameters", {}).items():
            parameters[param_name] = {
                "type": param_info.get("type", "string"),
                "description": param_info.get("description", ""),
                "required": param_info.get("required", False)
            }
        
        tools.append({
            "name": tool_name,
            "description": metadata.get("description", ""),
            "parameters": parameters
        })
    
    return {
        "tools": tools
    }

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
    
    logger.info(f"Executando ferramenta: {tool_name}")
    logger.debug(f"Parâmetros: {parameters}")
    
    if not tool_name or tool_name not in TOOLS_METADATA:
        return {
            "error": {
                "type": "tool_not_found",
                "message": f"Ferramenta '{tool_name}' não encontrada."
            }
        }
    
    try:
        # Executa a função correspondente à ferramenta
        tool_function = TOOLS_METADATA[tool_name]["function"]
        result = tool_function(**parameters)
        
        # Formata o resultado para o formato MCP
        return {
            "result": result
        }
    except Exception as e:
        logger.error(f"Erro ao executar a ferramenta {tool_name}: {str(e)}")
        return {
            "error": {
                "type": "execution_error",
                "message": str(e)
            }
        }

# Rota para receber requisições JSON-RPC
@app.route("/jsonrpc", methods=["POST", "GET"])
def handle_jsonrpc():
    """Manipula requisições JSON-RPC."""
    if request.method == "GET":
        return jsonify({
            "message": "Este endpoint JSON-RPC só aceita requisições POST.",
            "exemplo": "Use curl -X POST -H 'Content-Type: application/json' -d '{\"jsonrpc\": \"2.0\", \"method\": \"mcp_list_tools\", \"params\": {}, \"id\": 1}' http://localhost:8000/jsonrpc"
        })
    
    response = JSONRPCResponseManager.handle(request.data, dispatcher)
    return jsonify(response.data)

# Rota raiz para verificar se o servidor está rodando
@app.route("/", methods=["GET"])
def index():
    """Rota raiz para verificar se o servidor está rodando."""
    return jsonify({
        "name": "PipeRun MCP",
        "description": "Servidor JSON-RPC para o PipeRun MCP",
        "version": "0.1.0",
        "status": "running",
        "tools_count": len(TOOLS_METADATA)
    })

# Inicia o servidor
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    logger.info(f"Iniciando servidor PipeRun MCP na porta {port}")
    app.run(host=host, port=port)
