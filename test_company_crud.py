"""
Script para testar as funções CRUD de empresas refatoradas da API PipeRun
"""
import os
import logging
from pprint import pprint
import time
import uuid
import random

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Importar as funções refatoradas
from src.tools.companies import list_companies, get_company, create_company, update_company, delete_company

def gerar_cnpj_valido():
    """
    Gera um número de CNPJ válido usando o algoritmo padrão.
    
    Returns:
        str: CNPJ formatado válido (XX.XXX.XXX/XXXX-XX)
    """
    # Gera os 8 primeiros dígitos (base)
    digitos = [random.randint(0, 9) for _ in range(8)]
    
    # Adiciona os 4 dígitos da filial (geralmente 0001)
    digitos.extend([0, 0, 0, 1])
    
    # Calcula o primeiro dígito verificador
    multiplicadores_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(d * m for d, m in zip(digitos, multiplicadores_1))
    resto = soma % 11
    digito_1 = 0 if resto < 2 else 11 - resto
    digitos.append(digito_1)
    
    # Calcula o segundo dígito verificador
    multiplicadores_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(d * m for d, m in zip(digitos, multiplicadores_2))
    resto = soma % 11
    digito_2 = 0 if resto < 2 else 11 - resto
    digitos.append(digito_2)
    
    # Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
    cnpj = ''.join(str(d) for d in digitos)
    cnpj_formatado = f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"
    
    return cnpj_formatado

def test_create_company():
    print("\n=== TESTANDO CREATE_COMPANY ===")
    # Gerar nome único para evitar duplicação
    unique_id = str(uuid.uuid4())[:8]
    
    # Gerar um CNPJ válido
    cnpj = gerar_cnpj_valido()
    print(f"Tentando criar empresa com CNPJ válido: {cnpj}")
    
    result = create_company(
        name=f"Empresa Teste {unique_id}",
        phone="(11) 99999-9999",
        email=f"teste{unique_id}@teste.com",
        website="https://www.teste.com",
        cnpj=cnpj
    )
    
    if result.get("success"):
        print("Sucesso! Empresa criada.")
        print("Dados da empresa:")
        company_data = result.get("data", {})
        pprint(company_data)
        return company_data.get("id")
    else:
        print(f"Erro: {result.get('message')}")
        print("Vamos verificar os logs para obter mais detalhes sobre o erro...")
        # Importar função de logs para diagnóstico
        import logging
        logging.getLogger().setLevel(logging.DEBUG)
        return None

def test_get_company(company_id):
    print("\n=== TESTANDO GET_COMPANY ===")
    if not company_id:
        print("Não é possível obter a empresa sem um ID válido")
        return
    
    result = get_company(company_id)
    if result.get("success"):
        print("Sucesso! Detalhes da empresa:")
        pprint(result.get("data"))
    else:
        print(f"Erro: {result.get('message')}")

def test_update_company(company_id):
    print("\n=== TESTANDO UPDATE_COMPANY ===")
    if not company_id:
        print("Não é possível atualizar a empresa sem um ID válido")
        return
    
    result = update_company(
        company_id=company_id,
        name="Empresa Teste (Atualizada)",
        phone="(11) 88888-8888"
    )
    
    if result.get("success"):
        print("Sucesso! Empresa atualizada.")
        print("Dados atualizados:")
        pprint(result.get("data"))
    else:
        print(f"Erro: {result.get('message')}")

def test_list_companies():
    print("\n=== TESTANDO LIST_COMPANIES ===")
    result = list_companies(show=10)
    if result.get("success"):
        print(f"Sucesso! Encontradas {len(result.get('items', []))} empresas")
        if result.get("items"):
            print("Primeira empresa na lista:")
            pprint(result.get("items")[0])
        print("Paginação:")
        pprint(result.get("pagination"))
    else:
        print(f"Erro: {result.get('message')}")

def test_delete_company(company_id):
    print("\n=== TESTANDO DELETE_COMPANY ===")
    if not company_id:
        print("Não é possível excluir a empresa sem um ID válido")
        return
    
    result = delete_company(company_id)
    if result.get("success"):
        print(f"Sucesso! Empresa {company_id} excluída.")
    else:
        print(f"Erro: {result.get('message')}")

if __name__ == "__main__":
    print("Iniciando testes das funções CRUD de empresas...")
    
    # Criar uma empresa para testes
    company_id = test_create_company()
    
    if company_id:
        # Aguardar um momento para garantir que a criação foi processada
        time.sleep(2)
        
        # Obter detalhes da empresa criada
        test_get_company(company_id)
        
        # Atualizar a empresa
        time.sleep(2)
        test_update_company(company_id)
        
        # Listar empresas (deve incluir a recém-criada)
        time.sleep(2)
        test_list_companies()
        
        # Excluir a empresa de teste
        time.sleep(2)
        test_delete_company(company_id)
    
    print("\nTestes CRUD de empresas concluídos!")
