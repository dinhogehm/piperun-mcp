"""
Schemas para negócios (deals) na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de negócios.
"""
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, condecimal
from decimal import Decimal


class DealCreate(BaseModel):
    """
    Modelo para criação de negócios no PipeRun.
    """
    title: str = Field(..., description="Título do negócio")
    pipeline_id: int = Field(..., description="ID do funil")
    stage_id: int = Field(..., description="ID da etapa")
    company_id: Optional[int] = Field(None, description="ID da empresa")
    contact_id: Optional[int] = Field(None, description="ID do contato")
    user_id: Optional[int] = Field(None, description="ID do usuário responsável")
    value: Optional[Union[float, Decimal]] = Field(None, description="Valor do negócio")
    expected_close_date: Optional[str] = Field(None, description="Data esperada de fechamento (YYYY-MM-DD)")
    notes: Optional[str] = Field(None, description="Observações sobre o negócio")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class DealUpdate(BaseModel):
    """
    Modelo para atualização de negócios no PipeRun.
    """
    title: Optional[str] = Field(None, description="Título do negócio")
    pipeline_id: Optional[int] = Field(None, description="ID do funil")
    stage_id: Optional[int] = Field(None, description="ID da etapa")
    company_id: Optional[int] = Field(None, description="ID da empresa")
    contact_id: Optional[int] = Field(None, description="ID do contato")
    user_id: Optional[int] = Field(None, description="ID do usuário responsável")
    value: Optional[Union[float, Decimal]] = Field(None, description="Valor do negócio")
    expected_close_date: Optional[str] = Field(None, description="Data esperada de fechamento (YYYY-MM-DD)")
    notes: Optional[str] = Field(None, description="Observações sobre o negócio")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class DealStageUpdate(BaseModel):
    """
    Modelo para atualização da etapa de um negócio.
    """
    stage_id: int = Field(..., description="ID da nova etapa")
    reason: Optional[str] = Field(None, description="Motivo da alteração de etapa")


class Deal(BaseModel):
    """
    Modelo completo de negócio no PipeRun.
    """
    id: int = Field(..., description="ID do negócio")
    title: str = Field(..., description="Título do negócio")
    pipeline_id: int = Field(..., description="ID do funil")
    pipeline_name: Optional[str] = Field(None, description="Nome do funil")
    stage_id: int = Field(..., description="ID da etapa")
    stage_name: Optional[str] = Field(None, description="Nome da etapa")
    company_id: Optional[int] = Field(None, description="ID da empresa")
    company_name: Optional[str] = Field(None, description="Nome da empresa")
    contact_id: Optional[int] = Field(None, description="ID do contato")
    contact_name: Optional[str] = Field(None, description="Nome do contato")
    user_id: Optional[int] = Field(None, description="ID do usuário responsável")
    user_name: Optional[str] = Field(None, description="Nome do usuário responsável")
    value: Optional[Decimal] = Field(None, description="Valor do negócio")
    expected_close_date: Optional[str] = Field(None, description="Data esperada de fechamento")
    notes: Optional[str] = Field(None, description="Observações sobre o negócio")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")
    status: Optional[str] = Field(None, description="Status do negócio")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class DealResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de negócio.
    """
    data: Optional[Deal] = Field(None, description="Dados do negócio")
    items: Optional[List[Deal]] = Field(None, description="Lista de negócios")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
