"""
Ferramentas de diagnóstico para o servidor PipeRun MCP.

Este módulo implementa ferramentas de diagnóstico que seguem as melhores práticas
da especificação do Model Context Protocol (MCP).
"""
from typing import Dict, Any, List, Optional
import platform
import psutil
import logging
import os
import time
from datetime import datetime, timedelta

from ..mcp_config import mcp_config

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Variáveis para rastreamento de métricas
_server_start_time = time.time()
_request_count = 0
_tool_executions = {}
_errors = {}

def track_request():
    """Registra uma nova requisição para métricas."""
    global _request_count
    _request_count += 1

def track_tool_execution(tool_name: str, execution_time: float):
    """Registra a execução de uma ferramenta para métricas."""
    if tool_name not in _tool_executions:
        _tool_executions[tool_name] = {
            "count": 0,
            "total_time": 0,
            "avg_time": 0,
            "max_time": 0
        }
    
    stats = _tool_executions[tool_name]
    stats["count"] += 1
    stats["total_time"] += execution_time
    stats["avg_time"] = stats["total_time"] / stats["count"]
    
    if execution_time > stats["max_time"]:
        stats["max_time"] = execution_time

def track_error(error_type: str, error_message: str):
    """Registra um erro para métricas."""
    if error_type not in _errors:
        _errors[error_type] = {
            "count": 0,
            "messages": []
        }
    
    stats = _errors[error_type]
    stats["count"] += 1
    
    # Limita a quantidade de mensagens de erro armazenadas
    if len(stats["messages"]) < 10:
        stats["messages"].append(error_message)

def get_server_health() -> Dict[str, Any]:
    """
    Verifica o estado de saúde do servidor MCP.
    
    Esta função realiza verificações básicas para garantir que o servidor está
    funcionando corretamente.
    
    Returns:
        Dict[str, Any]: Informações sobre o estado de saúde do servidor.
    """
    try:
        # Verificar recursos do sistema
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Tempo de atividade
        uptime = time.time() - _server_start_time
        uptime_formatted = str(timedelta(seconds=int(uptime)))
        
        # Verificar variáveis de ambiente críticas
        env_status = "ok"
        env_message = "Todas as variáveis de ambiente necessárias estão configuradas."
        
        if not os.environ.get('PIPERUN_API_TOKEN'):
            env_status = "warning"
            env_message = "PIPERUN_API_TOKEN não está configurado. As operações da API PipeRun não funcionarão."
        
        # Construir resposta
        health_data = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "uptime": uptime_formatted,
            "system": {
                "platform": platform.system(),
                "platform_version": platform.version(),
                "python_version": platform.python_version(),
                "cpu_cores": psutil.cpu_count(),
                "memory_usage_percent": memory.percent,
                "disk_usage_percent": disk.percent
            },
            "environment": {
                "status": env_status,
                "message": env_message
            },
            "server_config": {
                "name": mcp_config.server_name,
                "version": mcp_config.server_version,
                "transports": mcp_config.transports
            }
        }
        
        # Adicionar avisos se recursos estiverem acima de limites
        warnings = []
        
        if memory.percent > 90:
            warnings.append("Uso de memória está acima de 90%")
            health_data["status"] = "warning"
        
        if disk.percent > 90:
            warnings.append("Uso de disco está acima de 90%")
            health_data["status"] = "warning"
        
        if env_status == "warning":
            warnings.append(env_message)
            health_data["status"] = "warning"
        
        if warnings:
            health_data["warnings"] = warnings
        
        logger.info(f"Verificação de saúde do servidor concluída: {health_data['status']}")
        return health_data
    
    except Exception as e:
        logger.error(f"Erro ao verificar saúde do servidor: {str(e)}")
        return {
            "status": "error",
            "message": f"Erro ao verificar saúde do servidor: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def get_diagnostics() -> Dict[str, Any]:
    """
    Obtém informações de diagnóstico detalhadas sobre o servidor MCP.
    
    Esta função coleta métricas de desempenho, configurações e estatísticas de uso
    para ajudar na solução de problemas.
    
    Returns:
        Dict[str, Any]: Informações de diagnóstico detalhadas.
    """
    try:
        # Informações básicas do servidor
        health_data = get_server_health()
        
        # Métricas de utilização
        diagnostics = {
            "server_health": health_data,
            "metrics": {
                "request_count": _request_count,
                "tool_executions": _tool_executions,
                "errors": _errors
            },
            "config": mcp_config.to_dict(),
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info("Diagnóstico do servidor concluído com sucesso")
        return diagnostics
    
    except Exception as e:
        logger.error(f"Erro ao gerar diagnóstico do servidor: {str(e)}")
        return {
            "status": "error",
            "message": f"Erro ao gerar diagnóstico do servidor: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def reset_metrics() -> Dict[str, Any]:
    """
    Reinicia todas as métricas coletadas pelo servidor.
    
    Esta função limpa todos os contadores e estatísticas, mantendo apenas
    o tempo de início do servidor.
    
    Returns:
        Dict[str, Any]: Confirmação de que as métricas foram reiniciadas.
    """
    global _request_count, _tool_executions, _errors
    
    try:
        # Armazenar valores antigos para o relatório
        old_metrics = {
            "request_count": _request_count,
            "tool_executions_count": len(_tool_executions),
            "error_count": sum(e["count"] for e in _errors.values()) if _errors else 0
        }
        
        # Reiniciar contadores
        _request_count = 0
        _tool_executions = {}
        _errors = {}
        
        logger.info("Métricas do servidor reiniciadas com sucesso")
        return {
            "status": "success",
            "message": "Métricas reiniciadas com sucesso",
            "previous_metrics": old_metrics,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Erro ao reiniciar métricas do servidor: {str(e)}")
        return {
            "status": "error",
            "message": f"Erro ao reiniciar métricas do servidor: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def check_api_connection() -> Dict[str, Any]:
    """
    Verifica a conexão com a API do PipeRun.
    
    Esta função testa a conectividade com a API do PipeRun para garantir
    que as operações possam ser realizadas corretamente.
    
    Returns:
        Dict[str, Any]: Informações sobre o status da conexão.
    """
    import requests
    from ..config import Config
    
    try:
        # Obter configurações da API
        api_base_url = Config.BASE_URL
        api_token = Config.get_api_token()
        
        if not api_token:
            return {
                "status": "error",
                "message": "Token de API não configurado. Configure a variável de ambiente PIPERUN_API_TOKEN.",
                "timestamp": datetime.now().isoformat()
            }
        
        # Verificar endpoint básico de usuário
        start_time = time.time()
        response = requests.get(
            f"{api_base_url}/me/user-data",
            headers={"Token": api_token, "Content-Type": "application/json"}
        )
        response_time = time.time() - start_time
        
        # Analisar resultado
        if response.status_code == 200:
            user_data = response.json().get("data", {})
            return {
                "status": "connected",
                "user": {
                    "id": user_data.get("id"),
                    "name": user_data.get("name"),
                    "email": user_data.get("email")
                },
                "response_time_ms": int(response_time * 1000),
                "api_url": api_base_url,
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "status": "error",
                "message": f"Erro ao conectar à API do PipeRun. Código de status: {response.status_code}",
                "details": response.text,
                "api_url": api_base_url,
                "timestamp": datetime.now().isoformat()
            }
    
    except Exception as e:
        logger.error(f"Erro ao verificar conexão com API do PipeRun: {str(e)}")
        return {
            "status": "error",
            "message": f"Erro ao verificar conexão com API do PipeRun: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
