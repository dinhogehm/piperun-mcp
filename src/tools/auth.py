"""
Ferramentas de autenticação para a API do PipeRun.
Este módulo implementa as funções relacionadas à autenticação na API do PipeRun.
"""
from typing import Dict, Any, Optional

from ..schemas.auth import AuthCredentials, TokenResponse
from ..service.api_client import PipeRunApiClient


def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    """
    Ferramenta para autenticar um usuário no PipeRun.
    
    Args:
        email (str): Email do usuário.
        password (str): Senha do usuário.
        
    Returns:
        Dict[str, Any]: Resposta com o token de API e informações do usuário.
    """
    credentials = AuthCredentials(email=email, password=password)
    
    # Cliente sem token (autenticação não requer token)
    client = PipeRunApiClient(api_token="")
    
    response = client.post("auth/login", data={
        "email": credentials.email,
        "password": credentials.password
    })
    
    return {
        "token": response.get("token", ""),
        "user_id": response.get("user_id"),
        "expires_at": response.get("expires_at"),
        "success": True if response.get("token") else False,
        "message": "Autenticação realizada com sucesso" if response.get("token") else "Falha na autenticação"
    }


def get_api_token(api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para verificar um token de API do PipeRun.
    
    Args:
        api_token (Optional[str]): Token de API para verificar.
                                  Se não fornecido, será usado o token configurado.
    
    Returns:
        Dict[str, Any]: Resposta com informações sobre o token.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get("auth/token")
        return {
            "valid": True,
            "token": response.get("token"),
            "user_id": response.get("user_id"),
            "message": "Token válido"
        }
    except ValueError as e:
        return {
            "valid": False,
            "message": str(e)
        }


def revoke_api_token(api_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Ferramenta para revogar um token de API do PipeRun.
    Ao revogar um token, um novo token será gerado automaticamente.
    
    Args:
        api_token (Optional[str]): Token de API para revogar.
                                  Se não fornecido, será usado o token configurado.
    
    Returns:
        Dict[str, Any]: Resposta da operação de revogação.
    """
    client = PipeRunApiClient(api_token=api_token)
    
    try:
        response = client.get("auth/token/revoke")
        return {
            "success": True,
            "message": "Token revogado com sucesso. Um novo token foi gerado.",
            "new_token": response.get("token")
        }
    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }
