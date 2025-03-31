"""
Testes para o módulo de diagnóstico.
Este módulo contém testes unitários para garantir o correto funcionamento das
ferramentas de diagnóstico do servidor MCP.
"""
import unittest
from unittest.mock import patch, MagicMock
import json
import time
from datetime import datetime

# Importação do módulo a ser testado
from src.tools.diagnostics import (
    get_server_health,
    get_diagnostics,
    reset_metrics,
    check_api_connection,
    track_request,
    track_tool_execution,
    track_error
)

class TestDiagnosticTools(unittest.TestCase):
    """Classe de teste para as ferramentas de diagnóstico."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        # Resetar métricas antes de cada teste
        reset_metrics()
    
    @patch("psutil.virtual_memory")
    @patch("psutil.disk_usage")
    @patch("psutil.cpu_count")
    def test_get_server_health(self, mock_cpu_count, mock_disk_usage, mock_memory):
        """Testa a função de verificação de saúde do servidor."""
        # Configurar mocks
        mock_memory.return_value = MagicMock(percent=50)
        mock_disk_usage.return_value = MagicMock(percent=60)
        mock_cpu_count.return_value = 4
        
        # Executar a função
        result = get_server_health()
        
        # Verificar o resultado
        self.assertEqual(result["status"], "healthy")
        self.assertIn("system", result)
        self.assertIn("environment", result)
        self.assertIn("timestamp", result)
        
        # Verificar detalhes do sistema
        self.assertEqual(result["system"]["cpu_cores"], 4)
        self.assertEqual(result["system"]["memory_usage_percent"], 50)
        self.assertEqual(result["system"]["disk_usage_percent"], 60)
    
    @patch("psutil.virtual_memory")
    @patch("psutil.disk_usage")
    def test_get_server_health_with_warnings(self, mock_disk_usage, mock_memory):
        """Testa a função de verificação de saúde com avisos."""
        # Configurar mocks para simular uso alto de recursos
        mock_memory.return_value = MagicMock(percent=95)
        mock_disk_usage.return_value = MagicMock(percent=92)
        
        # Executar a função
        result = get_server_health()
        
        # Verificar o resultado
        self.assertEqual(result["status"], "warning")
        self.assertIn("warnings", result)
        self.assertTrue(len(result["warnings"]) >= 2)  # Deve ter pelo menos 2 avisos
    
    def test_metrics_tracking(self):
        """Testa o rastreamento de métricas."""
        # Simular algumas requisições e execuções de ferramentas
        for _ in range(5):
            track_request()
        
        track_tool_execution("test_tool_1", 0.5)
        track_tool_execution("test_tool_1", 1.5)
        track_tool_execution("test_tool_2", 2.0)
        
        track_error("ValueError", "Teste de erro")
        
        # Obter diagnóstico
        result = get_diagnostics()
        
        # Verificar métricas registradas
        self.assertEqual(result["metrics"]["request_count"], 5)
        self.assertIn("test_tool_1", result["metrics"]["tool_executions"])
        self.assertIn("test_tool_2", result["metrics"]["tool_executions"])
        self.assertIn("ValueError", result["metrics"]["errors"])
        
        # Verificar estatísticas de execução
        tool1_stats = result["metrics"]["tool_executions"]["test_tool_1"]
        self.assertEqual(tool1_stats["count"], 2)
        self.assertAlmostEqual(tool1_stats["avg_time"], 1.0, places=1)
        self.assertEqual(tool1_stats["max_time"], 1.5)
    
    def test_reset_metrics(self):
        """Testa o reset de métricas."""
        # Registrar algumas métricas
        track_request()
        track_tool_execution("test_tool", 1.0)
        track_error("TestError", "Mensagem de teste")
        
        # Verificar que as métricas foram registradas
        diagnostics_before = get_diagnostics()
        self.assertEqual(diagnostics_before["metrics"]["request_count"], 1)
        
        # Resetar métricas
        result = reset_metrics()
        
        # Verificar resultado do reset
        self.assertEqual(result["status"], "success")
        self.assertIn("previous_metrics", result)
        
        # Verificar que as métricas foram resetadas
        diagnostics_after = get_diagnostics()
        self.assertEqual(diagnostics_after["metrics"]["request_count"], 0)
        self.assertEqual(len(diagnostics_after["metrics"]["tool_executions"]), 0)
        self.assertEqual(len(diagnostics_after["metrics"]["errors"]), 0)
    
    @patch("requests.get")
    @patch("src.config.Config.get_api_token")
    def test_check_api_connection_success(self, mock_token, mock_get):
        """Testa verificação de conexão com a API do PipeRun com sucesso."""
        # Configurar mocks
        mock_token.return_value = "test_token"
        
        # Simular resposta bem-sucedida
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "id": 123,
                "name": "Teste Usuário",
                "email": "teste@exemplo.com"
            }
        }
        mock_get.return_value = mock_response
        
        # Executar a função
        result = check_api_connection()
        
        # Verificar resultado
        self.assertEqual(result["status"], "connected")
        self.assertIn("user", result)
        self.assertEqual(result["user"]["id"], 123)
        self.assertEqual(result["user"]["name"], "Teste Usuário")
    
    @patch("requests.get")
    @patch("src.config.Config.get_api_token")
    def test_check_api_connection_error(self, mock_token, mock_get):
        """Testa verificação de conexão com a API do PipeRun com erro."""
        # Configurar mocks
        mock_token.return_value = "test_token"
        
        # Simular resposta com erro
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.text = "Unauthorized"
        mock_get.return_value = mock_response
        
        # Executar a função
        result = check_api_connection()
        
        # Verificar resultado
        self.assertEqual(result["status"], "error")
        self.assertIn("message", result)
        self.assertIn("401", result["message"])

if __name__ == "__main__":
    unittest.main()
