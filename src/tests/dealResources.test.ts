import { dealResources } from '../resources/dealResources';
import { PiperunApiService } from '../services/piperunApi';

// Mock do serviço PiperunApiService
jest.mock('../services/piperunApi');
const MockedPiperunApiService = PiperunApiService as jest.MockedClass<typeof PiperunApiService>;

describe('dealResources', () => {
  let mockPiperunApi: jest.Mocked<PiperunApiService>;
  
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar instância mockada do PiperunApiService
    mockPiperunApi = new MockedPiperunApiService() as jest.Mocked<PiperunApiService>;
    
    // Substituir a implementação real pela implementação mockada
    MockedPiperunApiService.prototype.listDeals = mockPiperunApi.listDeals;
    MockedPiperunApiService.prototype.getDeal = mockPiperunApi.getDeal;
  });

  describe('listDeals', () => {
    it('deve retornar lista de negócios com os parâmetros corretos', async () => {
      // Configurar mock para retornar dados de teste
      const mockDealData = {
        data: [
          { id: 1, title: 'Negócio 1', value: 1000 },
          { id: 2, title: 'Negócio 2', value: 2000 }
        ],
        meta: {
          pagination: {
            total: 2,
            count: 2,
            per_page: 10,
            current_page: 1,
            total_pages: 1
          }
        }
      };
      
      mockPiperunApi.listDeals.mockResolvedValue(mockDealData);
      
      // Mock da URL
      const uri = new URL('piperun://negocios/lista?page=2&show=5');
      
      // Chamar o handler do recurso
      const result = await dealResources.listDeals.handler(uri, { page: '2', show: '5' });
      
      // Verificar que a API foi chamada com os parâmetros corretos
      expect(mockPiperunApi.listDeals).toHaveBeenCalledWith({ 
        page: 2, 
        show: 5 
      });
      
      // Verificar que o resultado foi formatado corretamente
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      
      // Verificar que o conteúdo pode ser parseado de volta para o formato original
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toEqual(mockDealData);
    });

    it('deve usar valores padrão quando parâmetros não são fornecidos', async () => {
      // Configurar mock para retornar dados de teste
      mockPiperunApi.listDeals.mockResolvedValue({
        data: [],
        meta: {
          pagination: {
            total: 0,
            count: 0,
            per_page: 10,
            current_page: 1,
            total_pages: 0
          }
        }
      });
      
      // Mock da URL sem parâmetros
      const uri = new URL('piperun://negocios/lista');
      
      // Chamar o handler do recurso
      await dealResources.listDeals.handler(uri, {});
      
      // Verificar que a API foi chamada com os valores padrão
      expect(mockPiperunApi.listDeals).toHaveBeenCalledWith({ 
        page: 1, 
        show: 10 
      });
    });

    it('deve retornar mensagem de erro quando a API falhar', async () => {
      // Configurar mock para lançar um erro
      const errorMessage = 'Erro na API';
      mockPiperunApi.listDeals.mockRejectedValue(new Error(errorMessage));
      
      // Mock da URL
      const uri = new URL('piperun://negocios/lista');
      
      // Chamar o handler do recurso
      const result = await dealResources.listDeals.handler(uri, {});
      
      // Verificar que o resultado contém a mensagem de erro
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      expect(result.contents[0].text).toContain('Erro ao listar negócios');
      expect(result.contents[0].text).toContain(errorMessage);
    });
  });

  describe('getDeal', () => {
    it('deve retornar detalhes de um negócio específico', async () => {
      // Configurar mock para retornar dados de teste
      const mockDeal = {
        id: 42,
        title: 'Negócio Teste',
        value: 5000,
        stage_id: 2,
        person_id: 3
      };
      
      mockPiperunApi.getDeal.mockResolvedValue(mockDeal);
      
      // Mock da URL com ID do negócio
      const uri = new URL('piperun://negocios/42');
      
      // Chamar o handler do recurso
      const result = await dealResources.getDeal.handler(uri, { dealId: '42' });
      
      // Verificar que a API foi chamada com o ID correto
      expect(mockPiperunApi.getDeal).toHaveBeenCalledWith(42);
      
      // Verificar que o resultado foi formatado corretamente
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      
      // Verificar que o conteúdo pode ser parseado de volta para o formato original
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toEqual(mockDeal);
    });

    it('deve retornar mensagem de erro quando a API falhar', async () => {
      // Configurar mock para lançar um erro
      const errorMessage = 'Negócio não encontrado';
      mockPiperunApi.getDeal.mockRejectedValue(new Error(errorMessage));
      
      // Mock da URL
      const uri = new URL('piperun://negocios/999');
      
      // Chamar o handler do recurso
      const result = await dealResources.getDeal.handler(uri, { dealId: '999' });
      
      // Verificar que o resultado contém a mensagem de erro
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe(uri.href);
      expect(result.contents[0].text).toContain('Erro ao obter detalhes do negócio');
      expect(result.contents[0].text).toContain(errorMessage);
    });
  });
});
