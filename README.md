# CareerHub

CareerHub e uma plataforma para centralizar a gestao de carreira: oportunidades, candidaturas, curriculos, empresas, certificados, projetos, entrevistas e progresso profissional.

O objetivo inicial e substituir planilhas e arquivos soltos por um fluxo simples, rastreavel e evolutivo. A longo prazo, o produto deve adicionar inteligencia de carreira, integracoes e automacoes com IA.

## Status

Projeto em fase de definicao e fundacao. A documentacao base ja esta sendo organizada antes do scaffold da aplicacao.

## Documentacao Principal

- `PROJECT.md`: visao central do produto, MVP, principios e roadmap macro.
- `docs/DOCUMENTATION.md`: arquitetura da documentacao e regras de organizacao.
- `docs/PRODUCT.md`: personas, jornadas, requisitos e escopo de produto.
- `docs/ARCHITECTURE.md`: arquitetura tecnica proposta.
- `docs/ROADMAP.md`: fases, prioridades e criterios de aceite.
- `docs/API.md`: convencoes e contratos HTTP iniciais.
- `docs/DATABASE.md`: modelo de dados inicial do MVP.
- `docs/SECURITY.md`: diretrizes de seguranca.
- `docs/TESTING.md`: estrategia de testes.
- `docs/DEPLOYMENT.md`: diretrizes de deploy.
- `docs/OPERATIONS.md`: diretrizes de operacao.
- `AGENTS.md`: instrucoes para agentes de IA.
- `RULES.md`: regras obrigatorias do projeto.
- `docs/CONTRIBUTING.md`: fluxo de contribuicao.

## Escopo do MVP

- Autenticacao basica.
- Empresas.
- Vagas e candidaturas.
- Pipeline de status.
- Notas e checklist por vaga.
- Curriculos.
- Certificados.
- Dashboard operacional.

## Stack

A stack de referencia esta registrada em `docs/ARCHITECTURE.md` e no ADR inicial em `docs/DECISIONS/0001-initial-architecture-baseline.md`.

Resumo:

- Frontend web com Next.js, React, TypeScript e Tailwind.
- Backend HTTP com FastAPI, Python, Pydantic, SQLAlchemy e Alembic.
- PostgreSQL como banco relacional.
- Storage para anexos quando necessario.
- IA e jobs assincronos apenas em fases posteriores.

## Setup Local

Ainda nao ha scaffold de aplicacao. Quando o codigo for iniciado, este README deve conter:

- requisitos;
- instalacao;
- variaveis de ambiente;
- comandos de desenvolvimento;
- comandos de teste;
- comandos de lint/typecheck.

## Referencias

As pastas de referencia antigas ficam fora do versionamento pelo `.gitignore` e devem ser usadas apenas como insumo historico.
