"""
Exemplos de uso das ferramentas MCP para o PipeRun.
Este módulo contém exemplos práticos de como utilizar as ferramentas MCP com o PipeRun.
"""
import os
import json
from dotenv import load_dotenv

# Importa todas as ferramentas MCP disponíveis
from src.tools import (
    # Autenticação
    authenticate_user,
    get_api_token,
    revoke_api_token,
    
    # Empresas
    list_companies,
    get_company,
    create_company,
    
    # Contatos
    list_contacts,
    create_contact,
    
    # Oportunidades
    list_deals,
    create_deal,
    move_deal_stage,
    
    # Funis
    list_pipelines,
    
    # Etapas
    list_stages,
    
    # Tarefas
    create_task,
    complete_task
)


def print_json(data):
    """Imprime dados em formato JSON de forma legível."""
    print(json.dumps(data, indent=2, ensure_ascii=False))


def exemplo_autenticacao():
    """Exemplo de autenticação e gerenciamento de tokens."""
    print("\n=== Exemplo de Autenticação ===")
    
    # Obtém o token da variável de ambiente
    token_atual = os.getenv("PIPERUN_API_TOKEN")
    if token_atual:
        print(f"Token atual configurado: {token_atual[:10]}...")
        
        # Verifica a validade do token
        resultado = get_api_token()
        print(f"Token válido: {resultado.get('valid', False)}")
    else:
        print("Nenhum token encontrado nas variáveis de ambiente.")
        
        # Para autenticar com credenciais, use:
        # resultado = authenticate_user("seu_email@exemplo.com", "sua_senha")
        # print_json(resultado)


def exemplo_empresas():
    """Exemplo de operações com empresas."""
    print("\n=== Exemplo de Empresas ===")
    
    # Listar empresas
    resultado = list_companies(search="", per_page=5)
    if resultado.get("success"):
        empresas = resultado.get("items", [])
        print(f"Total de empresas encontradas: {len(empresas)}")
        
        if empresas:
            print("Primeiras empresas:")
            for empresa in empresas[:3]:
                print(f" - {empresa.get('id')}: {empresa.get('name')}")
            
            # Detalhes de uma empresa específica
            empresa_id = empresas[0].get("id")
            if empresa_id:
                print(f"\nDetalhes da empresa {empresa_id}:")
                detalhes = get_company(empresa_id)
                if detalhes.get("success"):
                    empresa_detalhada = detalhes.get("data", {})
                    print(f"Nome: {empresa_detalhada.get('name')}")
                    print(f"Email: {empresa_detalhada.get('email')}")
                    print(f"Telefone: {empresa_detalhada.get('phone')}")
    else:
        print(f"Erro ao listar empresas: {resultado.get('message')}")
    
    # Para criar uma nova empresa, use:
    # nova_empresa = create_company(
    #     name="Minha Nova Empresa",
    #     phone="(11) 99999-9999",
    #     email="contato@empresa.com"
    # )
    # print_json(nova_empresa)


def exemplo_contatos():
    """Exemplo de operações com contatos."""
    print("\n=== Exemplo de Contatos ===")
    
    # Listar contatos
    resultado = list_contacts(per_page=5)
    if resultado.get("success"):
        contatos = resultado.get("items", [])
        print(f"Total de contatos encontrados: {len(contatos)}")
        
        if contatos:
            print("Primeiros contatos:")
            for contato in contatos[:3]:
                print(f" - {contato.get('id')}: {contato.get('name')} ({contato.get('email')})")
    else:
        print(f"Erro ao listar contatos: {resultado.get('message')}")
    
    # Para criar um novo contato, use:
    # novo_contato = create_contact(
    #     name="João Silva",
    #     email="joao.silva@exemplo.com",
    #     phone="(11) 98888-8888",
    #     position="Gerente"
    # )
    # print_json(novo_contato)


def exemplo_oportunidades():
    """Exemplo de operações com oportunidades (deals)."""
    print("\n=== Exemplo de Oportunidades ===")
    
    # Listar oportunidades
    resultado = list_deals(per_page=5)
    if resultado.get("success"):
        oportunidades = resultado.get("items", [])
        print(f"Total de oportunidades encontradas: {len(oportunidades)}")
        
        if oportunidades:
            print("Primeiras oportunidades:")
            for oportunidade in oportunidades[:3]:
                print(f" - {oportunidade.get('id')}: {oportunidade.get('title')} (R$ {oportunidade.get('value')})")
    else:
        print(f"Erro ao listar oportunidades: {resultado.get('message')}")
    
    # Para criar uma nova oportunidade, você precisa dos IDs do funil e da etapa
    # Listar funis
    funis = list_pipelines()
    etapas = []
    
    if funis.get("success") and funis.get("items"):
        pipeline_id = funis.get("items")[0].get("id")
        print(f"\nFunil selecionado: {funis.get('items')[0].get('name')} (ID: {pipeline_id})")
        
        # Listar etapas do funil
        etapas_resultado = list_stages(pipeline_id=pipeline_id)
        if etapas_resultado.get("success") and etapas_resultado.get("items"):
            etapas = etapas_resultado.get("items")
            print("Etapas do funil:")
            for etapa in etapas[:3]:
                print(f" - {etapa.get('id')}: {etapa.get('name')}")
    
    # Para criar uma nova oportunidade, use:
    # if pipeline_id and etapas:
    #     nova_oportunidade = create_deal(
    #         title="Nova Oportunidade de Venda",
    #         pipeline_id=pipeline_id,
    #         stage_id=etapas[0].get("id"),
    #         value=5000.0,
    #         expected_close_date="2025-04-30"
    #     )
    #     print_json(nova_oportunidade)
    #
    #     # Para mover a oportunidade para outra etapa:
    #     if len(etapas) > 1 and nova_oportunidade.get("success"):
    #         mover = move_deal_stage(
    #             deal_id=nova_oportunidade.get("data", {}).get("id"),
    #             stage_id=etapas[1].get("id"),
    #             reason="Cliente demonstrou interesse no produto"
    #         )
    #         print_json(mover)


def exemplo_tarefas():
    """Exemplo de operações com tarefas."""
    print("\n=== Exemplo de Tarefas ===")
    
    # Para criar uma nova tarefa:
    # nova_tarefa = create_task(
    #     title="Ligar para o cliente",
    #     description="Agendar reunião para demonstração do produto",
    #     due_date="2025-04-15",
    #     due_time="14:30",
    #     priority="high"
    # )
    # print_json(nova_tarefa)
    #
    # # Para marcar uma tarefa como concluída:
    # if nova_tarefa.get("success"):
    #     tarefa_concluida = complete_task(nova_tarefa.get("data", {}).get("id"))
    #     print_json(tarefa_concluida)


def main():
    """Função principal que executa todos os exemplos."""
    # Carrega variáveis de ambiente do arquivo .env
    load_dotenv()
    
    print("==== Exemplos de uso das ferramentas MCP para o PipeRun ====")
    print("Nota: Alguns exemplos estão comentados para evitar alterações no CRM.")
    print("Descomente os trechos de código conforme necessário.")
    
    # Executa os exemplos
    exemplo_autenticacao()
    exemplo_empresas()
    exemplo_contatos()
    exemplo_oportunidades()
    exemplo_tarefas()
    
    print("\nExemplos concluídos!")


if __name__ == "__main__":
    main()
