#!/usr/bin/env python
"""
Script para executar os testes automatizados do PipeRun-MCP.
Este script facilita a execução de todos os testes ou testes específicos.
"""
import unittest
import sys
import os
import argparse

def setup_environment():
    """Configura o ambiente para os testes."""
    # Adicionar diretório raiz ao path para importações
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    # Configurar variáveis de ambiente para teste
    os.environ["ENVIRONMENT"] = "test"
    os.environ["TEST_MODE"] = "true"
    
    # Garantir que estamos usando o token de teste
    if "PIPERUN_API_TOKEN" not in os.environ:
        os.environ["PIPERUN_API_TOKEN"] = "test_token"

def run_tests(test_pattern=None):
    """
    Executa os testes automatizados.
    
    Args:
        test_pattern: Padrão para filtrar testes específicos
    
    Returns:
        bool: True se todos os testes passaram, False caso contrário
    """
    # Configurar ambiente
    setup_environment()
    
    # Descobrir testes
    loader = unittest.TestLoader()
    
    if test_pattern:
        # Executar testes específicos
        suite = loader.loadTestsFromName(test_pattern)
    else:
        # Executar todos os testes
        start_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests")
        suite = loader.discover(start_dir, pattern="test_*.py")
    
    # Configurar runner com saída detalhada
    runner = unittest.TextTestRunner(verbosity=2)
    
    # Executar testes
    result = runner.run(suite)
    
    # Retornar True se todos os testes passaram
    return result.wasSuccessful()

def parse_arguments():
    """Processa os argumentos da linha de comando."""
    parser = argparse.ArgumentParser(description="Executor de testes do PipeRun-MCP")
    
    parser.add_argument(
        "--test", 
        help="Padrão para executar testes específicos (ex: 'tests.test_diagnostics')"
    )
    
    parser.add_argument(
        "--ci", 
        action="store_true", 
        help="Modo CI/CD: definir código de saída com base no resultado"
    )
    
    return parser.parse_args()

if __name__ == "__main__":
    # Analisar argumentos
    args = parse_arguments()
    
    # Imprimir cabeçalho
    print("=" * 70)
    print("PipeRun-MCP: Executor de Testes Automatizados")
    print("=" * 70)
    
    if args.test:
        print(f"Executando testes específicos: {args.test}")
    else:
        print("Executando todos os testes")
    
    # Executar testes
    success = run_tests(args.test)
    
    # Imprimir resultado
    print("\n" + "=" * 70)
    if success:
        print("✅ Todos os testes passaram!")
    else:
        print("❌ Alguns testes falharam!")
    print("=" * 70)
    
    # Em modo CI, definir código de saída
    if args.ci and not success:
        sys.exit(1)
