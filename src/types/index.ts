/**
 * Definição de tipos para o MCP do Piperun
 */

import { z } from "zod";

// Tipos para parâmetros dos endpoints
export type DealsParams = z.infer<typeof dealsParamsSchema>;
export type PipelinesParams = z.infer<typeof pipelinesParamsSchema>;
export type StagesParams = z.infer<typeof stagesParamsSchema>;
export type ProductsParams = z.infer<typeof productsParamsSchema>;
export type ContactsParams = z.infer<typeof contactsParamsSchema>;
export type StatusParams = z.infer<typeof statusParamsSchema>;

// Schemas para validação de parâmetros
export const dealsParamsSchema = z.object({
  pipeline_id: z.number().optional().describe("ID do pipeline para filtrar negócios"),
  stage_id: z.number().optional().describe("ID da etapa para filtrar negócios"),
  person_id: z.number().optional().describe("ID do contato para filtrar negócios"),
  title: z.string().optional().describe("Título do negócio para filtrar"),
  status: z.enum(["open", "won", "lost"]).optional().describe("Status do negócio (aberto, ganho, perdido)"),
  page: z.number().optional().default(1).describe("Número da página para paginação"),
  show: z.number().optional().default(20).describe("Quantidade de registros por página"),
});

export const pipelinesParamsSchema = z.object({
  page: z.number().optional().default(1).describe("Número da página para paginação"),
  show: z.number().optional().default(20).describe("Quantidade de registros por página"),
});

export const stagesParamsSchema = z.object({
  pipeline_id: z.number().describe("ID do pipeline para listar etapas"),
  page: z.number().optional().default(1).describe("Número da página para paginação"),
  show: z.number().optional().default(20).describe("Quantidade de registros por página"),
});

export const productsParamsSchema = z.object({
  name: z.string().optional().describe("Nome do produto para filtrar"),
  page: z.number().optional().default(1).describe("Número da página para paginação"),
  show: z.number().optional().default(20).describe("Quantidade de registros por página"),
});

export const contactsParamsSchema = z.object({
  name: z.string().optional().describe("Nome do contato para filtrar"),
  email: z.string().optional().describe("Email do contato para filtrar"),
  page: z.number().optional().default(1).describe("Número da página para paginação"),
  show: z.number().optional().default(20).describe("Quantidade de registros por página"),
});

export const statusParamsSchema = z.object({});

// Tipos de resposta da API
export interface McpTextContent {
  type: "text";
  text: string;
}

export interface McpResponse {
  content: McpTextContent[];
}

// Interfaces para os dados do Piperun
export interface Deal {
  id: number;
  title: string;
  value: number;
  status: string;
  pipeline_id: number;
  stage_id: number;
  person_id?: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface Pipeline {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Stage {
  id: number;
  name: string;
  position: number;
  pipeline_id: number;
  [key: string]: any;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  [key: string]: any;
}

export interface Contact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

// Interfaces de resposta da API
export interface PiperunResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    }
  };
}

export interface StatusResponse {
  status: string;
  message: string;
}
