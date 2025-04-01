"""
Schemas para usuários no PipeRun.
Este módulo define os modelos de dados para interagir com a API de usuários do PipeRun.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class User(BaseModel):
    """Modelo de dados para um usuário no PipeRun."""
    id: Optional[int] = None
    name: str
    email: str
    active: Optional[bool] = True
    role: Optional[str] = None
    phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    avatar: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    status: Optional[bool] = True
    permissions: Optional[Dict[str, Any]] = None
    team_id: Optional[int] = None
    team_name: Optional[str] = None


class UserCreate(BaseModel):
    """Modelo de dados para criação de um usuário no PipeRun."""
    name: str
    email: str
    password: str
    role: Optional[str] = None
    phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    team_id: Optional[int] = None
    permissions: Optional[Dict[str, Any]] = None


class UserUpdate(BaseModel):
    """Modelo de dados para atualização de um usuário no PipeRun."""
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    team_id: Optional[int] = None
    status: Optional[bool] = None
    permissions: Optional[Dict[str, Any]] = None