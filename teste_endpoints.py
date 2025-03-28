"""
Teste específico para validar os endpoints da API do PipeRun.
Este script testa vários endpoints da API para verificar quais estão disponíveis e funcionando.
"""
import os
import json
import requests
from dotenv import load_dotenv
from datetime import datetime

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Configurações da API
API_TOKEN = os.getenv("PIPERUN_API_TOKEN")
BASE_URL = "https://api.pipe.run/v1"

# Lista de endpoints para testar
ENDPOINTS = [
    # Endpoints confirmados
    {"path": "companies", "description": "Empresas"},
    {"path": "persons", "description": "Pessoas/Contatos"},
    {"path": "deals", "description": "Negócios/Oportunidades"},
    {"path": "pipelines", "description": "Funis"},
    {"path": "stages", "description": "Etapas do funil"},
    {"path": "activities", "description": "Atividades/Tarefas"},
    {"path": "teams", "description": "Times"},
    {"path": "users", "description": "Usuários"},
    {"path": "tags", "description": "Tags"},
    {"path": "notes", "description": "Notas"},
    
    # Endpoints corrigidos
    {"path": "customFields", "description": "Campos Customizados"},
    {"path": "items", "description": "Produtos"},
    
    # Outros endpoints para testar
    {"path": "sources", "description": "Fontes"}
]

def test_endpoint(endpoint):
    """Testa um endpoint específico da API."""
    url = f"{BASE_URL}/{endpoint['path']}"
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": API_TOKEN
    }
    
    print(f"\nTestando endpoint: {endpoint['description']} ({endpoint['path']})")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            items_count = len(data.get("items", []))
            print(f"✅ Endpoint funcionando! Status: {response.status_code}")
            print(f"   Itens encontrados: {items_count}")
            if items_count > 0:
                print("   Primeiro item:")
                first_item = data["items"][0]
                if "name" in first_item:
                    print(f"   - ID: {first_item.get('id')}, Nome: {first_item.get('name')}")
                elif "title" in first_item:
                    print(f"   - ID: {first_item.get('id')}, Título: {first_item.get('title')}")
            
            return {
                "endpoint": endpoint['path'],
                "status": "success",
                "status_code": response.status_code,
                "items_count": items_count
            }
        else:
            print(f"❌ Falha! Status: {response.status_code}")
            print(f"   Mensagem: {response.text}")
            
            return {
                "endpoint": endpoint['path'],
                "status": "error",
                "status_code": response.status_code,
                "message": response.text
            }
    except Exception as e:
        print(f"❌ Erro ao acessar endpoint: {str(e)}")
        
        return {
            "endpoint": endpoint['path'],
            "status": "exception",
            "message": str(e)
        }

def main():
    """Função principal para testar todos os endpoints."""
    print("🔍 Iniciando testes de endpoints da API do PipeRun...\n")
    print(f"URL Base: {BASE_URL}")
    
    results = []
    
    for endpoint in ENDPOINTS:
        result = test_endpoint(endpoint)
        results.append(result)
    
    # Gera um relatório dos resultados
    working_endpoints = [r for r in results if r["status"] == "success"]
    failed_endpoints = [r for r in results if r["status"] != "success"]
    
    print("\n\n=== RELATÓRIO FINAL ===")
    print(f"Total de endpoints testados: {len(results)}")
    print(f"Endpoints funcionando: {len(working_endpoints)}")
    print(f"Endpoints com falha: {len(failed_endpoints)}")
    
    if working_endpoints:
        print("\nEndpoints funcionando:")
        for r in working_endpoints:
            print(f" - {r['endpoint']}")
    
    if failed_endpoints:
        print("\nEndpoints com falha:")
        for r in failed_endpoints:
            print(f" - {r['endpoint']} (Status: {r.get('status_code', 'Erro')})")
    
    # Salva os resultados em um arquivo para referência
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(f"endpoints_test_{timestamp}.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\nResultados detalhados salvos em endpoints_test_{timestamp}.json")

if __name__ == "__main__":
    main()
