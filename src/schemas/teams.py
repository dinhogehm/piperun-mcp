"""
Schemas para equipes na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de equipes.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TeamCreate(BaseModel):
    """
    Modelo para criação de equipes no PipeRun.
    """
    name: str = Field(..., description="Nome da equipe")
    description: Optional[str] = Field(None, description="Descrição da equipe")
    manager_id: Optional[int] = Field(None, description="ID do gestor da equipe")
    group_id: Optional[int] = Field(None, description="ID do grupo de equipe")


class TeamUpdate(BaseModel):
    """
    Modelo para atualização de equipes no PipeRun.
    """
    name: Optional[str] = Field(None, description="Nome da equipe")
    description: Optional[str] = Field(None, description="Descrição da equipe")
    manager_id: Optional[int] = Field(None, description="ID do gestor da equipe")
    group_id: Optional[int] = Field(None, description="ID do grupo de equipe")


class Team(BaseModel):
    """
    Modelo completo de equipe no PipeRun.
    """
    id: int = Field(..., description="ID da equipe")
    name: str = Field(..., description="Nome da equipe")
    description: Optional[str] = Field(None, description="Descrição da equipe")
    manager_id: Optional[int] = Field(None, description="ID do gestor da equipe")
    manager_name: Optional[str] = Field(None, description="Nome do gestor da equipe")
    group_id: Optional[int] = Field(None, description="ID do grupo de equipe")
    group_name: Optional[str] = Field(None, description="Nome do grupo de equipe")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")


class TeamResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de equipe.
    """
    data: Optional[Team] = Field(None, description="Dados da equipe")
    items: Optional[List[Team]] = Field(None, description="Lista de equipes")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
