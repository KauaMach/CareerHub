# CareerHub - Deployment

Este documento define diretrizes de deploy. Ele deve ser atualizado quando houver ambiente real.

## Status

Planejamento inicial. Ainda nao ha aplicacao para deploy.

## Objetivos

- Manter deploy simples no MVP.
- Evitar dependencia prematura de infraestrutura complexa.
- Garantir configuracao segura de secrets e ambiente.
- Permitir rollback em mudancas de risco.

## Ambientes

### Local

Usado para desenvolvimento.

Deve ter:

- banco local ou containerizado;
- variaveis via `.env`;
- dados descartaveis;
- logs locais.

### Preview

Usado para revisar PRs quando houver CI/CD.

Deve ter:

- ambiente isolado;
- secrets de preview;
- dados de teste;
- URL temporaria.

### Production

Usado por usuarios reais.

Deve ter:

- HTTPS;
- secrets gerenciados fora do repositorio;
- backups;
- logs;
- monitoramento minimo;
- estrategia de rollback.

## Estrategia Recomendada para MVP

Comecar com deploy simples:

- frontend em plataforma compativel com a stack escolhida;
- backend em PaaS ou container simples;
- PostgreSQL gerenciado;
- storage gerenciado apenas quando anexos entrarem;
- CI com lint, testes e build antes de deploy.

Evitar no MVP:

- Kubernetes;
- microservices;
- service mesh;
- observabilidade complexa;
- multi-region;
- filas obrigatorias sem necessidade.

## Variaveis de Ambiente

Regras:

- `.env` local nao e versionado.
- `.env.example` lista placeholders.
- producao usa secrets do provider.
- rotacao de secrets deve ser documentada.

Categorias esperadas:

- database;
- auth;
- frontend URL;
- storage;
- email futuro;
- IA futura.

## Banco de Dados

Antes de deploy com migration:

- revisar migration;
- validar backup quando for producao;
- evitar alteracoes destrutivas sem plano;
- executar migration uma vez por release.

## Rollback

Toda release de risco deve responder:

- como voltar o codigo;
- se a migration e reversivel;
- se ha mudanca de dados irreversivel;
- como desativar feature se necessario.

## Checklist de Deploy

- [ ] Build executado.
- [ ] Testes executados.
- [ ] Variaveis configuradas.
- [ ] Migrations revisadas.
- [ ] Secrets nao aparecem em logs.
- [ ] Healthcheck definido.
- [ ] Plano de rollback definido.

## Decisoes Pendentes

- Provider de frontend.
- Provider de backend.
- Banco gerenciado.
- Storage para anexos.
- Estrategia de preview deploy.
- Ferramenta de CI/CD.
