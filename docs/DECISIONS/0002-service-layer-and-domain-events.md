# ADR 0002 - Camada de Serviço e Domain Events

## Status

Accepted

## Context

Com o amadurecimento do CareerHub em direção a uma plataforma de longo prazo, o backend FastAPI precisa lidar com regras de negócio cada vez mais complexas. Misturar lógicas de banco de dados diretamente nos `Routers` fere a testabilidade e o princípio da responsabilidade única.

Paralelamente, precisamos rastrear o histórico das vagas e currículos de forma estruturada para futuras integrações de IA e Analytics.

## Decision

1. **Service Layer em vez de Repository Pattern estrito:**
   - Adotaremos a **Service Layer** (ex: `JobService`) para encapsular casos de uso.
   - **Não** criaremos uma abstração customizada de `Repository` para mascarar o SQLAlchemy. O SQLAlchemy já provê nativamente padrões robustos de Unit of Work (`Session`) e Repository (`Query`). 

2. **Domain Events em vez de Event Sourcing:**
   - Para histórico e rastreabilidade, implementaremos o padrão de **Domain Events**.
   - **Não** implementaremos Event Sourcing puro, pois altera drasticamente a arquitetura (CQRS, Event Store) gerando complexidade desnecessária nesta fase.
   - O estado da entidade continuará salvo no banco relacional, mas o sistema disparará eventos (ex: `JobStatusChanged`) que atualizarão o `ActivityLog` de forma padronizada.

## Consequences

Benefícios:
- Alta coesão nos Routers.
- Serviços testáveis isoladamente.
- Obtenção de trilha de auditoria (Eventos) com baixo custo arquitetural (10% da complexidade do Event Sourcing para 90% do valor).

Tradeoffs:
- Acoplamento explícito ao SQLAlchemy como ORM/Query Builder.
