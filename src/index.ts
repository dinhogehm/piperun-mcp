import express from 'express';
import { getListDeals, getListPipelines, getListStages, getListProducts } from './piperun.js';

/**
 * Servidor principal para a integração do PipeRun com MCP
 * Este servidor fornece endpoints para interagir com a API do PipeRun
 */
const app = express();

// Configurar middleware para parsing JSON
app.use(express.json());

// Adicionar informações sobre a API
app.get('/', (req: express.Request, res: express.Response) => {
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

// Definir rotas
app.get('/deals', async (req: express.Request, res: express.Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    const person_id = req.query.person_id ? String(req.query.person_id) : undefined;
    
    const deals = await getListDeals(apiKey, { page, show, person_id });
    
    return res.json(deals);
  } catch (error: any) {
    console.error('Erro ao buscar deals:', error);
    return res.status(500).json({ error: 'Erro ao buscar deals', details: error.message });
  }
});
app.get('/pipelines', async (req: express.Request, res: express.Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    
    const pipelines = await getListPipelines(apiKey, { page, show });
    
    return res.json(pipelines);
  } catch (error: any) {
    console.error('Erro ao buscar pipelines:', error);
    return res.status(500).json({ error: 'Erro ao buscar pipelines', details: error.message });
  }
});
app.get('/stages', async (req: express.Request, res: express.Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    const pipeline_id = req.query.pipeline_id ? String(req.query.pipeline_id) : undefined;
    
    const stages = await getListStages(apiKey, { page, show, pipeline_id });
    
    return res.json(stages);
  } catch (error: any) {
    console.error('Erro ao buscar stages:', error);
    return res.status(500).json({ error: 'Erro ao buscar stages', details: error.message });
  }
});
app.get('/products', async (req: express.Request, res: express.Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      return res.status(401).json({ error: 'API Key é necessária' });
    }
    
    const page = req.query.page ? Number(req.query.page) : 1;
    const show = req.query.show ? Number(req.query.show) : 20;
    
    const products = await getListProducts(apiKey, { page, show });
    
    return res.json(products);
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor PipeRun MCP rodando na porta ${PORT}`);
});

export default app;
