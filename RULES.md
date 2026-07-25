# CareerHub - Regras Obrigatorias

Este arquivo registra invariantes do projeto. Ele deve ser curto, objetivo e usado por humanos e agentes de IA.

## Produto

- O nome atual do projeto e CareerHub.
- O `PROJECT.md` e a fonte central da visao do produto.
- O MVP deve permanecer focado em organizacao de oportunidades, candidaturas, curriculos, empresas, certificados e dashboard operacional.
- IA, ATS automatico, estudos, concursos, networking avancado, mobile e integracoes externas nao fazem parte do MVP.
- Funcionalidades fora do MVP devem ir para `docs/ROADMAP.md`, nao para escopo imediato.

## Documentacao

- `PROJECT.md` nao deve conter banco detalhado, endpoints, checklists, comandos de setup, estrutura completa de pastas ou regras de codigo.
- Cada informacao deve ter uma fonte principal.
- Duplicacao so e aceitavel como resumo com link para o documento especializado.
- Mudancas de escopo devem atualizar `PROJECT.md` ou `docs/ROADMAP.md`.
- Mudancas tecnicas relevantes devem atualizar `docs/ARCHITECTURE.md`.
- Mudancas no fluxo de contribuicao devem atualizar `docs/CONTRIBUTING.md`.

## Arquitetura

- Comece simples: monolito modular ou monorepo simples antes de microservices.
- Separe regras de negocio de transporte, UI e persistencia.
- Valide entradas em fronteiras de sistema.
- Nao acople regras de produto a um provider especifico de IA.
- Jobs, filas, cache distribuido, CQRS e event sourcing so devem entrar com necessidade clara.

## Seguranca

- Nunca versionar `.env`, secrets, chaves privadas ou tokens.
- Senhas devem ser armazenadas apenas com hash forte.
- API keys de usuario devem ser criptografadas se forem persistidas.
- Uploads devem validar tipo, tamanho e nome do arquivo.
- Dados do usuario pertencem ao usuario e devem ser tratados como sensiveis.

## Git

- Nao reverter alteracoes de terceiros sem pedido explicito.
- Nao remover referencias antigas sem pedido explicito.
- Commits devem seguir Conventional Commits.
- Commits devem ser pequenos, coesos, descritivos e revertiveis.
- Commits continuos sao encorajados quando preservam contexto e rastreabilidade.
- Mensagens genericas como `update`, `fix`, `wip` e `changes` nao devem ser usadas.
- Agentes de IA nao devem executar `git commit`, `git tag` ou `git push` sem pedido explicito do usuario.
