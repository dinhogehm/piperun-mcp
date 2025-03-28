"""
Schemas para autenticação na API do PipeRun.
Este módulo contém os modelos Pydantic para validação de dados de autenticação.
"""
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class AuthCredentials(BaseModel):
    """
    Modelo para credenciais de autenticação no PipeRun.
    """
    email: EmailStr = Field(..., description="Email do usuário")
    password: str = Field(..., description="Senha do usuário")


class TokenResponse(BaseModel):
    """
    Modelo para a resposta de token da API.
    """
    token: str = Field(..., description="Token de API")
    user_id: Optional[int] = Field(None, description="ID do usuário")
    expires_at: Optional[str] = Field(None, description="Data de expiração do token")
