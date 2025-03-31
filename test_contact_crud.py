"""
Script para testar as funções CRUD de contatos refatoradas da API PipeRun
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

# Importar as funções refatoradas de contatos
from src.tools.contacts import list_contacts, get_contact, create_contact, update_contact, delete_contact

# Importar a função para criar uma empresa (usaremos para associar o contato a uma empresa)
from src.tools.companies import create_company

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

def criar_empresa_para_teste():
    """
    Cria uma empresa para associar aos contatos durante os testes
    
    Returns:
        int: ID da empresa criada
    """
    # Gerar nome único para a empresa
    nome_empresa = f"Empresa Teste {uuid.uuid4().hex[:8]}"
    
    # Criar a empresa
    resultado = create_company(
        name=nome_empresa,
        cnpj=gerar_cnpj_valido(),
        address="Endereço de Teste, 123",
        phone="(11) 1234-5678",
        email=f"contato@{nome_empresa.lower().replace(' ', '')}.com.br"
    )
    
    if not resultado["success"]:
        logger.error(f"Falha ao criar empresa para teste: {resultado['message']}")
        raise Exception(f"Falha ao criar empresa para teste: {resultado['message']}")
    
    company_id = resultado["data"]["id"]
    logger.info(f"Empresa de teste criada com sucesso. ID: {company_id}")
    
    return company_id

def test_create_contact(company_id=None):
    """
    Testa a criação de um contato
    
    Args:
        company_id (int, optional): ID da empresa para associar ao contato
        
    Returns:
        int: ID do contato criado
    """
    logger.info("Testando a criação de contato...")
    
    # Gerar nome único para o contato
    nome_contato = f"Contato Teste {uuid.uuid4().hex[:8]}"
    email_contato = f"{nome_contato.lower().replace(' ', '.')}@example.com"
    
    # Criar o contato
    resultado = create_contact(
        name=nome_contato,
        email=email_contato,
        company_id=company_id,
        phone="(11) 9876-5432",
        mobile_phone="(11) 98765-4321",
        position="Gerente de Testes",
        notes="Contato criado para testes automatizados"
    )
    
    # Verificar se a criação foi bem-sucedida
    if resultado["success"]:
        contact_id = resultado["data"]["id"]
        logger.info(f"Contato criado com sucesso. ID: {contact_id}")
        pprint(resultado["data"])
        return contact_id
    else:
        logger.error(f"Falha ao criar contato: {resultado['message']}")
        if "error_details" in resultado:
            pprint(resultado["error_details"])
        raise Exception(f"Falha ao criar contato: {resultado['message']}")

def test_get_contact(contact_id):
    """
    Testa a obtenção de um contato específico
    
    Args:
        contact_id (int): ID do contato a ser consultado
    """
    logger.info(f"Testando a obtenção do contato {contact_id}...")
    
    resultado = get_contact(contact_id)
    
    if resultado["success"]:
        logger.info("Contato obtido com sucesso:")
        pprint(resultado["data"])
    else:
        logger.error(f"Falha ao obter contato: {resultado['message']}")
        raise Exception(f"Falha ao obter contato: {resultado['message']}")

def test_update_contact(contact_id):
    """
    Testa a atualização de um contato
    
    Args:
        contact_id (int): ID do contato a ser atualizado
    """
    logger.info(f"Testando a atualização do contato {contact_id}...")
    
    # Gerar dados de atualização
    novo_nome = f"Contato Atualizado {uuid.uuid4().hex[:8]}"
    nova_posicao = "Diretor de Testes"
    
    # Atualizar o contato
    resultado = update_contact(
        contact_id=contact_id,
        name=novo_nome,
        position=nova_posicao,
        notes="Contato atualizado durante teste automatizado"
    )
    
    if resultado["success"]:
        logger.info("Contato atualizado com sucesso:")
        pprint(resultado["data"])
    else:
        logger.error(f"Falha ao atualizar contato: {resultado['message']}")
        if "error_details" in resultado:
            pprint(resultado["error_details"])
        raise Exception(f"Falha ao atualizar contato: {resultado['message']}")

def test_list_contacts():
    """
    Testa a listagem de contatos
    """
    logger.info("Testando a listagem de contatos...")
    
    resultado = list_contacts(show=5)
    
    if resultado["success"]:
        logger.info(f"Listagem obtida com sucesso. Total de contatos: {len(resultado['data'])}")
        pprint(resultado["data"][:2])  # Mostrar apenas os 2 primeiros para não poluir o log
    else:
        logger.error(f"Falha ao listar contatos: {resultado['message']}")
        raise Exception(f"Falha ao listar contatos: {resultado['message']}")

def test_delete_contact(contact_id):
    """
    Testa a exclusão de um contato
    
    Args:
        contact_id (int): ID do contato a ser excluído
    """
    logger.info(f"Testando a exclusão do contato {contact_id}...")
    
    resultado = delete_contact(contact_id)
    
    if resultado["success"]:
        logger.info("Contato excluído com sucesso.")
    else:
        logger.error(f"Falha ao excluir contato: {resultado['message']}")
        raise Exception(f"Falha ao excluir contato: {resultado['message']}")

if __name__ == "__main__":
    print("Iniciando testes das funções CRUD de contatos...")
    
    try:
        # Criar uma empresa para associar aos contatos
        print("\n=== Criando empresa para testes ===")
        company_id = criar_empresa_para_teste()
        
        # Testar a criação de contato
        print("\n=== Testando CREATE ===")
        contact_id = test_create_contact(company_id)
        
        # Esperar um pouco para a API processar
        time.sleep(1)
        
        # Testar a obtenção de contato
        print("\n=== Testando READ (GET) ===")
        test_get_contact(contact_id)
        
        # Testar a atualização de contato
        print("\n=== Testando UPDATE ===")
        test_update_contact(contact_id)
        
        # Testar a listagem de contatos
        print("\n=== Testando READ (LIST) ===")
        test_list_contacts()
        
        # Testar a exclusão de contato
        print("\n=== Testando DELETE ===")
        test_delete_contact(contact_id)
        
        print("\nTodos os testes completados com sucesso!")
        
    except Exception as e:
        print(f"\nTeste falhou com erro: {e}")
