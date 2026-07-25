# CareerHub - API

Este documento define as convencoes iniciais da API HTTP do CareerHub. Ele deve refletir a implementacao real quando o backend existir.

## Status

Contrato inicial para guiar o MVP. Endpoints podem mudar antes da primeira release.

## Objetivos

- Manter contratos previsiveis para frontend, backend e agentes de IA.
- Separar detalhes de transporte das regras de produto.
- Facilitar testes, documentacao OpenAPI e evolucao futura.

## Base

Convencao inicial:

```text
/api/v1
```

Todos os endpoints protegidos devem exigir usuario autenticado.

## Formato de Resposta

Resposta de sucesso:

```json
{
  "success": true,
  "data": {},
  "meta": null,
  "errors": null
}
```

Resposta paginada:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 0
  },
  "errors": null
}
```

Resposta de erro:

```json
{
  "success": false,
  "data": null,
  "meta": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input.",
      "field": "title"
    }
  ]
}
```

## Convencoes

- Usar JSON para request e response.
- Usar nomes em `snake_case` nos payloads da API, alinhados ao backend e banco.
- Usar UUID para identificadores publicos.
- Usar timestamps em ISO 8601.
- Usar datas em `YYYY-MM-DD`.
- Nao expor campos internos, hashes, secrets ou dados de auditoria sensiveis.

## Autenticacao

Endpoints publicos iniciais:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

Endpoints protegidos:

- todos os demais endpoints do MVP.

Estrategia inicial recomendada:

- access token curto;
- refresh token em cookie HttpOnly quando houver frontend/backend integrados;
- logout deve invalidar refresh token quando houver persistencia de sessoes.

## Paginacao

Endpoints de listagem devem aceitar:

```text
page=1
per_page=20
```

Limites:

- `per_page` padrao: 20;
- `per_page` maximo: 100.

## Ordenacao e Filtros

Convencao:

```text
sort=created_at
order=desc
query=python
status=applied
```

Filtros devem ser explicitamente suportados por endpoint. Nao criar filtros dinamicos livres sem validacao.

## Erros

Codigos recomendados:

- `VALIDATION_ERROR`
- `AUTHENTICATION_REQUIRED`
- `PERMISSION_DENIED`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

HTTP status deve refletir o erro:

- `400`: entrada invalida.
- `401`: nao autenticado.
- `403`: sem permissao.
- `404`: recurso inexistente.
- `409`: conflito de estado.
- `422`: erro semantico de validacao.
- `429`: limite excedido.
- `500`: erro inesperado.

## Endpoints do MVP

### Auth

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

### Companies

```text
GET    /companies
POST   /companies
GET    /companies/{company_id}
PATCH  /companies/{company_id}
DELETE /companies/{company_id}
```

### Jobs

```text
GET    /jobs
POST   /jobs
GET    /jobs/{job_id}
PATCH  /jobs/{job_id}
DELETE /jobs/{job_id}
PATCH  /jobs/{job_id}/status
```

### Resumes

```text
GET    /resumes
POST   /resumes
GET    /resumes/{resume_id}
PATCH  /resumes/{resume_id}
DELETE /resumes/{resume_id}
```

### Certificates

```text
GET    /certificates
POST   /certificates
GET    /certificates/{certificate_id}
PATCH  /certificates/{certificate_id}
DELETE /certificates/{certificate_id}
```

### Dashboard

```text
GET /dashboard/summary
GET /dashboard/pipeline
GET /dashboard/activity
```

## Fora do MVP

- ATS.
- IA generativa.
- Importacao por URL.
- Integracoes externas.
- API publica para terceiros.
- Webhooks.

## Manutencao

Quando a implementacao existir, este documento deve ser validado contra OpenAPI gerado pelo backend.
