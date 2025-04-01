#!/usr/bin/env python

"""
Script para buscar vendedores que realizaram vendas no mês atual.
"""

import json
import requests
import os
from datetime import datetime
from dotenv import load_dotenv
from typing import Dict, Any, List

# Carrega variáveis de ambiente
load_dotenv()

# Configurações
BASE_URL = "http://localhost:8001"
API_TOKEN = os.getenv("PIPERUN_API_TOKEN")
CURRENT_MONTH = datetime.now().strftime("%Y-%m")

def get_won_deals_this_month():
    """Busca negócios ganhos no mês atual."""
    url = f"{BASE_URL}/tools/list_deals"
    params = {
        "status": "won",
        "order_by": "won_date",
        "order_type": "desc"
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            
            # Verifica se a resposta contém items
            if data.get("success"):
                deals = data.get("items", [])
                
                # Filtra negócios ganhos no mês atual
                this_month_deals = []
                for deal in deals:
                    won_date = deal.get("won_date")
                    if won_date and won_date.startswith(CURRENT_MONTH):
                        this_month_deals.append(deal)
                
                return this_month_deals
            else:
                print(f"Erro ao buscar negócios: {data.get('message')}")
                return []
    except Exception as e:
        print(f"Erro na requisição: {str(e)}")
        return []

def get_sellers_with_won_deals(deals):
    """Retorna lista de vendedores com negócios ganhos no mês atual."""
    sellers = {}
    
    for deal in deals:
        user_id = deal.get("user_id")
        user_name = deal.get("user", {}).get("name") or "Desconhecido"
        deal_value = float(deal.get("value") or 0)
        deal_title = deal.get("title")
        
        if user_id not in sellers:
            sellers[user_id] = {
                "name": user_name,
                "total_value": 0,
                "deal_count": 0,
                "deals": []
            }
        
        sellers[user_id]["total_value"] += deal_value
        sellers[user_id]["deal_count"] += 1
        sellers[user_id]["deals"].append({
            "title": deal_title,
            "value": deal_value,
            "won_date": deal.get("won_date")
        })
    
    # Converte para lista e ordena por valor total
    sellers_list = [v for k, v in sellers.items()]
    sellers_list.sort(key=lambda x: x["total_value"], reverse=True)
    
    return sellers_list

def format_currency(value):
    """Formata valor como moeda."""
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

def main():
    print(f"\n=== Vendedores com negócios ganhos em {CURRENT_MONTH} ===\n")
    
    won_deals = get_won_deals_this_month()
    
    if not won_deals:
        print("Nenhum negócio ganho encontrado para o mês atual.")
        return
    
    print(f"Total de negócios ganhos: {len(won_deals)}")
    
    sellers = get_sellers_with_won_deals(won_deals)
    
    if not sellers:
        print("Nenhum vendedor encontrado.")
        return
    
    print(f"\nTop vendedores do mês:")
    for i, seller in enumerate(sellers):
        print(f"\n{i+1}. {seller['name']}")
        print(f"   Negócios fechados: {seller['deal_count']}")
        print(f"   Valor total: {format_currency(seller['total_value'])}")
        
        print("   Negócios:")
        for deal in seller['deals']:
            print(f"    - {deal['title']} ({format_currency(deal['value'])}), fechado em {deal['won_date']}")

if __name__ == "__main__":
    main()
