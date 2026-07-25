# CareerHub - Security

Este documento define a base de seguranca do CareerHub.

## Objetivos

- Proteger dados pessoais e profissionais do usuario.
- Evitar vazamento de credenciais, tokens e anexos.
- Manter controles simples e aplicaveis ao MVP.
- Preparar o produto para IA e integracoes sem expor dados sensiveis.

## Principios

- Menor privilegio.
- Validacao nas fronteiras.
- Secrets fora do repositorio.
- Dados sensiveis protegidos em repouso e em transito.
- Logs sem segredos.
- Seguranca como requisito do MVP, nao etapa posterior.

## Autenticacao

Recomendacao inicial:

- email e senha no MVP;
- senha com hash forte;
- access token curto;
- refresh token seguro;
- logout com invalidacao quando houver armazenamento de sessoes.

Futuro:

- OAuth;
- 2FA;
- gerenciamento de sessoes por dispositivo.

## Autorizacao

Toda entidade de usuario deve ser isolada por `user_id`.

Regra obrigatoria:

- um usuario nunca pode acessar, listar, editar ou excluir dados de outro usuario.

## Senhas

- Nunca armazenar senha em texto puro.
- Nunca retornar hash pela API.
- Usar algoritmo forte e parametro de custo adequado.
- Implementar recuperacao de senha com token curto e uso unico quando necessario.

## Secrets

- `.env` nao deve ser versionado.
- `.env.example` deve conter apenas placeholders.
- Chaves de producao devem ficar no provider de deploy ou secret manager.
- Nunca registrar secrets em logs.

## API Keys de IA

IA esta fora do MVP, mas a regra fica definida:

- se API keys de usuario forem persistidas, devem ser criptografadas;
- descriptografia deve acontecer apenas no momento de uso;
- usuario deve poder remover suas chaves;
- falhas de provider nao devem expor token, prompt sensivel ou stack trace.

## Uploads e Anexos

Quando houver upload:

- validar tipo MIME;
- validar extensao;
- limitar tamanho;
- gerar nome interno seguro;
- nao confiar no nome original;
- servir arquivos apenas apos autorizacao;
- preferir URLs assinadas quando usar object storage.

## CORS e Cookies

- CORS deve permitir apenas origens conhecidas.
- Cookies sensiveis devem usar `HttpOnly`, `Secure` e `SameSite`.
- Em desenvolvimento, flexibilizacoes devem ser explicitas e nunca copiadas para producao.

## Rate Limiting

Rotas candidatas a limite:

- login;
- registro;
- refresh;
- recuperacao de senha;
- uploads;
- futuras chamadas de IA.

## Logs

Logs podem conter:

- request id;
- usuario autenticado por id;
- rota;
- status;
- tempo de resposta;
- erro sanitizado.

Logs nao podem conter:

- senhas;
- tokens;
- API keys;
- conteudo completo de curriculos sem necessidade;
- arquivos;
- prompts sensiveis.

## Dependencias

Quando houver codigo:

- manter lockfiles versionados;
- rodar auditoria de dependencias no CI;
- atualizar dependencias criticas com prioridade;
- evitar pacotes sem manutencao para partes sensiveis.

## Privacidade

Dados do CareerHub podem incluir historico profissional, curriculos, certificados, contatos e candidaturas. Trate esses dados como sensiveis mesmo quando nao forem legalmente classificados como dados especiais.

## Incidentes

Em caso de suspeita de vazamento:

1. conter acesso;
2. preservar logs relevantes;
3. rotacionar secrets;
4. avaliar impacto;
5. corrigir causa raiz;
6. documentar acao corretiva.
