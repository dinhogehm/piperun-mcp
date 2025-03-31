"""
Templates de prompts para o PipeRun MCP.
Este módulo contém templates de prompts predefinidos para cenários comuns de uso do PipeRun.
"""
from typing import Dict, Any, List, Optional

# Template para análise de leads
LEAD_ANALYSIS_TEMPLATE = """
# Análise de Lead: {contact_name}

## Informações do Contato
- Nome: {contact_name}
- Email: {contact_email}
- Telefone: {contact_phone}
- Empresa: {company_name}
- Cargo: {contact_position}

## Histórico de Interações
{interaction_history}

## Oportunidades Associadas
{deals_info}

## Perguntas para Análise
1. Qual é o perfil deste lead com base nas informações disponíveis?
2. Quais são os próximos passos recomendados para avançar com este lead?
3. Qual é a probabilidade de conversão deste lead em cliente?
4. Quais produtos/serviços seriam mais adequados para oferecer a este lead?
5. Existem sinais de que este lead precisa de atenção especial?

Use as informações acima para analisar este lead e fornecer recomendações estratégicas para a equipe de vendas.
"""

# Template para resumo de atividades de um contato
CONTACT_ACTIVITY_SUMMARY_TEMPLATE = """
# Resumo de Atividades: {contact_name}

## Informações do Contato
- Nome: {contact_name}
- Email: {contact_email}
- Telefone: {contact_phone}
- Empresa: {company_name}

## Período Analisado
- De: {start_date}
- Até: {end_date}

## Atividades Recentes
{activities}

## Oportunidades Ativas
{active_deals}

## Tarefas Pendentes
{pending_tasks}

## Perguntas para Análise
1. Qual foi o nível de engajamento deste contato no período analisado?
2. Quais são os principais pontos de interesse demonstrados por este contato?
3. Existem oportunidades de negócio que precisam de acompanhamento imediato?
4. Quais tarefas pendentes são prioritárias?
5. Há algum padrão de comportamento que mereça atenção especial?

Use as informações acima para criar um resumo conciso e acionável sobre as atividades deste contato.
"""

# Template para relatório de performance de vendas
SALES_PERFORMANCE_TEMPLATE = """
# Relatório de Performance de Vendas

## Período Analisado
- De: {start_date}
- Até: {end_date}

## Resumo Geral
- Total de negócios: {total_deals}
- Valor total: R$ {total_value}
- Negócios fechados: {won_deals}
- Taxa de conversão: {conversion_rate}%

## Performance por Funil
{pipeline_performance}

## Performance por Vendedor
{sales_rep_performance}

## Principais Produtos/Serviços
{top_products}

## Perguntas para Análise
1. Quais funis de vendas estão performando melhor no período analisado?
2. Quais vendedores se destacaram e por quê?
3. Quais produtos/serviços têm maior taxa de conversão?
4. Existem gargalos no processo de vendas que precisam ser otimizados?
5. Quais são as tendências de vendas observadas neste período?

Use as informações acima para analisar a performance de vendas e fornecer insights estratégicos para a equipe.
"""

# Template para análise de funil de vendas
PIPELINE_ANALYSIS_TEMPLATE = """
# Análise de Funil: {pipeline_name}

## Período Analisado
- De: {start_date}
- Até: {end_date}

## Visão Geral
- Total de negócios: {total_deals}
- Valor total: R$ {total_value}
- Ticket médio: R$ {average_value}
- Negócios ganhos: {won_deals}
- Negócios perdidos: {lost_deals}
- Taxa de conversão: {conversion_rate}%

## Análise por Etapa
{stage_analysis}

## Tempo Médio por Etapa
{stage_timing}

## Principais Razões de Perda
{loss_reasons}

## Perguntas para Análise
1. Em quais etapas do funil há maior abandono (drop-off)?
2. Quais etapas têm tempos de processamento atípicos?
3. Quais são as principais razões para perda de negócios?
4. Existem oportunidades de otimização no fluxo do funil?
5. Como a performance deste funil se compara com períodos anteriores?

Use as informações acima para analisar o funil de vendas e identificar oportunidades de melhoria.
"""

# Template para estratégia de follow-up
FOLLOW_UP_STRATEGY_TEMPLATE = """
# Estratégia de Follow-up: {contact_name}

## Informações do Contato
- Nome: {contact_name}
- Email: {contact_email}
- Telefone: {contact_phone}
- Empresa: {company_name}
- Cargo: {contact_position}

## Status do Relacionamento
- Último contato: {last_contact_date}
- Tipo de interação: {last_interaction_type}
- Resposta: {last_response}

## Contexto do Negócio
- Oportunidade: {deal_title}
- Valor: R$ {deal_value}
- Etapa atual: {current_stage}
- Produto/Serviço: {product_service}

## Histórico de Comunicações
{communication_history}

## Perguntas para Estratégia
1. Qual é o momento ideal para o próximo contato?
2. Qual canal de comunicação seria mais efetivo?
3. Quais tópicos ou informações devem ser abordados?
4. Existe algum material ou recurso que deveria ser compartilhado?
5. Como personalizar a abordagem para aumentar as chances de resposta?

Use as informações acima para criar uma estratégia de follow-up personalizada e eficaz.
"""

def get_lead_analysis_prompt(contact_data: Dict[str, Any], interactions: List[Dict[str, Any]], deals: List[Dict[str, Any]]) -> str:
    """
    Gera um prompt para análise de lead com base nos dados de um contato.
    
    Args:
        contact_data (Dict[str, Any]): Dados do contato.
        interactions (List[Dict[str, Any]]): Lista de interações com o contato.
        deals (List[Dict[str, Any]]): Lista de oportunidades associadas ao contato.
        
    Returns:
        str: Prompt formatado para análise de lead.
    """
    # Formatar o histórico de interações
    interaction_history = "\n".join([
        f"- {interaction.get('date', 'N/A')} | {interaction.get('type', 'N/A')} | {interaction.get('description', 'N/A')}"
        for interaction in interactions
    ]) if interactions else "Nenhuma interação registrada."
    
    # Formatar informações de oportunidades
    deals_info = "\n".join([
        f"- {deal.get('title', 'N/A')} | R$ {deal.get('value', '0,00')} | {deal.get('stage_name', 'N/A')} | {deal.get('status', 'open')}"
        for deal in deals
    ]) if deals else "Nenhuma oportunidade associada."
    
    # Preencher o template
    return LEAD_ANALYSIS_TEMPLATE.format(
        contact_name=contact_data.get("name", "N/A"),
        contact_email=contact_data.get("email", "N/A"),
        contact_phone=contact_data.get("phone", "N/A"),
        company_name=contact_data.get("company_name", "N/A"),
        contact_position=contact_data.get("position", "N/A"),
        interaction_history=interaction_history,
        deals_info=deals_info
    )

def get_contact_activity_summary_prompt(
    contact_data: Dict[str, Any], 
    activities: List[Dict[str, Any]], 
    active_deals: List[Dict[str, Any]], 
    pending_tasks: List[Dict[str, Any]], 
    start_date: str, 
    end_date: str
) -> str:
    """
    Gera um prompt para resumo de atividades de um contato em um período específico.
    
    Args:
        contact_data (Dict[str, Any]): Dados do contato.
        activities (List[Dict[str, Any]]): Lista de atividades do contato no período.
        active_deals (List[Dict[str, Any]]): Lista de oportunidades ativas.
        pending_tasks (List[Dict[str, Any]]): Lista de tarefas pendentes.
        start_date (str): Data inicial do período (formato YYYY-MM-DD).
        end_date (str): Data final do período (formato YYYY-MM-DD).
        
    Returns:
        str: Prompt formatado para resumo de atividades.
    """
    # Formatar atividades
    activities_text = "\n".join([
        f"- {activity.get('date', 'N/A')} | {activity.get('type', 'N/A')} | {activity.get('description', 'N/A')}"
        for activity in activities
    ]) if activities else "Nenhuma atividade registrada no período."
    
    # Formatar oportunidades ativas
    active_deals_text = "\n".join([
        f"- {deal.get('title', 'N/A')} | R$ {deal.get('value', '0,00')} | {deal.get('stage_name', 'N/A')} | Última atualização: {deal.get('updated_at', 'N/A')}"
        for deal in active_deals
    ]) if active_deals else "Nenhuma oportunidade ativa."
    
    # Formatar tarefas pendentes
    pending_tasks_text = "\n".join([
        f"- {task.get('title', 'N/A')} | Prazo: {task.get('due_date', 'N/A')} | Prioridade: {task.get('priority', 'N/A')}"
        for task in pending_tasks
    ]) if pending_tasks else "Nenhuma tarefa pendente."
    
    # Preencher o template
    return CONTACT_ACTIVITY_SUMMARY_TEMPLATE.format(
        contact_name=contact_data.get("name", "N/A"),
        contact_email=contact_data.get("email", "N/A"),
        contact_phone=contact_data.get("phone", "N/A"),
        company_name=contact_data.get("company_name", "N/A"),
        start_date=start_date,
        end_date=end_date,
        activities=activities_text,
        active_deals=active_deals_text,
        pending_tasks=pending_tasks_text
    )

def get_sales_performance_prompt(
    sales_data: Dict[str, Any],
    pipeline_data: List[Dict[str, Any]],
    sales_rep_data: List[Dict[str, Any]],
    product_data: List[Dict[str, Any]],
    start_date: str,
    end_date: str
) -> str:
    """
    Gera um prompt para análise de performance de vendas.
    
    Args:
        sales_data (Dict[str, Any]): Dados gerais de vendas.
        pipeline_data (List[Dict[str, Any]]): Performance por funil.
        sales_rep_data (List[Dict[str, Any]]): Performance por vendedor.
        product_data (List[Dict[str, Any]]): Performance por produto.
        start_date (str): Data inicial do período (formato YYYY-MM-DD).
        end_date (str): Data final do período (formato YYYY-MM-DD).
        
    Returns:
        str: Prompt formatado para análise de performance de vendas.
    """
    # Formatar performance por funil
    pipeline_performance = "\n".join([
        f"- {pipeline.get('name', 'N/A')} | Total: {pipeline.get('total_deals', 0)} negócios | R$ {pipeline.get('total_value', '0,00')} | Conversão: {pipeline.get('conversion_rate', '0')}%"
        for pipeline in pipeline_data
    ]) if pipeline_data else "Dados de funis não disponíveis."
    
    # Formatar performance por vendedor
    sales_rep_performance = "\n".join([
        f"- {rep.get('name', 'N/A')} | Total: {rep.get('total_deals', 0)} negócios | R$ {rep.get('total_value', '0,00')} | Conversão: {rep.get('conversion_rate', '0')}%"
        for rep in sales_rep_data
    ]) if sales_rep_data else "Dados de vendedores não disponíveis."
    
    # Formatar performance por produto
    top_products = "\n".join([
        f"- {product.get('name', 'N/A')} | Total: {product.get('total_deals', 0)} negócios | R$ {product.get('total_value', '0,00')} | Participação: {product.get('share', '0')}%"
        for product in product_data
    ]) if product_data else "Dados de produtos não disponíveis."
    
    # Preencher o template
    return SALES_PERFORMANCE_TEMPLATE.format(
        start_date=start_date,
        end_date=end_date,
        total_deals=sales_data.get("total_deals", 0),
        total_value=sales_data.get("total_value", "0,00"),
        won_deals=sales_data.get("won_deals", 0),
        conversion_rate=sales_data.get("conversion_rate", "0"),
        pipeline_performance=pipeline_performance,
        sales_rep_performance=sales_rep_performance,
        top_products=top_products
    )

def get_pipeline_analysis_prompt(
    pipeline_data: Dict[str, Any],
    stage_data: List[Dict[str, Any]],
    timing_data: List[Dict[str, Any]],
    loss_reasons_data: List[Dict[str, Any]],
    start_date: str,
    end_date: str
) -> str:
    """
    Gera um prompt para análise detalhada de um funil de vendas.
    
    Args:
        pipeline_data (Dict[str, Any]): Dados gerais do funil.
        stage_data (List[Dict[str, Any]]): Dados de cada etapa do funil.
        timing_data (List[Dict[str, Any]]): Dados de tempo médio por etapa.
        loss_reasons_data (List[Dict[str, Any]]): Razões de perda de negócios.
        start_date (str): Data inicial do período (formato YYYY-MM-DD).
        end_date (str): Data final do período (formato YYYY-MM-DD).
        
    Returns:
        str: Prompt formatado para análise de funil.
    """
    # Formatar análise por etapa
    stage_analysis = "\n".join([
        f"- {stage.get('name', 'N/A')} | {stage.get('count', 0)} negócios | R$ {stage.get('value', '0,00')} | Conversão para próxima etapa: {stage.get('conversion_rate', '0')}%"
        for stage in stage_data
    ]) if stage_data else "Dados de etapas não disponíveis."
    
    # Formatar tempo médio por etapa
    stage_timing = "\n".join([
        f"- {timing.get('name', 'N/A')} | Tempo médio: {timing.get('avg_days', '0')} dias | Mínimo: {timing.get('min_days', '0')} dias | Máximo: {timing.get('max_days', '0')} dias"
        for timing in timing_data
    ]) if timing_data else "Dados de tempo por etapa não disponíveis."
    
    # Formatar razões de perda
    loss_reasons = "\n".join([
        f"- {reason.get('reason', 'N/A')} | {reason.get('count', 0)} negócios | R$ {reason.get('value', '0,00')} | {reason.get('percentage', '0')}% do total perdido"
        for reason in loss_reasons_data
    ]) if loss_reasons_data else "Dados de razões de perda não disponíveis."
    
    # Preencher o template
    return PIPELINE_ANALYSIS_TEMPLATE.format(
        pipeline_name=pipeline_data.get("name", "N/A"),
        start_date=start_date,
        end_date=end_date,
        total_deals=pipeline_data.get("total_deals", 0),
        total_value=pipeline_data.get("total_value", "0,00"),
        average_value=pipeline_data.get("average_value", "0,00"),
        won_deals=pipeline_data.get("won_deals", 0),
        lost_deals=pipeline_data.get("lost_deals", 0),
        conversion_rate=pipeline_data.get("conversion_rate", "0"),
        stage_analysis=stage_analysis,
        stage_timing=stage_timing,
        loss_reasons=loss_reasons
    )

def get_follow_up_strategy_prompt(
    contact_data: Dict[str, Any],
    deal_data: Dict[str, Any],
    communication_history: List[Dict[str, Any]]
) -> str:
    """
    Gera um prompt para criação de estratégia de follow-up personalizada.
    
    Args:
        contact_data (Dict[str, Any]): Dados do contato.
        deal_data (Dict[str, Any]): Dados da oportunidade.
        communication_history (List[Dict[str, Any]]): Histórico de comunicações.
        
    Returns:
        str: Prompt formatado para estratégia de follow-up.
    """
    # Formatar histórico de comunicações
    comm_history = "\n".join([
        f"- {comm.get('date', 'N/A')} | {comm.get('channel', 'N/A')} | {comm.get('direction', 'N/A')} | {comm.get('summary', 'N/A')}"
        for comm in communication_history
    ]) if communication_history else "Nenhum histórico de comunicação disponível."
    
    # Obter dados da última interação
    last_interaction = communication_history[0] if communication_history else {"date": "N/A", "type": "N/A", "response": "N/A"}
    
    # Preencher o template
    return FOLLOW_UP_STRATEGY_TEMPLATE.format(
        contact_name=contact_data.get("name", "N/A"),
        contact_email=contact_data.get("email", "N/A"),
        contact_phone=contact_data.get("phone", "N/A"),
        company_name=contact_data.get("company_name", "N/A"),
        contact_position=contact_data.get("position", "N/A"),
        last_contact_date=last_interaction.get("date", "N/A"),
        last_interaction_type=last_interaction.get("channel", "N/A"),
        last_response=last_interaction.get("response", "N/A"),
        deal_title=deal_data.get("title", "N/A"),
        deal_value=deal_data.get("value", "0,00"),
        current_stage=deal_data.get("stage_name", "N/A"),
        product_service=deal_data.get("product", "N/A"),
        communication_history=comm_history
    )
