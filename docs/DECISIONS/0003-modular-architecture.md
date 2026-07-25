# ADR 0003 - Estratégia Modular por Domínio

## Status

Accepted

## Context

Projetos que crescem sob a clássica divisão de camadas técnicas (ex: `routers/`, `models/`, `schemas/`) frequentemente sofrem de baixo isolamento e dificuldade de manutenção. O CareerHub está evoluindo para se tornar uma plataforma corporativa com variados domínios (Vagas, Empresas, Currículos, Analytics).

## Decision

Reorganizar a arquitetura do projeto seguindo uma estrutura modular focada em **Bounded Contexts** (Domínios do Negócio) e não em camadas tecnológicas.

A estrutura pretendida é:
```text
modules/
  ├── Identity (Auth, Usuários, Permissões)
  ├── Career (Vagas, Entrevistas, Pipeline)
  ├── Companies (Empresas, Contatos, Anotações)
  ├── Documents (Currículos, Certificados, Storage)
  ├── Analytics (Dashboards, Logs, Conversões)
  ├── Integrations (LinkedIn, Gupy, Calendars)
  └── AI (LLM Providers, Match Scoring, Embeddings)
```

Dentro de cada módulo, manteremos a infraestrutura técnica (rotas, serviços, modelos):
```text
modules/Career/
  ├── router.py
  ├── schemas.py
  ├── models.py
  └── service.py
```

## Consequences

Benefícios:
- Alta coesão de domínio. Mudar a lógica de `Career` não interfere na pasta de `Companies`.
- Prepara o terreno para futura extração de microserviços, se necessário (ex: módulo de AI virar um Worker autônomo).
- Onboarding facilitado para novos desenvolvedores entenderem o sistema orientado ao produto.

Tradeoffs:
- Exige refatoração estrutural da base de código atual (migrar de flat-layer para modular).
- Requer disciplina estrita para não quebrar limites (ex: `Career` não deve importar diretamente o modelo interno de `Identity` sem passar por interfaces públicas ou IDs).
