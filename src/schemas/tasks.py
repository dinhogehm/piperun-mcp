"""
Schemas para tarefas na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de tarefas.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """
    Modelo para criação de tarefas no PipeRun.
    """
    title: str = Field(..., description="Título da tarefa")
    description: Optional[str] = Field(None, description="Descrição detalhada da tarefa")
    due_date: Optional[str] = Field(None, description="Data de vencimento (formato: YYYY-MM-DD)")
    due_time: Optional[str] = Field(None, description="Hora de vencimento (formato: HH:MM)")
    responsible_id: Optional[int] = Field(None, description="ID do usuário responsável")
    deal_id: Optional[int] = Field(None, description="ID do negócio relacionado")
    company_id: Optional[int] = Field(None, description="ID da empresa relacionada")
    contact_id: Optional[int] = Field(None, description="ID do contato relacionado")
    priority: Optional[str] = Field(None, description="Prioridade (low, medium, high)")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class TaskUpdate(BaseModel):
    """
    Modelo para atualização de tarefas no PipeRun.
    """
    title: Optional[str] = Field(None, description="Título da tarefa")
    description: Optional[str] = Field(None, description="Descrição detalhada da tarefa")
    due_date: Optional[str] = Field(None, description="Data de vencimento (formato: YYYY-MM-DD)")
    due_time: Optional[str] = Field(None, description="Hora de vencimento (formato: HH:MM)")
    responsible_id: Optional[int] = Field(None, description="ID do usuário responsável")
    deal_id: Optional[int] = Field(None, description="ID do negócio relacionado")
    company_id: Optional[int] = Field(None, description="ID da empresa relacionada")
    contact_id: Optional[int] = Field(None, description="ID do contato relacionado")
    priority: Optional[str] = Field(None, description="Prioridade (low, medium, high)")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class Task(BaseModel):
    """
    Modelo completo de tarefa no PipeRun.
    """
    id: int = Field(..., description="ID da tarefa")
    title: str = Field(..., description="Título da tarefa")
    description: Optional[str] = Field(None, description="Descrição detalhada da tarefa")
    due_date: Optional[str] = Field(None, description="Data de vencimento")
    due_time: Optional[str] = Field(None, description="Hora de vencimento")
    responsible_id: Optional[int] = Field(None, description="ID do usuário responsável")
    responsible_name: Optional[str] = Field(None, description="Nome do usuário responsável")
    deal_id: Optional[int] = Field(None, description="ID do negócio relacionado")
    deal_title: Optional[str] = Field(None, description="Título do negócio relacionado")
    company_id: Optional[int] = Field(None, description="ID da empresa relacionada")
    company_name: Optional[str] = Field(None, description="Nome da empresa relacionada")
    contact_id: Optional[int] = Field(None, description="ID do contato relacionado")
    contact_name: Optional[str] = Field(None, description="Nome do contato relacionado")
    priority: Optional[str] = Field(None, description="Prioridade (low, medium, high)")
    status: str = Field(..., description="Status da tarefa (open, done, canceled)")
    created_by: Optional[int] = Field(None, description="ID do usuário que criou a tarefa")
    created_by_name: Optional[str] = Field(None, description="Nome do usuário que criou a tarefa")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")
    completed_at: Optional[str] = Field(None, description="Data de conclusão")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class TaskResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de tarefa.
    """
    data: Optional[Task] = Field(None, description="Dados da tarefa")
    items: Optional[List[Task]] = Field(None, description="Lista de tarefas")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
