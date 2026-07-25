# ADR 0004 - Assincronicidade, Background Jobs e IA

## Status

Accepted

## Context

O CareerHub necessita processar análises complexas, como pontuações de adequação de currículos a vagas (`ATS Match Score`), sumarização de observações e notificações automáticas. Processar tais fluxos sincronicamente no loop HTTP do FastAPI resultará em timeouts e péssima UX.

## Decision

1. **Infraestrutura Assíncrona Abstrata:**
   - Adotaremos uma solução de processamento assíncrono adequada à nossa escala e stack Python.
   - Em vez de acoplar obrigatoriamente ao Celery (que exige corretores pesados como RabbitMQ), introduziremos uma camada abstrata de Jobs baseada na infraestrutura disponível, que pode evoluir (Dramatiq, TaskIQ, FastStream ou Celery).
   - O fluxo principal retorna HTTP 202 (Accepted) e a interface via Websocket/Polling reflete o estado do *job*.

2. **Abstração de Provedores de IA (AI Module):**
   - Não atrelaremos o sistema rigidamente a modelos (OpenAI, Gemini) ou ferramentas específicas (ex: `pgvector`) de imediato.
   - Construiremos um `EmbeddingProvider` e `AIProvider` abstratos, que por trás dos panos orquestram as requisições para LLMs ou salvam em Vector Databases (Pinecone, Qdrant ou pgvector).
   
## Consequences

Benefícios:
- Desacoplamento técnico de provedores LLM caros, permitindo substituição (ex: Ollama local para desenvolvimento, OpenAI em prod).
- UX livre de travamentos.
- Capacidade de reprocessamento (retries) independente do request do usuário.

Tradeoffs:
- Maior complexidade operacional local (é preciso rodar o Worker de jobs junto ao servidor HTTP).
