"""
Schemas para contatos na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de contatos.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr


class ContactCreate(BaseModel):
    """
    Modelo para criação de contatos no PipeRun.
    """
    name: str = Field(..., description="Nome do contato")
    email: Optional[EmailStr] = Field(None, description="Email do contato")
    company_id: Optional[int] = Field(None, description="ID da empresa do contato")
    phone: Optional[str] = Field(None, description="Telefone do contato")
    mobile_phone: Optional[str] = Field(None, description="Celular do contato")
    position: Optional[str] = Field(None, description="Cargo do contato")
    notes: Optional[str] = Field(None, description="Observações sobre o contato")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class ContactUpdate(BaseModel):
    """
    Modelo para atualização de contatos no PipeRun.
    """
    name: Optional[str] = Field(None, description="Nome do contato")
    email: Optional[EmailStr] = Field(None, description="Email do contato")
    company_id: Optional[int] = Field(None, description="ID da empresa do contato")
    phone: Optional[str] = Field(None, description="Telefone do contato")
    mobile_phone: Optional[str] = Field(None, description="Celular do contato")
    position: Optional[str] = Field(None, description="Cargo do contato")
    notes: Optional[str] = Field(None, description="Observações sobre o contato")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class Contact(BaseModel):
    """
    Modelo completo de contato no PipeRun.
    """
    id: int = Field(..., description="ID do contato")
    name: str = Field(..., description="Nome do contato")
    email: Optional[EmailStr] = Field(None, description="Email do contato")
    company_id: Optional[int] = Field(None, description="ID da empresa do contato")
    company_name: Optional[str] = Field(None, description="Nome da empresa do contato")
    phone: Optional[str] = Field(None, description="Telefone do contato")
    mobile_phone: Optional[str] = Field(None, description="Celular do contato")
    position: Optional[str] = Field(None, description="Cargo do contato")
    notes: Optional[str] = Field(None, description="Observações sobre o contato")
    created_at: str = Field(..., description="Data de criação")
    updated_at: Optional[str] = Field(None, description="Data de atualização")
    custom_fields: Optional[Dict[str, Any]] = Field(None, description="Campos customizados")


class ContactResponse(BaseModel):
    """
    Modelo para a resposta da API com dados de contato.
    """
    data: Optional[Contact] = Field(None, description="Dados do contato")
    items: Optional[List[Contact]] = Field(None, description="Lista de contatos")
    success: bool = Field(..., description="Status da operação")
    message: Optional[str] = Field(None, description="Mensagem da API")
