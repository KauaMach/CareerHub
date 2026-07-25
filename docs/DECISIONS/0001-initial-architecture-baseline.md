# ADR 0001 - Initial Architecture Baseline

## Status

Accepted

## Context

CareerHub esta em fase de fundacao. A referencia antiga do CareerOS tinha uma arquitetura ampla, com muitos modulos, IA, filas, storage, PWA, integracoes e detalhes enterprise.

Para a fase atual, o objetivo e reduzir complexidade sem perder capacidade de evolucao.

## Decision

Adotar uma arquitetura inicial simples:

- monorepo ou monolito modular;
- frontend web;
- backend HTTP;
- banco relacional;
- storage de arquivos apenas quando anexos entrarem;
- IA, filas e integracoes como capacidades futuras isoladas por adaptadores.

Stack de referencia para o scaffold inicial:

- Frontend: Next.js, React, TypeScript e Tailwind.
- Backend: FastAPI, Python, Pydantic, SQLAlchemy e Alembic.
- Banco: PostgreSQL.
- Testes: Pytest no backend; Vitest/Testing Library/Playwright no frontend.

Redis, Celery, MinIO, observabilidade avancada e providers de IA nao fazem parte do core obrigatorio do MVP.

## Consequences

Beneficios:

- menor custo de implementacao inicial;
- menor carga operacional;
- caminho claro para MVP;
- arquitetura ainda preparada para extensao;
- documentacao mais objetiva para humanos e agentes.

Tradeoffs:

- algumas automacoes antigas ficam adiadas;
- integracoes exigirao adaptadores futuros;
- decisoes de deploy ainda precisam ser fechadas quando houver scaffold.

## Follow-up

- Criar scaffold alinhado a este ADR.
- Atualizar `docs/ARCHITECTURE.md` quando a estrutura real existir.
- Criar ADRs novos para autenticacao, storage, deploy e IA quando essas decisoes forem tomadas.
