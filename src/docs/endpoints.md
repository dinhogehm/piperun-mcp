# Endpoints da API do PipeRun

Este documento contém a lista de endpoints confirmados da API do PipeRun, baseados em testes realizados com a API.

## URL Base
https://api.pipe.run/v1

## Endpoints Confirmados

| Recurso | Método | Endpoint | Status |
|---------|--------|----------|--------|
| Empresas | GET | `/companies` | ✅ Funcionando |
| Pessoas (Contatos) | GET | `/persons` | ✅ Funcionando |
| Negócios (Oportunidades) | GET | `/deals` | ✅ Funcionando |
| Funis | GET | `/pipelines` | ✅ Funcionando |
| Etapas do funil | GET | `/stages` | ✅ Funcionando |
| Tarefas/Atividades | GET | `/activities` | ✅ Funcionando |
| Times | GET | `/teams` | ✅ Funcionando |
| Usuários | GET | `/users` | ✅ Funcionando |
| Tags | GET | `/tags` | ✅ Funcionando |
| Notas | GET | `/notes` | ✅ Funcionando |
| Campos Customizados | GET | `/customFields` | ✅ Confirmado |
| Produtos | GET | `/items` | ✅ Confirmado |

## Endpoints Não Disponíveis

| Recurso | Método | Endpoint | Status |
|---------|--------|----------|--------|
| Fontes | GET | `/sources` | ❌ Não encontrado (404) |

## Como Identificar Endpoints Corretos

Para identificar o endpoint correto para qualquer recurso da API do PipeRun:

1. Acesse a documentação da API: https://vendas.developers.pipe.run/reference/
2. Navegue até a página do recurso desejado
3. Procure pelo elemento HTML: `<span data-testid="serverurl">`
4. O atributo `title` deste elemento contém o endpoint correto

Exemplo:
```html
<span class="headline-container-article-info-url2nV_XrjpFuVQ" data-testid="serverurl" title="https://api.pipe.run/v1/persons">https://api.pipe.run/v1/persons</span>
```

Neste exemplo, o endpoint correto para Pessoas é: `https://api.pipe.run/v1/persons`

## Observações

* A API do PipeRun usa diferentes convenções de nomes para os endpoints:
  * Algumas entidades usam o nome no plural (companies, persons, deals)
  * Outras usam camelCase (customFields)
  * Algumas usam nomes diferentes do esperado (items para produtos)
* Ao implementar novos recursos, é importante verificar a documentação oficial ou realizar testes para confirmar o endpoint correto.
