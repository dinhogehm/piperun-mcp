"""
Testes para o módulo de configuração MCP.
Este módulo contém testes unitários para garantir o correto funcionamento das configurações MCP.
"""
import unittest
import os
import json
import tempfile
from unittest.mock import patch, mock_open, MagicMock

# Importação do módulo a ser testado
from src.mcp_config import MCPConfig

class TestMCPConfig(unittest.TestCase):
    """Classe de teste para o módulo de configuração MCP."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        # Criar um objeto de configuração limpo para cada teste
        self.config = MCPConfig()
    
    def test_default_values(self):
        """Testa se os valores padrão são definidos corretamente."""
        self.assertEqual(self.config.server_name, "piperun-mcp")
        self.assertEqual(self.config.server_version, "1.0.0")
        self.assertTrue(isinstance(self.config.tool_categories, list))
        self.assertFalse(self.config.require_auth)
        self.assertEqual(self.config.auth_method, "token")
        self.assertFalse(self.config.support_resources)
        self.assertTrue(self.config.support_prompts)
    
    def test_to_dict(self):
        """Testa a conversão da configuração para dicionário."""
        config_dict = self.config.to_dict()
        
        # Verificar se o dicionário tem a estrutura esperada
        self.assertIn("server", config_dict)
        self.assertIn("capabilities", config_dict)
        self.assertIn("tool_categories", config_dict)
        self.assertIn("authentication", config_dict)
        
        # Verificar valores específicos
        self.assertEqual(config_dict["server"]["name"], "piperun-mcp")
        self.assertEqual(config_dict["capabilities"]["tools"], True)
        self.assertEqual(config_dict["capabilities"]["resources"], False)
        self.assertEqual(config_dict["capabilities"]["prompts"], True)
    
    @patch("builtins.open", new_callable=mock_open, read_data='{"server_name": "test-server", "server_version": "2.0.0"}')
    @patch("os.path.exists")
    def test_load_config_from_file(self, mock_exists, mock_file):
        """Testa o carregamento de configurações de um arquivo."""
        # Simular que o arquivo existe
        mock_exists.return_value = True
        
        # Criar uma nova instância que carregará do arquivo mockado
        config = MCPConfig()
        
        # Verificar se os valores foram atualizados corretamente
        self.assertEqual(config.server_name, "test-server")
        self.assertEqual(config.server_version, "2.0.0")
    
    @patch("json.dump")
    @patch("builtins.open", new_callable=mock_open)
    def test_save_to_file(self, mock_file, mock_json_dump):
        """Testa o salvamento de configurações em um arquivo."""
        # Configurar valores personalizados
        self.config.server_name = "custom-server"
        self.config.server_version = "3.0.0"
        
        # Salvar no arquivo
        self.config.save_to_file()
        
        # Verificar se o arquivo foi aberto para escrita
        mock_file.assert_called_once()
        
        # Verificar se json.dump foi chamado com os argumentos corretos
        # Capturar o primeiro argumento (o dicionário) passado para json.dump
        config_dict = mock_json_dump.call_args[0][0]
        
        # Verificar se os valores no dicionário estão corretos
        self.assertEqual(config_dict["server"]["name"], "custom-server")
        self.assertEqual(config_dict["server"]["version"], "3.0.0")

if __name__ == "__main__":
    unittest.main()
