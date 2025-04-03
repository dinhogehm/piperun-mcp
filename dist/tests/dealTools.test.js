import { dealTools } from '../tools/dealTools.js';
import { PiperunApiService } from '../services/piperunApi.js';
// Mock do serviço PiperunApiService
jest.mock('../services/piperunApi');
const MockedPiperunApiService = PiperunApiService;
describe('dealTools', () => {
    let mockPiperunApi;
    beforeEach(() => {
        // Limpar todos os mocks antes de cada teste
        jest.clearAllMocks();
        // Configurar instância mockada do PiperunApiService
        mockPiperunApi = new MockedPiperunApiService();
        // Substituir a implementação real pela implementação mockada
        MockedPiperunApiService.prototype.listDeals = mockPiperunApi.listDeals;
        MockedPiperunApiService.prototype.getDeal = mockPiperunApi.getDeal;
        MockedPiperunApiService.prototype.updateDeal = mockPiperunApi.updateDeal;
    });
    describe('listDeals', () => {
        it('deve validar os parâmetros corretamente', () => {
            const schema = dealTools.listDeals.schema;
            // Validação com parâmetros válidos
            expect(() => schema.parse({ page: 1, show: 10 })).not.toThrow();
            // Validação com parâmetros inválidos
            expect(() => schema.parse({ page: 'invalid' })).toThrow();
        });
        it('deve retornar lista de negócios formatada corretamente', async () => {
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
            // Chamar o handler da ferramenta
            const result = await dealTools.listDeals.handler({ page: 1, show: 10 });
            // Verificar que a API foi chamada com os parâmetros corretos
            expect(mockPiperunApi.listDeals).toHaveBeenCalledWith({ page: 1, show: 10 });
            // Verificar que o resultado foi formatado corretamente
            expect(result).toHaveProperty('content');
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe('text');
            expect(typeof result.content[0].text).toBe('string');
            // Verificar que o conteúdo pode ser parseado de volta para o formato original
            const parsedContent = JSON.parse(result.content[0].text);
            expect(parsedContent).toEqual(mockDealData);
        });
        it('deve retornar mensagem de erro quando a API falhar', async () => {
            // Configurar mock para lançar um erro
            const errorMessage = 'Erro na API';
            mockPiperunApi.listDeals.mockRejectedValue(new Error(errorMessage));
            // Chamar o handler da ferramenta
            const result = await dealTools.listDeals.handler({ page: 1, show: 10 });
            // Verificar que o resultado contém a mensagem de erro
            expect(result).toHaveProperty('content');
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe('text');
            expect(result.content[0].text).toContain('Erro ao listar negócios');
            expect(result.content[0].text).toContain(errorMessage);
        });
    });
    describe('getDealDetails', () => {
        it('deve retornar detalhes de um negócio formatados corretamente', async () => {
            // Configurar mock para retornar dados de teste
            const mockDeal = {
                id: 1,
                title: 'Negócio Teste',
                value: 5000,
                stage_id: 2,
                person_id: 3
            };
            mockPiperunApi.getDeal.mockResolvedValue(mockDeal);
            // Chamar o handler da ferramenta
            const result = await dealTools.getDealDetails.handler({ deal_id: 1 });
            // Verificar que a API foi chamada com os parâmetros corretos
            expect(mockPiperunApi.getDeal).toHaveBeenCalledWith(1);
            // Verificar que o resultado foi formatado corretamente
            expect(result).toHaveProperty('content');
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe('text');
            // Verificar que o conteúdo pode ser parseado de volta para o formato original
            const parsedContent = JSON.parse(result.content[0].text);
            expect(parsedContent).toEqual(mockDeal);
        });
    });
    describe('updateDeal', () => {
        it('deve atualizar um negócio e retornar a confirmação', async () => {
            // Dados para atualização
            const dealId = 1;
            const updateData = { title: 'Negócio Atualizado', value: 7500 };
            // Configurar mock para retornar dados atualizados
            const mockUpdatedDeal = {
                id: dealId,
                title: 'Negócio Atualizado',
                value: 7500,
                stage_id: 2,
                person_id: 3
            };
            mockPiperunApi.updateDeal.mockResolvedValue(mockUpdatedDeal);
            // Chamar o handler da ferramenta
            const result = await dealTools.updateDeal.handler({
                deal_id: dealId,
                data: updateData
            });
            // Verificar que a API foi chamada com os parâmetros corretos
            expect(mockPiperunApi.updateDeal).toHaveBeenCalledWith(dealId, updateData);
            // Verificar que o resultado foi formatado corretamente
            expect(result).toHaveProperty('content');
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe('text');
            expect(result.content[0].text).toContain('Negócio atualizado com sucesso');
            // Verificar que o conteúdo contém os dados atualizados
            expect(result.content[0].text).toContain('"title":"Negócio Atualizado"');
            expect(result.content[0].text).toContain('"value":7500');
        });
    });
});
//# sourceMappingURL=dealTools.test.js.map