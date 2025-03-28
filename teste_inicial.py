"""
Teste inicial para verificar a integração com a API do PipeRun.
Este script ajuda a confirmar se a configuração está correta e se a API está respondendo.
"""
import json
from dotenv import load_dotenv

# Importa as ferramentas que serão testadas
from src.tools import (
    list_companies,
    list_contacts,
    list_deals,
    list_pipelines,
)


def print_resultado(titulo, resultado):
    """Imprime um resultado de forma organizada."""
    print(f"\n=== {titulo} ===")
    if resultado.get("success"):
        print("✅ Sucesso!")
        if "items" in resultado:
            itens = resultado.get("items", [])
            print(f"Itens encontrados: {len(itens)}")
            
            # Mostra até 3 itens de exemplo
            if itens:
                print("\nExemplos:")
                for item in itens[:3]:
                    if "name" in item:
                        print(f" - {item.get('id')}: {item.get('name')}")
                    elif "title" in item:
                        print(f" - {item.get('id')}: {item.get('title')}")
    else:
        print("❌ Falha!")
        print(f"Mensagem: {resultado.get('message', 'Erro não especificado')}")


def main():
    """Função principal que executa os testes."""
    # Carrega as variáveis de ambiente do arquivo .env
    load_dotenv()
    
    print("🔍 Iniciando testes com a API do PipeRun...\n")
    
    # Teste direto com a listagem de empresas
    print("Testando acesso à API do PipeRun...")
    
    # Teste 1: Lista empresas
    resultado_empresas = list_companies(per_page=5)
    print_resultado("Listando empresas", resultado_empresas)
    
    if resultado_empresas.get("success"):
        # Se o teste de empresas funcionou, continua com os outros testes
        
        # Teste 2: Lista contatos
        print_resultado(
            "Listando contatos", 
            list_contacts(per_page=5)
        )
        
        # Teste 3: Lista oportunidades
        print_resultado(
            "Listando oportunidades", 
            list_deals(per_page=5)
        )
        
        # Teste 4: Lista funis
        print_resultado(
            "Listando funis", 
            list_pipelines()
        )
        
        print("\n✨ Testes concluídos! A integração está funcionando corretamente.")
    else:
        print("\n❌ Falha ao acessar a API do PipeRun.")
        print("Verifique se o token está correto e se a URL base da API está configurada corretamente.")
        print("Confira também se você tem permissão para acessar as informações da API.")


if __name__ == "__main__":
    main()
