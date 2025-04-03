import axios from 'axios';
import { PiperunApiService } from '../services/piperunApi.js';
// Mock do axios
jest.mock('axios');
const mockedAxios = axios;
describe('PiperunApiService', () => {
    let piperunApiService;
    beforeEach(() => {
        piperunApiService = new PiperunApiService();
        mockedAxios.create.mockReturnValue(mockedAxios);
        // Reset dos mocks entre os testes
        jest.clearAllMocks();
    });
    describe('listDeals', () => {
        it('deve retornar a lista de negócios com sucesso', async () => {
            // Dados mockados para o teste
            const mockData = {
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
            // Configuração do mock do axios para retornar os dados mockados
            mockedAxios.get.mockResolvedValue({ data: mockData });
            // Chamada do método a ser testado
            const result = await piperunApiService.listDeals({ page: 1, show: 10 });
            // Verificações
            expect(mockedAxios.get).toHaveBeenCalledWith('/deals', {
                params: { page: 1, show: 10 }
            });
            expect(result).toEqual(mockData);
        });
        it('deve propagar o erro quando a requisição falhar', async () => {
            // Simulação de erro
            const mockError = new Error('Erro na API');
            mockedAxios.get.mockRejectedValue(mockError);
            // Verificação do erro
            await expect(piperunApiService.listDeals()).rejects.toThrow('Erro na API');
            expect(mockedAxios.get).toHaveBeenCalledWith('/deals', {
                params: {}
            });
        });
    });
    describe('listPipelines', () => {
        it('deve retornar a lista de funis com sucesso', async () => {
            // Dados mockados para o teste
            const mockData = {
                data: [
                    { id: 1, name: 'Funil 1' },
                    { id: 2, name: 'Funil 2' }
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
            // Configuração do mock do axios para retornar os dados mockados
            mockedAxios.get.mockResolvedValue({ data: mockData });
            // Chamada do método a ser testado
            const result = await piperunApiService.listPipelines({ page: 1, show: 10 });
            // Verificações
            expect(mockedAxios.get).toHaveBeenCalledWith('/pipelines', {
                params: { page: 1, show: 10 }
            });
            expect(result).toEqual(mockData);
        });
    });
    describe('listStages', () => {
        it('deve retornar a lista de etapas com sucesso', async () => {
            // Dados mockados para o teste
            const mockData = {
                data: [
                    { id: 1, name: 'Etapa 1', pipeline_id: 1 },
                    { id: 2, name: 'Etapa 2', pipeline_id: 1 }
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
            // Configuração do mock do axios para retornar os dados mockados
            mockedAxios.get.mockResolvedValue({ data: mockData });
            // Chamada do método a ser testado
            const result = await piperunApiService.listStages({
                page: 1,
                show: 10,
                pipeline_id: 1
            });
            // Verificações
            expect(mockedAxios.get).toHaveBeenCalledWith('/stages', {
                params: { page: 1, show: 10, pipeline_id: 1 }
            });
            expect(result).toEqual(mockData);
        });
    });
    describe('updateDeal', () => {
        it('deve atualizar um negócio com sucesso', async () => {
            // Dados mockados para o teste
            const dealId = 1;
            const updateData = { title: 'Negócio Atualizado', value: 5000 };
            const mockResponse = {
                data: {
                    id: dealId,
                    title: 'Negócio Atualizado',
                    value: 5000
                }
            };
            // Configuração do mock do axios para retornar os dados mockados
            mockedAxios.put.mockResolvedValue({ data: mockResponse });
            // Chamada do método a ser testado
            const result = await piperunApiService.updateDeal(dealId, updateData);
            // Verificações
            expect(mockedAxios.put).toHaveBeenCalledWith(`/deals/${dealId}`, updateData);
            expect(result).toEqual(mockResponse.data);
        });
    });
});
//# sourceMappingURL=piperunApi.test.js.map