#!/usr/bin/env python
"""
Script para obter informações sobre a última venda realizada.
"""
import os
import json
import requests
from dotenv import load_dotenv
from datetime import datetime

# Carrega variáveis de ambiente
load_dotenv()

# Configurações
BASE_URL = "http://localhost:8001"
API_TOKEN = os.getenv("PIPERUN_API_TOKEN")

def get_last_won_deal():
    """Busca o último negócio ganho."""
    print("Buscando último negócio ganho...")
    
    url = f"{BASE_URL}/tools/list_deals"
    params = {
        "status": "won",
        "order_by": "won_date",
        "order_type": "desc",
        "per_page": 1
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Status da resposta: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Sucesso: {data.get('success', False)}")
            
            if data.get("success") and data.get("items"):
                deals = data.get("items", [])
                if deals:
                    return deals[0]
            
        print("Nenhum negócio ganho encontrado.")
        return None
    except Exception as e:
        print(f"Erro na requisição: {str(e)}")
        return None

def format_currency(value):
    """Formata valor como moeda."""
    try:
        value = float(value)
        return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except (ValueError, TypeError):
        return "R$ 0,00"

def main():
    print("\n=== Informações sobre a última venda ===\n")
    
    deal = get_last_won_deal()
    
    if not deal:
        print("Não foi possível obter informações sobre a última venda.")
        return
    
    print("\nDetalhes da última venda:")
    print(f"Título: {deal.get('title', 'N/A')}")
    print(f"Valor: {format_currency(deal.get('value', 0))}")
    print(f"Data de ganho: {deal.get('won_date', 'N/A')}")
    print(f"Vendedor: {deal.get('user', {}).get('name', 'N/A')}")
    print(f"Empresa: {deal.get('company', {}).get('name', 'N/A')}")
    print(f"Funil: {deal.get('pipeline', {}).get('name', 'N/A')}")
    print(f"Etapa: {deal.get('stage', {}).get('name', 'N/A')}")

if __name__ == "__main__":
    main()