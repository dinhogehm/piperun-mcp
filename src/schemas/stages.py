"""
Schemas para etapas de funis (stages) na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de etapas de funis.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class StageCreate(BaseModel):
    """
    Modelo para criação de etapas de funis no PipeRun.
    """
    name: str = Field(..., description="Nome da etapa")
    pipeline_id: int = Field(..., description="ID do funil ao qual a etapa pertence")
    order: Optional[int] = Field(None, description="Ordem da etapa no funil")
    color: Optional[str] = Field(None, description="Cor da etapa no formato hexadecimal (ex: #FF0000)")
    status: Optional[str] = Field(None, description="Status da etapa (open, win, lost)")
    probability: Optional[int] = Field(None, description="Probabilidade de fechamento (0-100)")


class StageUpdate(BaseModel):
    """
    Modelo para atualização de etapas de funis no PipeRun.
    """
    name: Optional[str] = Field(None, description="Nome da etapa")
    order: Optional[int] = Field(None, description="Ordem da etapa no funil")
    color: Optional[str] = Field(None, description="Cor da etapa no formato hexadecimal (ex: #FF0000)")
    status: Optional[str] = Field(None, description="Status da etapa (open, win, lost)")
    probability: Optional[int] = Field(None, description="Probabilidade de fechamento (0-100)")
    active: Optional[bool] = Field(None, description="Status de ativação da etapa")


class Stage(BaseModel):
    """
    Modelo completo de etapa de funil no PipeRun.
    """
    id: int = Field(..., description="ID da etapa")
    name: str = Field(..., description="Nome da etapa")
    pipeline_id: int = Field(..., description="ID do funil")
    pipeline_name: Optional[str] = Field(None, description="Nome do funil")
    order: Optional[int] = Field(None, description="Ordem da etapa no funil")
    color: Optional[str] = Field(None, description="Cor da etapa")
    status: Optional[str] = Field(None, description="Status da etapa (open, win, lost)")
    probability: Optional[int] = Field(None, description="Probabilidade de fechamento (0-100)")
    active: bool = Field(..., description="Status de ativação da etapa")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")


class StageResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de etapa de funil.
    """
    data: Optional[Stage] = Field(None, description="Dados da etapa")
    items: Optional[List[Stage]] = Field(None, description="Lista de etapas")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
