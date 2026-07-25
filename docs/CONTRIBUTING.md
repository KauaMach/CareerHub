# CareerHub - Contribuindo

Este documento define o fluxo de contribuicao do CareerHub.

## Status

O projeto ainda esta em fase de fundacao. Comandos de setup, teste e lint devem ser atualizados quando o scaffold de codigo existir.

## Antes de Contribuir

Leia:

- `PROJECT.md`
- `RULES.md`
- `docs/DOCUMENTATION.md`
- documento especializado da area alterada

## Fluxo de Trabalho

1. Entenda o escopo da mudanca.
2. Verifique se ela pertence ao MVP ou ao roadmap futuro.
3. Atualize a documentacao relevante junto com a alteracao.
4. Mantenha o diff pequeno e coeso.
5. Rode validacoes disponiveis.
6. Crie commits pequenos e atomicos quando a mudanca estiver validada.
7. Descreva claramente o que mudou.

## Branches

Convencao oficial nesta fase:

- `main`: linha principal estavel.
- `feature/<area>/<descricao>`: novas funcionalidades.
- `fix/<area>/<descricao>`: correcoes.
- `docs/<descricao>`: documentacao.
- `refactor/<descricao>`: refatoracoes.
- `chore/<descricao>`: manutencao, tooling e organizacao.
- `test/<area>/<descricao>`: testes sem mudanca funcional principal.

Nao usar `develop` por padrao nesta fase. O projeto ainda esta pequeno; `main` com branches curtas reduz processo desnecessario. A branch `develop` pode ser adotada futuramente se houver equipe maior, releases paralelos ou necessidade real de integracao intermediaria.

## Commits

Use Conventional Commits em todos os commits:

```text
feat(jobs): add application pipeline
fix(auth): handle expired session
docs(project): simplify mvp scope
refactor(resumes): split resume service
test(jobs): add status transition coverage
chore(repo): update gitignore
```

Formato:

```text
<type>(<scope>): <summary>
```

Tipos recomendados:

- `feat`: nova funcionalidade.
- `fix`: correcao de bug.
- `docs`: documentacao.
- `refactor`: refatoracao sem mudanca de comportamento.
- `test`: testes.
- `chore`: manutencao, tooling, configuracao ou organizacao.
- `style`: formatacao sem mudanca de comportamento.
- `perf`: melhoria de performance.
- `sec`: correcao ou melhoria de seguranca.

Regras:

- Use resumo no imperativo e em ingles tecnico simples.
- Mantenha o commit pequeno, revisavel e revertivel.
- Nao misture mudancas sem relacao no mesmo commit.
- Nao use mensagens genericas como `update`, `fix`, `wip` ou `changes`.
- Inclua corpo no commit quando a motivacao ou o impacto nao forem obvios.
- Use `BREAKING CHANGE:` no corpo quando houver quebra de contrato.

## Commits Continuos

Commits continuos sao encorajados quando ajudam a preservar contexto e rastreabilidade.

Bom uso:

- um commit para a visao central do projeto;
- um commit para arquitetura da documentacao;
- um commit para regras de agentes;
- um commit para ajustes de `.gitignore`;
- um commit para cada feature vertical validada.

Mau uso:

- commits quebrados apenas para salvar progresso;
- commits com codigo sem validacao disponivel;
- commits enormes acumulando varias decisoes;
- commits automaticos sem revisao humana.

Agentes de IA podem preparar mudancas em blocos pequenos, mas so devem executar `git commit` quando o usuario pedir explicitamente.

## Revisao

Toda revisao deve verificar:

- alinhamento com `PROJECT.md`;
- respeito a `RULES.md`;
- impacto no MVP;
- duplicacao de documentacao;
- riscos de seguranca;
- testes ou justificativa para ausencia de testes.

## Qualidade

Quando houver codigo:

- backend deve ter lint, formatacao, typecheck quando aplicavel e testes;
- frontend deve ter lint, formatacao, typecheck e testes quando aplicavel;
- mudancas de comportamento devem ter cobertura proporcional ao risco.

## Documentacao

Atualize:

- `docs/PRODUCT.md` para mudancas de requisito ou fluxo;
- `docs/ARCHITECTURE.md` para mudancas tecnicas;
- `docs/ROADMAP.md` para mudancas de fase ou prioridade;
- `RULES.md` para novas regras obrigatorias;
- `AGENTS.md` para instrucoes de agentes;
- `README.md` para setup e comandos reais.

## Pull Requests

Um PR deve explicar:

- o que mudou;
- por que mudou;
- como foi validado;
- riscos conhecidos;
- documentos atualizados.

Antes de abrir PR:

- confirme que a branch esta atualizada com `main`;
- confirme que cada commit tem uma razao clara;
- una ou reorganize commits ruidosos se isso melhorar a revisao;
- mantenha commits semanticamente separados quando isso preservar historico util.

## Comandos

Ainda nao ha comandos oficiais. Esta secao deve ser preenchida apos o scaffold inicial.
