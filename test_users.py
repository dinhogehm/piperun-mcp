"""
Script para testar as funcionalidades de gerenciamento de usuários no PipeRun MCP.
"""
import json
import requests
import os
from dotenv import load_dotenv
from typing import Dict, Any

# Carrega variáveis de ambiente
load_dotenv()

# Configurações
BASE_URL = "http://localhost:8001"
API_TOKEN = os.getenv("PIPERUN_API_TOKEN")

def display_user_info(user: Dict[str, Any]) -> None:
    """Exibe informações de um usuário."""
    print(f"ID: {user.get('id')}")
    print(f"Nome: {user.get('name')}")
    print(f"Email: {user.get('email')}")
    print(f"Status: {'Ativo' if user.get('active') in [1, True] else 'Inativo'}")
    print(f"Permissão: {user.get('permission')}")
    print(f"Criado em: {user.get('created_at')}")
    print(f"Último login: {user.get('last_login_at')}")

def test_user_endpoints():
    """Testa os endpoints relacionados a usuários."""
    print("\n=== Testando endpoints de usuários ===\n")
    
    # Testa contagem de usuários
    print("Testando contagem de usuários...")
    count_response = requests.get(f"{BASE_URL}/tools/count_users")
    print(f"Status: {count_response.status_code}")
    
    try:
        count_data = count_response.json()
        print(f"Sucesso: {count_data.get('success')}")
        print(f"Mensagem: {count_data.get('message')}")
        
        if count_data.get('success'):
            print(f"Total de usuários: {count_data.get('total_users')}")
            print(f"Usuários ativos: {count_data.get('active_users')}")
            print(f"Usuários inativos: {count_data.get('inactive_users')}")
            
            if count_data.get('note'):
                print(f"Nota: {count_data.get('note')}")
    except Exception as e:
        print(f"Erro ao processar resposta: {e}")
    
    print("-" * 50)
    
    # Testa listagem de usuários
    print("Testando listagem de usuários...")
    list_response = requests.get(f"{BASE_URL}/tools/list_users?per_page=5")
    print(f"Status: {list_response.status_code}")
    
    try:
        users_data = list_response.json()
        print(f"Sucesso: {users_data.get('success')}")
        print(f"Mensagem: {users_data.get('message')}")
        
        if users_data.get('note'):
            print(f"Nota: {users_data.get('note')}")
        
        # Se não encontrou items na resposta direta, pode estar em uma estrutura data/items
        users = []
        
        if users_data.get("items"):
            users = users_data.get("items")
        elif users_data.get("data") and isinstance(users_data.get("data"), list):
            users = users_data.get("data")
        
        if users:
            print(f"\nNúmero de usuários na resposta: {len(users)}")
            
            # Exibir informações sobre a paginação
            pagination = None
            if users_data.get("pagination"):
                pagination = users_data.get("pagination")
            elif users_data.get("meta"):
                pagination = users_data.get("meta")
            
            if pagination:
                print("\nInformações de paginação:")
                print(f"Total de registros: {pagination.get('total', 'N/A')}")
                print(f"Página atual: {pagination.get('current_page', pagination.get('page', 'N/A'))}")
                print(f"Itens por página: {pagination.get('per_page', 'N/A')}")
                print(f"Total de páginas: {pagination.get('total_pages', 'N/A')}")
            
            # Lista apenas os primeiros 2 usuários para evitar saída excessiva
            print("\nPrimeiros 2 usuários (amostra):")
            for i, user in enumerate(users[:2]):
                print(f"\nUsuário #{i+1}:")
                # Mostra apenas os campos essenciais
                print(f"ID: {user.get('id')}")
                print(f"Nome: {user.get('name')}")
                print(f"Email: {user.get('email')}")
                print(f"Status: {'Ativo' if user.get('active') in [1, True] else 'Inativo'}")
                if i < len(users[:2]) - 1:
                    print("-" * 30)
        else:
            print("Nenhum usuário encontrado")
    except Exception as e:
        print(f"Erro ao processar resposta: {e}")
    
    print("-" * 50)
    
    # Testa obtenção do usuário atual
    print("Testando obtenção do usuário atual...")
    current_user_response = requests.get(f"{BASE_URL}/tools/get_current_user")
    print(f"Status: {current_user_response.status_code}")
    
    try:
        current_user_data = current_user_response.json()
        print(f"Sucesso: {current_user_data.get('success')}")
        print(f"Mensagem: {current_user_data.get('message')}")
        
        if current_user_data.get('note'):
            print(f"Nota: {current_user_data.get('note')}")
        
        # Mostra dados do usuário atual se houver
        user_data = current_user_data.get("data", {})
        if user_data:
            print("\nDados do usuário atual:")
            display_user_info(user_data)
        else:
            print("Dados do usuário atual não encontrados")
    except Exception as e:
        print(f"Erro ao processar resposta: {e}")
    
    print("\n=== Testes concluídos ===\n")

if __name__ == "__main__":
    test_user_endpoints()