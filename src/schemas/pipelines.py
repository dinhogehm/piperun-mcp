"""
Schemas para funis (pipelines) na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de funis.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PipelineCreate(BaseModel):
    """
    Modelo para criação de funis no PipeRun.
    """
    name: str = Field(..., description="Nome do funil")
    description: Optional[str] = Field(None, description="Descrição do funil")
    team_id: Optional[int] = Field(None, description="ID da equipe responsável pelo funil")


class PipelineUpdate(BaseModel):
    """
    Modelo para atualização de funis no PipeRun.
    """
    name: Optional[str] = Field(None, description="Nome do funil")
    description: Optional[str] = Field(None, description="Descrição do funil")
    team_id: Optional[int] = Field(None, description="ID da equipe responsável pelo funil")
    active: Optional[bool] = Field(None, description="Status de ativação do funil")


class Pipeline(BaseModel):
    """
    Modelo completo de funil no PipeRun.
    """
    id: int = Field(..., description="ID do funil")
    name: str = Field(..., description="Nome do funil")
    description: Optional[str] = Field(None, description="Descrição do funil")
    team_id: Optional[int] = Field(None, description="ID da equipe responsável pelo funil")
    team_name: Optional[str] = Field(None, description="Nome da equipe responsável pelo funil")
    active: bool = Field(..., description="Status de ativação do funil")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")
    total_stages: Optional[int] = Field(None, description="Total de etapas no funil")


class PipelineResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de funil.
    """
    data: Optional[Pipeline] = Field(None, description="Dados do funil")
    items: Optional[List[Pipeline]] = Field(None, description="Lista de funis")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
