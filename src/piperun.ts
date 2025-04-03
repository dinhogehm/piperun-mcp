import axios from 'axios';

// Esta url é o endpoint base da API PipeRun

const BASE_URL = 'https://api.pipe.run/v1';

/**
 * Interface para os parâmetros de listagem
 */
interface ListParams {
  page?: number;
  show?: number;
  person_id?: string;
  pipeline_id?: string;
}

/**
 * Lista deals da API PipeRun
 * @param apiKey Chave de API do PipeRun
 * @param params Parâmetros de paginação e filtro
 */
export async function getListDeals(apiKey: string, params: ListParams = {}) {
  console.log('Buscando deals com parâmetros:', params);
  
  try {
    const response = await axios.get(`${BASE_URL}/deals`, {
      headers: {
        'token': apiKey
      },
      params: {
        page: params.page || 1,
        show: params.show || 20,
        person_id: params.person_id
      }
    });
    
    console.log(`Deals obtidos com sucesso. Total: ${response.data.meta?.total || 'N/A'}`);
    return {
      data: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error: any) {
    console.error('Erro ao buscar deals:', error);
    throw new Error(`Erro ao buscar deals: ${error.message || error}`);
  }
}

/**
 * Lista pipelines da API PipeRun
 * @param apiKey Chave de API do PipeRun
 * @param params Parâmetros de paginação
 */
export async function getListPipelines(apiKey: string, params: ListParams = {}) {
  console.log('Buscando pipelines com parâmetros:', params);
  
  try {
    const response = await axios.get(`${BASE_URL}/pipelines`, {
      headers: {
        'token': apiKey
      },
      params: {
        page: params.page || 1,
        show: params.show || 20
      }
    });
    
    console.log(`Pipelines obtidos com sucesso. Total: ${response.data.meta?.total || 'N/A'}`);
    return {
      data: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error: any) {
    console.error('Erro ao buscar pipelines:', error);
    throw new Error(`Erro ao buscar pipelines: ${error.message || error}`);
  }
}

/**
 * Lista stages da API PipeRun
 * @param apiKey Chave de API do PipeRun
 * @param params Parâmetros de paginação e filtro
 */
export async function getListStages(apiKey: string, params: ListParams = {}) {
  console.log('Buscando stages com parâmetros:', params);
  
  try {
    const response = await axios.get(`${BASE_URL}/stages`, {
      headers: {
        'token': apiKey
      },
      params: {
        page: params.page || 1,
        show: params.show || 20,
        pipeline_id: params.pipeline_id
      }
    });
    
    console.log(`Stages obtidos com sucesso. Total: ${response.data.meta?.total || 'N/A'}`);
    return {
      data: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error: any) {
    console.error('Erro ao buscar stages:', error);
    throw new Error(`Erro ao buscar stages: ${error.message || error}`);
  }
}

/**
 * Lista produtos da API PipeRun
 * @param apiKey Chave de API do PipeRun
 * @param params Parâmetros de paginação
 */
export async function getListProducts(apiKey: string, params: ListParams = {}) {
  console.log('Buscando produtos com parâmetros:', params);
  
  try {
    const response = await axios.get(`${BASE_URL}/items`, {
      headers: {
        'token': apiKey
      },
      params: {
        page: params.page || 1,
        show: params.show || 20
      }
    });
    
    console.log(`Produtos obtidos com sucesso. Total: ${response.data.meta?.total || 'N/A'}`);
    return {
      data: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(`Erro ao buscar produtos: ${error.message || error}`);
  }
}
