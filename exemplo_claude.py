"""
Exemplo de como usar a integração do PipeRun com o Claude.
Este script demonstra como utilizar as ferramentas do PipeRun MCP em um chatbot como o Claude.
"""
import os
import json
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Importa as ferramentas do PipeRun MCP
from src.tools import (
    list_companies,
    list_contacts,  # Nome correto para listar pessoas/contatos
    list_deals,
    list_pipelines,
    create_company,
    create_contact,
    create_deal
)

def formatar_resposta(resultado):
    """Formata um resultado para exibição ao usuário no Claude."""
    if resultado.get("success", False):
        if "items" in resultado:
            itens = resultado.get("items", [])
            resposta = f"✅ Encontrado(s) {len(itens)} item(ns).\n\n"
            
            if itens:
                resposta += "Exemplos:\n"
                for i, item in enumerate(itens[:3], 1):
                    if "name" in item:
                        resposta += f"{i}. **{item.get('name')}**\n"
                    elif "title" in item:
                        resposta += f"{i}. **{item.get('title')}**\n"
            
            return resposta
        elif "data" in resultado:
            data = resultado.get("data", {})
            resposta = f"✅ {resultado.get('message', 'Operação realizada com sucesso')}\n\n"
            
            if "name" in data:
                resposta += f"**Nome:** {data.get('name')}\n"
            elif "title" in data:
                resposta += f"**Título:** {data.get('title')}\n"
                
            if "id" in data:
                resposta += f"**ID:** {data.get('id')}\n"
                
            return resposta
        else:
            return f"✅ {resultado.get('message', 'Operação realizada com sucesso')}"
    else:
        return f"❌ Erro: {resultado.get('message', 'Ocorreu um erro na operação')}"

def processar_comando(comando, parametros=None):
    """
    Processa um comando do usuário e executa a ação correspondente.
    
    Args:
        comando (str): O comando a ser executado.
        parametros (dict): Os parâmetros para o comando.
        
    Returns:
        str: Resposta formatada para o usuário.
    """
    parametros = parametros or {}
    
    # Comandos para listar informações
    if comando == "listar_empresas":
        resultado = list_companies(**parametros)
        return formatar_resposta(resultado)
    
    elif comando == "listar_contatos":
        resultado = list_contacts(**parametros)  # Função correta para listar contatos
        return formatar_resposta(resultado)
    
    elif comando == "listar_oportunidades":
        resultado = list_deals(**parametros)
        return formatar_resposta(resultado)
    
    elif comando == "listar_funis":
        resultado = list_pipelines(**parametros)
        return formatar_resposta(resultado)
    
    # Comandos para criar informações
    elif comando == "criar_empresa":
        # Verifica se os parâmetros necessários foram fornecidos
        if "name" not in parametros:
            return "❌ Erro: O nome da empresa é obrigatório."
        
        resultado = create_company(**parametros)
        return formatar_resposta(resultado)
    
    elif comando == "criar_contato":
        # Verifica se os parâmetros necessários foram fornecidos
        if "name" not in parametros:
            return "❌ Erro: O nome do contato é obrigatório."
        
        resultado = create_contact(**parametros)
        return formatar_resposta(resultado)
    
    elif comando == "criar_oportunidade":
        # Verifica se os parâmetros necessários foram fornecidos
        if "title" not in parametros or "pipeline_id" not in parametros or "stage_id" not in parametros:
            return "❌ Erro: O título, ID do funil e ID da etapa são obrigatórios."
        
        resultado = create_deal(**parametros)
        return formatar_resposta(resultado)
    
    else:
        return f"❌ Comando '{comando}' não reconhecido."

def exemplo_uso():
    """Demonstra exemplos de uso do PipeRun MCP com o Claude."""
    print("🤖 Exemplos de uso do PipeRun MCP com o Claude")
    print("\nExemplo 1: Listar empresas")
    resposta = processar_comando("listar_empresas", {"per_page": 5})
    print(resposta)
    
    print("\nExemplo 2: Listar contatos")
    resposta = processar_comando("listar_contatos", {"per_page": 5})
    print(resposta)
    
    print("\nExemplo 3: Criar uma empresa")
    # Descomente as linhas abaixo para realmente criar uma empresa
    # resposta = processar_comando("criar_empresa", {
    #    "name": "Empresa Teste Claude",
    #    "email": "contato@empresateste.com",
    #    "phone": "11999999999"
    # })
    # print(resposta)
    
    print("\nComo usar no Claude:")
    print("""
Para usar no Claude, você pode fornecer instruções como estas:
    
1. Para listar empresas:
   "Liste as empresas cadastradas no PipeRun."
   
2. Para criar uma empresa:
   "Crie uma empresa chamada 'Empresa ABC' no PipeRun."
   
O Claude pode então chamar as funções apropriadas e formatar os resultados para você.
    """)

if __name__ == "__main__":
    exemplo_uso()
