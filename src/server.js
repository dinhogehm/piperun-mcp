// Servidor Express simples para API do PipeRun
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const BASE_URL = 'https://api.pipe.run/v1';

// Rota inicial com documentação da API
app.get('/', (req, res) => {
  res.json({
    name: 'piperun-mcp',
    description: 'Integração do PipeRun com MCP (Model Context Protocol)',
    version: '1.0.0',
    endpoints: [
      { path: '/deals', method: 'GET', description: 'Lista negociações' },
      { path: '/pipelines', method: 'GET', description: 'Lista pipelines' },
      { path: '/stages', method: 'GET', description: 'Lista estágios' },
      { path: '/products', method: 'GET', description: 'Lista produtos' }
    ]
  });
});

// Função para listar deals
async function getListDeals(apiKey, params = {}) {
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
  } catch (error) {
    console.error('Erro ao buscar deals:', error);
    throw new Error(`Erro ao buscar deals: ${error.message || error}`);
  }
}

// Função para listar pipelines
async function getListPipelines(apiKey, params = {}) {
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
  } catch (error) {
    console.error('Erro ao buscar pipelines:', error);
    throw new Error(`Erro ao buscar pipelines: ${error.message || error}`);
  }
}

// Função para listar stages
async function getListStages(apiKey, params = {}) {
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
  } catch (error) {
    console.error('Erro ao buscar stages:', error);
    throw new Error(`Erro ao buscar stages: ${error.message || error}`);
  }
}

// Função para listar produtos
async function getListProducts(apiKey, params = {}) {
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
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(`Erro ao buscar produtos: ${error.message || error}`);
  }
}

// Rota para listar deals
app.get('/deals', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    const person_id = req.query.person_id;
    
    const deals = await getListDeals(apiKey, { page, show, person_id });
    
    return res.json(deals);
  } catch (error) {
    console.error('Erro ao buscar deals:', error);
    return res.status(500).json({ error: 'Erro ao buscar deals', details: error.message });
  }
});

// Rota para listar pipelines
app.get('/pipelines', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    
    const pipelines = await getListPipelines(apiKey, { page, show });
    
    return res.json(pipelines);
  } catch (error) {
    console.error('Erro ao buscar pipelines:', error);
    return res.status(500).json({ error: 'Erro ao buscar pipelines', details: error.message });
  }
});

// Rota para listar stages
app.get('/stages', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    const pipeline_id = req.query.pipeline_id;
    
    const stages = await getListStages(apiKey, { page, show, pipeline_id });
    
    return res.json(stages);
  } catch (error) {
    console.error('Erro ao buscar stages:', error);
    return res.status(500).json({ error: 'Erro ao buscar stages', details: error.message });
  }
});

// Rota para listar produtos
app.get('/products', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    
    const products = await getListProducts(apiKey, { page, show });
    
    return res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor PipeRun MCP rodando na porta ${PORT}`);
});

export default app;
