# CareerHub - Instrucoes para Agentes

Este arquivo orienta agentes de IA que trabalham no CareerHub.

## Ordem de Leitura

Antes de editar, leia:

1. `PROJECT.md`
2. `RULES.md`
3. `docs/DOCUMENTATION.md`
4. O documento especializado da tarefa:
   - produto: `docs/PRODUCT.md`
   - arquitetura: `docs/ARCHITECTURE.md`
   - roadmap: `docs/ROADMAP.md`
   - contribuicao: `docs/CONTRIBUTING.md`

## Principios de Trabalho

- Preserve a simplicidade do MVP.
- Nao reintroduza escopo antigo sem mover para roadmap ou backlog futuro.
- Nao duplique informacao entre documentos.
- Se uma decisao for tecnica demais para `PROJECT.md`, coloque no documento especializado.
- Se uma regra for obrigatoria, coloque em `RULES.md`.
- Se uma decisao arquitetural tiver tradeoffs relevantes, crie ou proponha um ADR em `docs/DECISIONS/`.

## Regras para Edicao

- Mantenha alteracoes pequenas e coesas.
- Nao remova referencias antigas sem solicitacao explicita.
- Nao edite arquivos ignorados como fonte principal do projeto.
- Atualize documentos relacionados quando mudar escopo, arquitetura ou regras.
- Prefira Markdown simples, com secoes curtas e listas objetivas.

## Git e Commits

- Siga `docs/CONTRIBUTING.md` para branches, commits e PRs.
- Use Conventional Commits quando o usuario solicitar commit.
- Prefira commits pequenos, atomicos e revisaveis.
- Nao crie commits com mensagens genericas como `update`, `fix`, `wip` ou `changes`.
- Nao execute `git commit`, `git tag`, `git push` ou operacoes equivalentes sem pedido explicito do usuario.
- Quando houver varias mudancas, sugira uma divisao de commits coerente no resumo final.

## Contexto do Produto

CareerHub e o novo nome e a nova visao simplificada do antigo CareerOS.

O MVP foca em:

- empresas;
- vagas;
- candidaturas;
- curriculos;
- certificados;
- dashboard operacional.

Fora do MVP:

- IA generativa;
- ATS automatico;
- concursos;
- estudos;
- networking avancado;
- integracoes externas;
- mobile nativo;
- API publica.

## Validacao Antes de Finalizar

Antes de concluir uma tarefa:

- confirme que `PROJECT.md` continua curto e central;
- confirme que detalhes foram para o documento correto;
- confira `git status --short`;
- se houver mudancas pendentes, sugira commits atomicos quando fizer sentido;
- informe quais arquivos foram alterados;
- informe o que nao foi validado, se houver.

## Comandos

Enquanto nao houver scaffold de codigo, nao invente comandos de build ou teste.

Quando a aplicacao existir, registre os comandos oficiais em `README.md` e `docs/CONTRIBUTING.md`.
