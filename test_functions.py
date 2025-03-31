"""
Script para testar as funções de listagem refatoradas da API PipeRun
"""
import os
import logging
from pprint import pprint

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Importar as funções refatoradas
from src.tools.companies import list_companies
from src.tools.contacts import list_contacts
from src.tools.deals import list_deals
from src.tools.pipelines import list_pipelines
from src.tools.stages import list_stages
from src.tools.products import list_products

def test_list_companies():
    print("\n=== TESTANDO LIST_COMPANIES ===")
    result = list_companies(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} empresas")
        if result.get("items"):
            print("Primeira empresa:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_contacts():
    print("\n=== TESTANDO LIST_CONTACTS ===")
    result = list_contacts(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} contatos")
        if result.get("items"):
            print("Primeiro contato:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_deals():
    print("\n=== TESTANDO LIST_DEALS ===")
    result = list_deals(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} negócios")
        if result.get("items"):
            print("Primeiro negócio:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_pipelines():
    print("\n=== TESTANDO LIST_PIPELINES ===")
    result = list_pipelines(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} funis")
        if result.get("items"):
            print("Primeiro funil:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_stages():
    print("\n=== TESTANDO LIST_STAGES ===")
    result = list_stages(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} etapas")
        if result.get("items"):
            print("Primeira etapa:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_products():
    print("\n=== TESTANDO LIST_PRODUCTS ===")
    result = list_products(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontrados {len(result.get('items', []))} produtos")
        if result.get("items"):
            print("Primeiro produto:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

if __name__ == "__main__":
    print("Iniciando testes das funções de listagem...")
    
    # Testar cada função
    test_list_companies()
    test_list_contacts()
    test_list_deals()
    test_list_pipelines()
    test_list_stages()
    test_list_products()
    
    print("\nTestes concluídos!")
