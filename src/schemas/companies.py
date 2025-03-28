"""
Schemas para empresas na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de empresas.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl


class CompanyCreate(BaseModel):
    """
    Modelo para criação de empresas no PipeRun.
    """
    name: str = Field(..., description="Nome da empresa")
    address: Optional[str] = Field(None, description="Endereço da empresa")
    city_id: Optional[int] = Field(None, description="ID da cidade")
    phone: Optional[str] = Field(None, description="Telefone da empresa")
    email: Optional[str] = Field(None, description="Email da empresa")
    website: Optional[str] = Field(None, description="Website da empresa")
    cnpj: Optional[str] = Field(None, description="CNPJ da empresa")
    category_id: Optional[int] = Field(None, description="ID da categoria")
    responsable_id: Optional[int] = Field(None, description="ID do responsável")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class CompanyUpdate(BaseModel):
    """
    Modelo para atualização de empresas no PipeRun.
    """
    name: Optional[str] = Field(None, description="Nome da empresa")
    address: Optional[str] = Field(None, description="Endereço da empresa")
    city_id: Optional[int] = Field(None, description="ID da cidade")
    phone: Optional[str] = Field(None, description="Telefone da empresa")
    email: Optional[str] = Field(None, description="Email da empresa")
    website: Optional[str] = Field(None, description="Website da empresa")
    cnpj: Optional[str] = Field(None, description="CNPJ da empresa")
    category_id: Optional[int] = Field(None, description="ID da categoria")
    responsable_id: Optional[int] = Field(None, description="ID do responsável")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class Company(BaseModel):
    """
    Modelo completo de empresa no PipeRun.
    """
    id: int = Field(..., description="ID da empresa")
    name: str = Field(..., description="Nome da empresa")
    address: Optional[str] = Field(None, description="Endereço da empresa")
    city_id: Optional[int] = Field(None, description="ID da cidade")
    city_name: Optional[str] = Field(None, description="Nome da cidade")
    phone: Optional[str] = Field(None, description="Telefone da empresa")
    email: Optional[str] = Field(None, description="Email da empresa")
    website: Optional[str] = Field(None, description="Website da empresa")
    cnpj: Optional[str] = Field(None, description="CNPJ da empresa")
    category_id: Optional[int] = Field(None, description="ID da categoria")
    category_name: Optional[str] = Field(None, description="Nome da categoria")
    responsable_id: Optional[int] = Field(None, description="ID do responsável")
    responsable_name: Optional[str] = Field(None, description="Nome do responsável")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class CompanyResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de empresa.
    """
    data: Optional[Company] = Field(None, description="Dados da empresa")
    items: Optional[List[Company]] = Field(None, description="Lista de empresas")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
