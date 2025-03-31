"""
Testes para a interface REST de ferramentas.
Este módulo contém testes unitários para garantir o correto funcionamento da 
interface REST que expõe as ferramentas do PipeRun MCP.
"""
import unittest
from unittest.mock import patch, MagicMock
import json
import flask
from flask import Flask, Response

# Importação do módulo a ser testado
from src.tools_interface import tools_bp, mcp_bp, register_tools, run_tool

class TestToolsInterface(unittest.TestCase):
    """Classe de teste para a interface REST de ferramentas."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        # Criar uma aplicação Flask de teste
        self.app = Flask(__name__)
        self.app.register_blueprint(tools_bp)
        self.app.register_blueprint(mcp_bp)
        self.client = self.app.test_client()
        
        # Contexto da aplicação
        self.ctx = self.app.app_context()
        self.ctx.push()
    
    def tearDown(self):
        """Limpeza após os testes."""
        self.ctx.pop()
    
    def test_list_all_tools(self):
        """Testa a listagem de todas as ferramentas disponíveis."""
        # Fazer requisição para listar ferramentas
        response = self.client.get('/tools')
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 200)
        self.assertIn('tools', data)
        self.assertTrue(isinstance(data['tools'], list))
        self.assertGreater(len(data['tools']), 0)
        
        # Verificar estrutura das ferramentas
        for tool in data['tools']:
            self.assertIn('name', tool)
            self.assertIn('description', tool)
            self.assertIn('parameters', tool)
    
    @patch('src.tools_interface.list_companies')
    def test_execute_tool_success(self, mock_list_companies):
        """Testa a execução bem-sucedida de uma ferramenta."""
        # Configurar mock
        mock_list_companies.return_value = {
            'data': [
                {'id': 1, 'name': 'Empresa Teste'},
                {'id': 2, 'name': 'Outra Empresa'}
            ],
            'meta': {
                'pagination': {
                    'total': 2,
                    'count': 2,
                    'per_page': 10,
                    'current_page': 1,
                    'total_pages': 1
                }
            }
        }
        
        # Fazer requisição para executar a ferramenta
        response = self.client.post(
            '/tools/list_companies',
            json={'search': 'Teste', 'page': 1, 'show': 10}
        )
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 200)
        self.assertIn('result', data)
        self.assertIn('data', data['result'])
        self.assertIn('meta', data['result'])
        
        # Verificar que a função foi chamada com os parâmetros corretos
        mock_list_companies.assert_called_with(search='Teste', page=1, show=10)
    
    def test_execute_nonexistent_tool(self):
        """Testa a execução de uma ferramenta inexistente."""
        # Fazer requisição para executar uma ferramenta que não existe
        response = self.client.post('/tools/nonexistent_tool', json={})
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', data)
        self.assertEqual(data['error']['type'], 'tool_not_found')
    
    @patch('src.tools_interface.list_companies')
    def test_execute_tool_with_error(self, mock_list_companies):
        """Testa o tratamento de erros ao executar uma ferramenta."""
        # Configurar mock para lançar uma exceção
        mock_list_companies.side_effect = ValueError("Parâmetro inválido")
        
        # Fazer requisição para executar a ferramenta
        response = self.client.post('/tools/list_companies', json={})
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error']['type'], 'execution_error')
        self.assertEqual(data['error']['message'], 'Parâmetro inválido')
    
    def test_run_tool_function(self):
        """Testa a função auxiliar run_tool."""
        with patch('src.tools_interface.register_tools') as mock_register:
            # Configurar mock
            mock_tool = MagicMock(return_value={'status': 'success'})
            mock_register.return_value = {'test_tool': {'function': mock_tool}}
            
            # Executar a função
            result = run_tool('test_tool', param1='valor1')
            
            # Verificar resultado
            self.assertEqual(result, {'status': 'success'})
            mock_tool.assert_called_with(param1='valor1')
    
    def test_run_nonexistent_tool_function(self):
        """Testa a função auxiliar run_tool com uma ferramenta inexistente."""
        with patch('src.tools_interface.register_tools') as mock_register:
            # Configurar mock para retornar um dicionário vazio
            mock_register.return_value = {}
            
            # Executar a função e verificar se levanta a exceção correta
            with self.assertRaises(ValueError):
                run_tool('nonexistent_tool')
    
    def test_get_mcp_info(self):
        """Testa o endpoint para obter informações sobre o servidor MCP."""
        # Fazer requisição
        response = self.client.get('/mcp/info')
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 200)
        self.assertIn('mcp_version', data)
        self.assertIn('server', data)
        self.assertIn('capabilities', data)
        self.assertIn('tool_categories', data)
        
        # Verificar capacidades
        self.assertTrue(data['capabilities']['tools'])
    
    @patch('src.tools_interface.get_server_health')
    def test_health_check(self, mock_health):
        """Testa o endpoint de verificação de saúde do servidor."""
        # Configurar mock
        mock_health.return_value = {
            'status': 'healthy',
            'timestamp': '2025-03-31T00:00:00Z',
            'system': {
                'memory_usage_percent': 50,
                'disk_usage_percent': 40
            }
        }
        
        # Fazer requisição
        response = self.client.get('/mcp/health')
        data = json.loads(response.data)
        
        # Verificar resposta
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('system', data)
        
        # Testar com aviso
        mock_health.return_value = {
            'status': 'warning',
            'warnings': ['Uso de memória está acima de 90%'],
            'timestamp': '2025-03-31T00:00:00Z'
        }
        
        response = self.client.get('/mcp/health')
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)  # Ainda retorna 200 para warning
        self.assertEqual(data['status'], 'warning')
        self.assertIn('warnings', data)

if __name__ == '__main__':
    unittest.main()
