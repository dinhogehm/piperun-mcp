/**
 * Servidor HTTP para o MCP do Piperun
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { listDeals } from './services/api.js';
import { listPipelines } from './services/api.js';
import { listStages } from './services/api.js';
import { listProducts } from './services/api.js';
import { listContacts } from './services/api.js';
import { checkApiStatus } from './services/api.js';

// Carrega variáveis de ambiente
config();

// Verifica se a chave de API está definida
if (!process.env.PIPERUN_API_KEY) {
  console.error("ERRO: Chave de API do Piperun não encontrada. Defina a variável de ambiente PIPERUN_API_KEY.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API do Piperun MCP',
    endpoints: [
      '/api/deals',
      '/api/pipelines',
      '/api/stages',
      '/api/products',
      '/api/contacts',
      '/api/status'
    ]
  });
});

// Rota para negócios
app.get('/api/deals', async (req: Request, res: Response) => {
  try {
    const params = {
      pipeline_id: req.query.pipeline_id ? Number(req.query.pipeline_id) : undefined,
      stage_id: req.query.stage_id ? Number(req.query.stage_id) : undefined,
      person_id: req.query.person_id ? Number(req.query.person_id) : undefined,
      title: req.query.title as string | undefined,
      status: req.query.status as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      show: req.query.show ? Number(req.query.show) : 20,
    };
    
    const result = await listDeals(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Rota para pipelines
app.get('/api/pipelines', async (req: Request, res: Response) => {
  try {
    const params = {
      page: req.query.page ? Number(req.query.page) : 1,
      show: req.query.show ? Number(req.query.show) : 20,
    };
    
    const result = await listPipelines(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Rota para etapas
app.get('/api/stages', async (req: Request, res: Response) => {
  try {
    if (!req.query.pipeline_id) {
      return res.status(400).json({ error: 'pipeline_id é obrigatório' });
    }
    
    const params = {
      pipeline_id: Number(req.query.pipeline_id),
      page: req.query.page ? Number(req.query.page) : 1,
      show: req.query.show ? Number(req.query.show) : 20,
    };
    
    const result = await listStages(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Rota para produtos
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const params = {
      name: req.query.name as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      show: req.query.show ? Number(req.query.show) : 20,
    };
    
    const result = await listProducts(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Rota para contatos
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const params = {
      name: req.query.name as string | undefined,
      email: req.query.email as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      show: req.query.show ? Number(req.query.show) : 20,
    };
    
    const result = await listContacts(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Rota para status
app.get('/api/status', async (req: Request, res: Response) => {
  try {
    const result = await checkApiStatus();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
