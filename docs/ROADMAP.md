# CareerHub - Roadmap

Este documento detalha o plano de evolução do CareerHub como um produto completo de analytics e gestão de carreira.

## Fase 1 - O Motor Principal (Core Product)
Objetivo: Implementar o centro de comando funcional com toda a modelagem de dados avançada.

**Entregas:**
- Autenticação e Segurança.
- Modais e Listagens de Vagas (Kanban) suportando todos os campos complexos (Source, Seniority, Work Model).
- Gestão de Empresas.
- Gestão de Currículos e Certificados.
- Dashboard de métricas operacionais (Funil, Taxa de Conversão básica).
- Integração do relacionamento `Vaga -> Currículo`.

## Fase 2 - Analytics Profundo
Objetivo: Dar sentido aos dados ricos capturados na Fase 1.

**Entregas:**
- Painel de Analytics detalhado:
  - Gráficos de performance de Currículos.
  - Relatório de Origens (Source) mais efetivas.
  - Análise de Motivos de Rejeição (Rejection Reasons).
- Módulo de Entrevistas (Interviews), permitindo linkar anotações técnicas a cada vaga.
- Alertas e Notificações (Prazos de aplicação e acompanhamento de "Ghosting").

## Fase 3 - Inteligência Artificial (ATS e Fit)
Objetivo: Automatizar a leitura e sugerir melhorias.

**Entregas:**
- `ATS Match Score`: Um processo de fundo que pega a `description` da Vaga, lê o texto do `resume_id` associado, e devolve uma nota de 0 a 100 de match.
- Sugestões de palavras-chave faltantes no currículo para aquela vaga específica.
- Geração de planos de estudo baseados nos motivos de rejeição (ex: "Foi rejeitado em 3 vagas por falta de testes automatizados. Sugestão: Curso de Jest").
*(Nota: Nenhuma IA deve gerar ou analisar Cartas de Apresentação).*

## Fase 4 - Ecossistema Expandido
Objetivo: Integrar a vida do usuário.

**Entregas:**
- Extensão de navegador para importar vagas direto do LinkedIn e Gupy com um clique.
- Exportação avançada de Currículos gerados dinamicamente em PDF, baseados em templates de alta conversão.
- Integração de agenda (Google Calendar) para entrevistas.
