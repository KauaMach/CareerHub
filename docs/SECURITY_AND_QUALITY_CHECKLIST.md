# CareerHub - Security and Quality Checklist

Checklist operacional para desenvolvimento, revisao e release.

## Como Usar

- Marque itens apenas quando forem verificados.
- Nao use este arquivo para promessas.
- Se um item nao se aplica, registre `N/A` na revisao ou PR.

## Produto e Escopo

- [ ] Mudanca esta alinhada ao `PROJECT.md`.
- [ ] Mudanca pertence ao MVP ou esta registrada no `docs/ROADMAP.md`.
- [ ] Documentacao especializada foi atualizada.
- [ ] Nao houve reintroducao de escopo antigo sem decisao explicita.

## API

- [ ] Inputs sao validados.
- [ ] Respostas seguem `docs/API.md`.
- [ ] Erros nao expoem stack traces ou secrets.
- [ ] Endpoints protegidos exigem autenticacao.
- [ ] Recursos sao filtrados por `user_id`.
- [ ] Listagens possuem paginacao.

## Banco de Dados

- [ ] Mudancas estruturais possuem migration.
- [ ] Constraints importantes foram definidas.
- [ ] Indices acompanham consultas relevantes.
- [ ] Dados sensiveis nao sao armazenados em texto puro.
- [ ] Alteracoes destrutivas possuem plano de migracao.

## Seguranca

- [ ] `.env` e secrets nao foram versionados.
- [ ] Senhas usam hash forte.
- [ ] Tokens possuem expiracao adequada.
- [ ] CORS nao esta aberto em producao.
- [ ] Uploads validam tipo, tamanho e nome.
- [ ] Logs nao contem senhas, tokens ou API keys.
- [ ] API keys de usuario sao criptografadas se persistidas.

## Qualidade de Codigo

- [ ] Mudanca e pequena e coesa.
- [ ] Nomes sao claros.
- [ ] Regras de negocio nao ficam presas a controllers/telas.
- [ ] Duplicacao foi evitada.
- [ ] Codigo morto foi removido.
- [ ] Erros esperados sao tratados.

## Testes

- [ ] Testes unitarios cobrem regras relevantes.
- [ ] Testes de integracao cobrem contratos importantes.
- [ ] Testes de UI cobrem fluxos criticos quando houver frontend.
- [ ] Casos de erro foram testados.
- [ ] Ausencia de teste foi justificada quando aplicavel.

## Git

- [ ] Commits seguem Conventional Commits.
- [ ] Commits sao pequenos e atomicos.
- [ ] Mensagens genericas foram evitadas.
- [ ] PR explica o que mudou, por que mudou e como foi validado.

## Release

- [ ] Build passa.
- [ ] Lint passa.
- [ ] Typecheck passa quando aplicavel.
- [ ] Testes passam.
- [ ] Variaveis de ambiente estao documentadas.
- [ ] Plano de rollback existe para mudancas de risco.
