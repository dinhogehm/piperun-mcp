"""
Ferramentas para geração de relatórios e exportação de dados do PipeRun.
Este módulo implementa funcionalidades avançadas para exportação de dados e análise estatística.
"""
import csv
import io
import json
import logging
from typing import Dict, Any, Optional, List, Union
from decimal import Decimal
import datetime

from ..service.api_client import PipeRunApiClient
from ..config import Config
from .companies import list_companies
from .contacts import list_contacts
from .deals import list_deals
from .pipelines import list_pipelines, get_pipeline
from .stages import list_stages
from .utils import format_date

logger = logging.getLogger(__name__)


def export_companies_csv(
    search: Optional[str] = None,
    page: Optional[int] = 1,
    show: Optional[int] = 100,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para exportar empresas do PipeRun em formato CSV.
    
    Esta ferramenta permite exportar dados de empresas do PipeRun em formato CSV,
    com opções de filtro por nome e paginação.
    
    Exemplos de uso:
    1. Exportar todas as empresas: export_companies_csv()
    2. Exportar empresas por nome: export_companies_csv(search="Empresa ABC")
    3. Exportar com paginação: export_companies_csv(page=2, show=100)
    
    Args:
        search (Optional[str]): Termo para busca por nome da empresa.
        page (Optional[int]): Número da página para paginação.
        show (Optional[int]): Quantidade de itens por página (máximo 100).
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: CSV com os dados das empresas ou mensagem de erro.
    """
    logger.info(f"Exportando empresas para CSV com filtros: search={search}, page={page}, show={show}")
    
    # Obter lista de empresas
    result = list_companies(search=search, page=page, show=show, api_token=api_token)
    
    if not result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter empresas: {result.get('message', 'Erro desconhecido')}"
        }
    
    companies = result.get("items", [])
    
    if not companies:
        return {
            "success": True,
            "message": "Nenhuma empresa encontrada para exportar",
            "csv_data": "",
            "count": 0
        }
    
    # Criar arquivo CSV em memória
    output = io.StringIO()
    
    # Identificar todas as chaves possíveis (campos) nas empresas
    all_fields = set()
    for company in companies:
        all_fields.update(company.keys())
    
    # Priorizar campos comuns
    prioritized_fields = ["id", "name", "email", "phone", "created_at", "updated_at"]
    csv_fields = prioritized_fields + sorted(list(all_fields - set(prioritized_fields)))
    
    # Criar escritor CSV
    writer = csv.DictWriter(output, fieldnames=csv_fields)
    writer.writeheader()
    
    # Escrever dados das empresas
    for company in companies:
        # Garantir que todas as chaves existam no dicionário
        row = {field: company.get(field, "") for field in csv_fields}
        writer.writerow(row)
    
    csv_data = output.getvalue()
    output.close()
    
    return {
        "success": True,
        "message": f"Exportadas {len(companies)} empresas com sucesso",
        "csv_data": csv_data,
        "count": len(companies)
    }


def export_contacts_csv(
    search: Optional[str] = None,
    company_id: Optional[int] = None,
    page: Optional[int] = 1,
    show: Optional[int] = 100,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para exportar contatos do PipeRun em formato CSV.
    
    Esta ferramenta permite exportar dados de contatos do PipeRun em formato CSV,
    com opções de filtro por nome, empresa e paginação.
    
    Exemplos de uso:
    1. Exportar todos os contatos: export_contacts_csv()
    2. Exportar contatos por nome: export_contacts_csv(search="João Silva")
    3. Exportar contatos de uma empresa: export_contacts_csv(company_id=123)
    
    Args:
        search (Optional[str]): Termo para busca por nome do contato.
        company_id (Optional[int]): ID da empresa para filtrar contatos.
        page (Optional[int]): Número da página para paginação.
        show (Optional[int]): Quantidade de itens por página (máximo 100).
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: CSV com os dados dos contatos ou mensagem de erro.
    """
    logger.info(f"Exportando contatos para CSV com filtros: search={search}, company_id={company_id}, page={page}, show={show}")
    
    # Validar parâmetros
    if company_id is not None and (not isinstance(company_id, int) or company_id <= 0):
        return {
            "success": False,
            "message": "ID da empresa deve ser um número inteiro positivo"
        }
    
    # Obter lista de contatos
    result = list_contacts(search=search, company_id=company_id, page=page, show=show, api_token=api_token)
    
    if not result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter contatos: {result.get('message', 'Erro desconhecido')}"
        }
    
    contacts = result.get("items", [])
    
    if not contacts:
        return {
            "success": True,
            "message": "Nenhum contato encontrado para exportar",
            "csv_data": "",
            "count": 0
        }
    
    # Criar arquivo CSV em memória
    output = io.StringIO()
    
    # Identificar todas as chaves possíveis (campos) nos contatos
    all_fields = set()
    for contact in contacts:
        all_fields.update(contact.keys())
    
    # Priorizar campos comuns
    prioritized_fields = ["id", "name", "email", "phone", "company_id", "company_name", "created_at", "updated_at"]
    csv_fields = prioritized_fields + sorted(list(all_fields - set(prioritized_fields)))
    
    # Criar escritor CSV
    writer = csv.DictWriter(output, fieldnames=csv_fields)
    writer.writeheader()
    
    # Escrever dados dos contatos
    for contact in contacts:
        # Garantir que todas as chaves existam no dicionário
        row = {field: contact.get(field, "") for field in csv_fields}
        writer.writerow(row)
    
    csv_data = output.getvalue()
    output.close()
    
    return {
        "success": True,
        "message": f"Exportados {len(contacts)} contatos com sucesso",
        "csv_data": csv_data,
        "count": len(contacts)
    }


def get_pipeline_statistics(
    pipeline_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para obter estatísticas de um funil de vendas.
    
    Esta ferramenta calcula estatísticas detalhadas sobre um funil de vendas,
    incluindo total de negócios, valor total, média por etapa, taxa de conversão, etc.
    
    Exemplos de uso:
    1. Estatísticas gerais: get_pipeline_statistics(pipeline_id=123)
    2. Estatísticas por período: get_pipeline_statistics(pipeline_id=123, start_date="2025-01-01", end_date="2025-03-31")
    
    Args:
        pipeline_id (int): ID do funil de vendas.
        start_date (Optional[str]): Data inicial para filtro (formato YYYY-MM-DD).
        end_date (Optional[str]): Data final para filtro (formato YYYY-MM-DD).
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Estatísticas do funil ou mensagem de erro.
    """
    logger.info(f"Obtendo estatísticas do funil {pipeline_id} para o período: {start_date} a {end_date}")
    
    # Validar parâmetros
    if not isinstance(pipeline_id, int) or pipeline_id <= 0:
        return {
            "success": False,
            "message": "ID do funil deve ser um número inteiro positivo"
        }
    
    # Validar datas se fornecidas
    date_format = "%Y-%m-%d"
    if start_date:
        try:
            datetime.datetime.strptime(start_date, date_format)
        except ValueError:
            return {
                "success": False,
                "message": "Data inicial deve estar no formato YYYY-MM-DD"
            }
    
    if end_date:
        try:
            datetime.datetime.strptime(end_date, date_format)
        except ValueError:
            return {
                "success": False,
                "message": "Data final deve estar no formato YYYY-MM-DD"
            }
    
    # Obter detalhes do funil
    pipeline_result = get_pipeline(pipeline_id, api_token=api_token)
    if not pipeline_result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter detalhes do funil: {pipeline_result.get('message', 'Erro desconhecido')}"
        }
    
    pipeline = pipeline_result.get("data", {})
    
    # Obter etapas do funil
    stages_result = list_stages(pipeline_id=pipeline_id, api_token=api_token)
    if not stages_result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter etapas do funil: {stages_result.get('message', 'Erro desconhecido')}"
        }
    
    stages = stages_result.get("items", [])
    stages_dict = {stage["id"]: stage for stage in stages}
    
    # Obter negócios do funil
    deals_result = list_deals(pipeline_id=pipeline_id, api_token=api_token, show=100)
    if not deals_result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter negócios do funil: {deals_result.get('message', 'Erro desconhecido')}"
        }
    
    deals = deals_result.get("items", [])
    
    # Filtrar por data se necessário
    if start_date or end_date:
        filtered_deals = []
        for deal in deals:
            deal_date = deal.get("created_at", "")
            if not deal_date:
                continue
                
            # Formato da data vinda da API: 2025-03-31 15:54:05
            deal_date = deal_date.split(" ")[0]  # Pegar apenas a parte da data
            
            if start_date and deal_date < start_date:
                continue
                
            if end_date and deal_date > end_date:
                continue
                
            filtered_deals.append(deal)
        
        deals = filtered_deals
    
    # Calcular estatísticas
    total_deals = len(deals)
    
    if total_deals == 0:
        return {
            "success": True,
            "message": "Nenhum negócio encontrado para o período especificado",
            "pipeline_name": pipeline.get("name", ""),
            "total_deals": 0,
            "total_value": 0,
            "average_value": 0,
            "stages": [],
            "status_counts": {"won": 0, "lost": 0, "open": 0}
        }
    
    # Inicializar contadores
    total_value = 0
    stage_stats = {stage["id"]: {"count": 0, "value": 0, "name": stage["name"]} for stage in stages}
    status_counts = {"won": 0, "lost": 0, "open": 0}
    
    # Processar cada negócio
    for deal in deals:
        # Somar valor
        deal_value = float(deal.get("value", 0) or 0)
        total_value += deal_value
        
        # Contabilizar por etapa
        stage_id = deal.get("stage_id")
        if stage_id and stage_id in stage_stats:
            stage_stats[stage_id]["count"] += 1
            stage_stats[stage_id]["value"] += deal_value
        
        # Contabilizar por status
        status = deal.get("status", "open")
        if status in status_counts:
            status_counts[status] += 1
    
    # Calcular média por negócio
    average_value = total_value / total_deals if total_deals > 0 else 0
    
    # Preparar estatísticas por etapa
    stages_stats = []
    for stage_id, stats in stage_stats.items():
        if stats["count"] > 0:
            avg_value = stats["value"] / stats["count"]
            percentage = (stats["count"] / total_deals) * 100
            stages_stats.append({
                "id": stage_id,
                "name": stats["name"],
                "count": stats["count"],
                "value": stats["value"],
                "average_value": avg_value,
                "percentage": percentage
            })
    
    # Ordenar etapas pela ordem no funil
    stages_stats.sort(key=lambda x: [i for i, stage in enumerate(stages) if stage["id"] == x["id"]][0])
    
    # Calcular taxas de conversão entre etapas
    if len(stages_stats) > 1:
        for i in range(1, len(stages_stats)):
            prev_count = stages_stats[i-1]["count"]
            current_count = stages_stats[i]["count"]
            conversion_rate = (current_count / prev_count * 100) if prev_count > 0 else 0
            stages_stats[i]["conversion_rate"] = conversion_rate
        # A primeira etapa não tem taxa de conversão anterior
        stages_stats[0]["conversion_rate"] = 100
    
    return {
        "success": True,
        "pipeline_name": pipeline.get("name", ""),
        "total_deals": total_deals,
        "total_value": total_value,
        "average_value": average_value,
        "stages": stages_stats,
        "status_counts": status_counts,
        "period": {
            "start_date": start_date,
            "end_date": end_date
        }
    }


def generate_sales_summary(
    period: str = "month",
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ferramenta para gerar um resumo de vendas.
    
    Esta ferramenta gera um relatório resumido das vendas, incluindo total de negócios,
    valor total, média por negócio, distribuição por status e taxa de conversão.
    
    Exemplos de uso:
    1. Resumo do mês atual: generate_sales_summary()
    2. Resumo de outro período: generate_sales_summary(period="week")
    
    Args:
        period (str): Período para o resumo: "day", "week", "month", "quarter", "year".
        api_token (Optional[str]): Token de API do PipeRun.
        
    Returns:
        Dict[str, Any]: Resumo de vendas ou mensagem de erro.
    """
    logger.info(f"Gerando resumo de vendas para o período: {period}")
    
    # Validar período
    valid_periods = ["day", "week", "month", "quarter", "year"]
    if period not in valid_periods:
        return {
            "success": False,
            "message": f"Período inválido. Use um dos seguintes: {', '.join(valid_periods)}"
        }
    
    # Calcular datas de início e fim com base no período
    today = datetime.datetime.now()
    
    if period == "day":
        start_date = today.strftime("%Y-%m-%d")
        end_date = start_date
        period_description = f"Hoje ({start_date})"
    elif period == "week":
        # Início da semana (segunda-feira)
        start_date = (today - datetime.timedelta(days=today.weekday())).strftime("%Y-%m-%d")
        # Fim da semana (domingo)
        end_date = (today + datetime.timedelta(days=6-today.weekday())).strftime("%Y-%m-%d")
        period_description = f"Semana atual ({start_date} a {end_date})"
    elif period == "month":
        # Primeiro dia do mês
        start_date = today.replace(day=1).strftime("%Y-%m-%d")
        # Último dia do mês (aproximado para o mês seguinte - 1 dia)
        if today.month == 12:
            next_month = today.replace(year=today.year+1, month=1, day=1)
        else:
            next_month = today.replace(month=today.month+1, day=1)
        end_date = (next_month - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        period_description = f"Mês atual ({start_date} a {end_date})"
    elif period == "quarter":
        # Determinar o trimestre atual
        quarter = (today.month - 1) // 3 + 1
        # Primeiro dia do trimestre
        first_month = 3 * quarter - 2
        start_date = today.replace(month=first_month, day=1).strftime("%Y-%m-%d")
        # Último dia do trimestre
        if first_month + 2 == 12:
            last_day = today.replace(year=today.year+1, month=1, day=1) - datetime.timedelta(days=1)
        else:
            last_day = today.replace(month=first_month+3, day=1) - datetime.timedelta(days=1)
        end_date = last_day.strftime("%Y-%m-%d")
        period_description = f"{quarter}º trimestre ({start_date} a {end_date})"
    elif period == "year":
        # Primeiro dia do ano
        start_date = today.replace(month=1, day=1).strftime("%Y-%m-%d")
        # Último dia do ano
        end_date = today.replace(month=12, day=31).strftime("%Y-%m-%d")
        period_description = f"Ano atual ({start_date} a {end_date})"
    
    # Obter todos os funis
    pipelines_result = list_pipelines(api_token=api_token)
    if not pipelines_result.get("success", False):
        return {
            "success": False,
            "message": f"Erro ao obter funis: {pipelines_result.get('message', 'Erro desconhecido')}"
        }
    
    pipelines = pipelines_result.get("items", [])
    
    if not pipelines:
        return {
            "success": True,
            "message": "Nenhum funil encontrado",
            "period": period_description,
            "total_deals": 0,
            "won_deals": 0,
            "total_value": 0,
            "pipeline_summaries": []
        }
    
    # Inicializar contadores
    total_deals = 0
    total_value = 0
    won_deals = 0
    won_value = 0
    lost_deals = 0
    pipeline_summaries = []
    
    # Para cada funil, obter estatísticas
    for pipeline in pipelines:
        pipeline_id = pipeline.get("id")
        stats = get_pipeline_statistics(
            pipeline_id=pipeline_id,
            start_date=start_date,
            end_date=end_date,
            api_token=api_token
        )
        
        if not stats.get("success", False):
            logger.warning(f"Erro ao obter estatísticas do funil {pipeline_id}: {stats.get('message')}")
            continue
        
        pipeline_deals = stats.get("total_deals", 0)
        pipeline_value = stats.get("total_value", 0)
        status_counts = stats.get("status_counts", {})
        
        # Somar ao total
        total_deals += pipeline_deals
        total_value += pipeline_value
        won_deals += status_counts.get("won", 0)
        lost_deals += status_counts.get("lost", 0)
        
        # Calcular valor dos negócios ganhos para este funil
        pipeline_won_value = 0
        if "stages" in stats:
            for stage in stats["stages"]:
                stage_deals = list_deals(
                    pipeline_id=pipeline_id,
                    stage_id=stage["id"],
                    status="won",
                    api_token=api_token
                )
                if stage_deals.get("success", False):
                    for deal in stage_deals.get("items", []):
                        pipeline_won_value += float(deal.get("value", 0) or 0)
        
        won_value += pipeline_won_value
        
        # Adicionar resumo do funil
        if pipeline_deals > 0:
            pipeline_summaries.append({
                "id": pipeline_id,
                "name": stats.get("pipeline_name", f"Funil {pipeline_id}"),
                "total_deals": pipeline_deals,
                "total_value": pipeline_value,
                "won_deals": status_counts.get("won", 0),
                "won_value": pipeline_won_value,
                "lost_deals": status_counts.get("lost", 0),
                "open_deals": status_counts.get("open", 0),
                "conversion_rate": (status_counts.get("won", 0) / pipeline_deals * 100) if pipeline_deals > 0 else 0
            })
    
    # Calcular médias e taxas
    avg_deal_value = total_value / total_deals if total_deals > 0 else 0
    avg_won_value = won_value / won_deals if won_deals > 0 else 0
    conversion_rate = (won_deals / total_deals * 100) if total_deals > 0 else 0
    
    # Ordenar funis por valor total
    pipeline_summaries.sort(key=lambda x: x["total_value"], reverse=True)
    
    return {
        "success": True,
        "period": period_description,
        "date_range": {
            "start_date": start_date,
            "end_date": end_date
        },
        "total_deals": total_deals,
        "total_value": total_value,
        "average_deal_value": avg_deal_value,
        "won_deals": won_deals,
        "won_value": won_value,
        "average_won_value": avg_won_value,
        "lost_deals": lost_deals,
        "conversion_rate": conversion_rate,
        "pipeline_summaries": pipeline_summaries
    }
