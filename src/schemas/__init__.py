"""
Pacote de schemas para validação de dados na interação com a API do PipeRun.
Este pacote contém todos os modelos Pydantic para validação de dados.
"""

from .auth import (
    AuthCredentials,
    TokenResponse
)

from .companies import (
    Company,
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse
)

from .contacts import (
    Contact,
    ContactCreate,
    ContactUpdate,
    ContactResponse
)

from .deals import (
    Deal,
    DealCreate,
    DealUpdate,
    DealResponse,
    DealStageUpdate
)

from .teams import (
    Team,
    TeamCreate,
    TeamUpdate,
    TeamResponse
)

from .pipelines import (
    Pipeline,
    PipelineCreate,
    PipelineUpdate,
    PipelineResponse
)

from .stages import (
    Stage,
    StageCreate,
    StageUpdate,
    StageResponse
)

from .tasks import (
    Task,
    TaskCreate,
    TaskUpdate,
    TaskResponse
)

# Lista de todas os schemas disponíveis
__all__ = [
    # Autenticação
    'AuthCredentials',
    'TokenResponse',
    
    # Empresas
    'Company',
    'CompanyCreate',
    'CompanyUpdate',
    'CompanyResponse',
    
    # Contatos
    'Contact',
    'ContactCreate',
    'ContactUpdate',
    'ContactResponse',
    
    # Oportunidades
    'Deal',
    'DealCreate',
    'DealUpdate',
    'DealResponse',
    'DealStageUpdate',
    
    # Equipes
    'Team',
    'TeamCreate',
    'TeamUpdate',
    'TeamResponse',
    
    # Funis
    'Pipeline',
    'PipelineCreate',
    'PipelineUpdate',
    'PipelineResponse',
    
    # Etapas de Funis
    'Stage',
    'StageCreate',
    'StageUpdate',
    'StageResponse',
    
    # Tarefas
    'Task',
    'TaskCreate',
    'TaskUpdate',
    'TaskResponse',
]
