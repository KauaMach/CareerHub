# CareerHub - Architecture

Este documento descreve a arquitetura tecnica proposta para o CareerHub. Ele deve evoluir junto com o codigo real.

## Status

Baseline arquitetural inicial aceita em `docs/DECISIONS/0001-initial-architecture-baseline.md`. O repositorio ainda nao possui scaffold de aplicacao.

## Objetivos Arquiteturais

- Entregar o MVP com baixa complexidade operacional.
- Manter separacao clara entre produto, dominio, aplicacao e infraestrutura.
- Permitir evolucao para IA, integracoes e jobs sem reescrever o core.
- Facilitar trabalho de humanos e agentes de IA com limites claros entre modulos.

## Estilo Recomendado

Comecar com monolito modular ou monorepo simples.

Separacoes principais:

- frontend web;
- backend HTTP;
- banco relacional;
- storage de arquivos;
- documentacao;
- adaptadores externos futuros.

Microservices nao sao recomendados para o MVP.

## Camadas

### Interface

Responsavel por telas, rotas HTTP, validacao de entrada e apresentacao.

Nao deve concentrar regra de negocio.

### Aplicacao

Responsavel por casos de uso: criar vaga, mover candidatura, cadastrar curriculo, anexar certificado, calcular KPIs.

### Dominio

Responsavel por entidades, regras e invariantes de negocio.

Dominios iniciais:

- usuarios;
- empresas;
- vagas;
- candidaturas;
- curriculos;
- certificados;
- dashboard.

### Infraestrutura

Responsavel por banco, storage, email, providers externos, filas, cache e IA.

Deve ser acessada por interfaces/adaptadores para evitar acoplamento.

## Stack de Referencia

A stack de referencia para o scaffold inicial e:

- Frontend: Next.js, React, TypeScript, Tailwind.
- Backend: FastAPI, Python, Pydantic, SQLAlchemy, Alembic.
- Banco: PostgreSQL.
- Storage: S3 compativel ou alternativa local.
- Testes: Pytest no backend; Vitest/Testing Library/Playwright no frontend.

Para o MVP, Redis, Celery, MinIO, observabilidade avancada e IA devem ser opcionais ate haver necessidade real.

## Modulos Tecnicos Iniciais

### Auth

Registro, login, sessao e protecao de rotas.

### Companies

Cadastro e organizacao de empresas.

### Jobs

Cadastro de vagas, status, notas, checklist e relacao com empresa.

### Resumes

Cadastro de curriculos e estrutura basica de secoes.

### Certificates

Cadastro de certificados e, quando houver storage, anexos.

### Dashboard

Consultas agregadas simples para KPIs operacionais.

## IA e Integracoes

IA deve ser introduzida depois do MVP.

Quando entrar:

- usar interface de provider;
- permitir troca de fornecedor;
- isolar prompts, custos e limites;
- nao persistir API keys sem criptografia;
- manter operacoes caras fora do request principal quando necessario.

## Decisoes Pendentes

- Monorepo definitivo ou repos separados.
- Estrategia de autenticacao.
- Modelo de storage para anexos.
- Ambiente de deploy inicial.

Decisoes com tradeoffs devem virar ADR em `docs/DECISIONS/`.
