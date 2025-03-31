"""
Pacote de ferramentas para integração com o PipeRun.
Este pacote contém todas as ferramentas necessárias para interagir com a API do PipeRun.
"""

# Importações de autenticação
from .auth import (
    authenticate_user,
    get_api_token,
    revoke_api_token
)

# Importações de empresas
from .companies import (
    list_companies,
    get_company,
    create_company,
    update_company,
    delete_company
)

# Importações de contatos
from .contacts import (
    list_contacts,
    get_contact,
    create_contact,
    update_contact,
    delete_contact
)

# Importações de negócios/oportunidades
from .deals import (
    list_deals,
    get_deal,
    create_deal,
    update_deal,
    move_deal_stage,
    delete_deal
)

# Importações de funis
from .pipelines import (
    list_pipelines,
    get_pipeline,
    create_pipeline,
    update_pipeline,
    delete_pipeline
)

# Importações de estágios
from .stages import (
    list_stages,
    get_stage,
    create_stage,
    update_stage,
    delete_stage
)

# Importações de tarefas (usando o endpoint activities)
from .tasks import (
    list_tasks,
    get_task,
    create_task,
    update_task,
    complete_task,
    delete_task
)

# Importações de times
from .teams import (
    list_teams,
    get_team,
    create_team,
    update_team,
    delete_team
)

# Importações de campos customizados
from .custom_fields import (
    list_custom_fields,
    get_custom_field,
    create_custom_field,
    update_custom_field,
    delete_custom_field
)

# Importações de produtos
from .products import (
    list_products,
    get_product,
    create_product,
    update_product,
    delete_product
)

# Importações de relatórios e estatísticas
from .reports import (
    export_companies_csv,
    export_contacts_csv,
    get_pipeline_statistics,
    generate_sales_summary
)

# Importações de diagnóstico do servidor MCP
from .diagnostics import (
    get_server_health,
    get_diagnostics,
    reset_metrics,
    check_api_connection,
    track_request,
    track_tool_execution,
    track_error
)

# Exportação de funções de utilidades
from .utils import format_date

# Lista de todas as ferramentas disponíveis para o MCP
__all__ = [
    # Autenticação
    'authenticate_user',
    'get_api_token',
    'revoke_api_token',
    
    # Empresas
    'list_companies',
    'get_company',
    'create_company',
    'update_company',
    'delete_company',
    
    # Contatos
    'list_contacts',
    'get_contact',
    'create_contact',
    'update_contact',
    'delete_contact',
    
    # Negócios/Oportunidades
    'list_deals',
    'get_deal',
    'create_deal',
    'update_deal',
    'move_deal_stage',
    'delete_deal',
    
    # Funis
    'list_pipelines',
    'get_pipeline',
    'create_pipeline',
    'update_pipeline',
    'delete_pipeline',
    
    # Etapas do funil
    'list_stages',
    'get_stage',
    'create_stage',
    'update_stage',
    'delete_stage',
    
    # Tarefas
    'list_tasks',
    'get_task',
    'create_task',
    'update_task',
    'complete_task',
    'delete_task',
    
    # Times
    'list_teams',
    'get_team',
    'create_team',
    'update_team',
    'delete_team',
    
    # Campos customizados
    'list_custom_fields',
    'get_custom_field',
    'create_custom_field',
    'update_custom_field',
    'delete_custom_field',
    
    # Produtos
    'list_products',
    'get_product',
    'create_product',
    'update_product',
    'delete_product',
    
    # Relatórios e estatísticas
    'export_companies_csv',
    'export_contacts_csv',
    'get_pipeline_statistics',
    'generate_sales_summary',
    
    # Diagnóstico do servidor MCP
    'get_server_health',
    'get_diagnostics',
    'reset_metrics',
    'check_api_connection',
    'track_request',
    'track_tool_execution',
    'track_error',
    
    # Funções de utilidades
    'format_date',
]
