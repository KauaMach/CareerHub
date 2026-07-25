# CareerHub - Testing

Este documento define a estrategia de testes do CareerHub.

## Status

Estrategia inicial. Comandos reais devem ser adicionados quando houver scaffold.

## Objetivos

- Proteger regras de negocio do MVP.
- Evitar regressao em fluxos principais.
- Manter testes proporcionais ao risco.
- Dar confianca para humanos e agentes de IA alterarem o projeto.

## Piramide de Testes

### Unitarios

Foco:

- regras de dominio;
- validacoes;
- transicoes de status;
- calculos de dashboard;
- formatadores e helpers.

Devem ser rapidos e independentes de banco externo.

### Integracao

Foco:

- repositories;
- services com banco de teste;
- rotas HTTP;
- autenticacao;
- isolamento por usuario.

Devem validar contratos reais entre camadas.

### E2E

Foco:

- login;
- criar empresa;
- criar vaga;
- mover candidatura;
- cadastrar curriculo;
- cadastrar certificado;
- visualizar dashboard.

Devem cobrir apenas fluxos criticos para evitar suite lenta e fragil.

## Cobertura Inicial Esperada

Enquanto o produto estiver no MVP:

- regras de negocio criticas: cobertura alta;
- CRUD simples: cobertura de caminhos principais e erros relevantes;
- UI: smoke tests e fluxos criticos;
- integracoes futuras: mocks/fakes por padrao.

Nao perseguir cobertura numerica alta sem qualidade. Preferir testes que capturem comportamento real.

## Casos Criticos do MVP

- Usuario nao acessa dados de outro usuario.
- Vaga muda apenas para status valido.
- Candidaturas aparecem no pipeline correto.
- Dashboard agrega apenas dados do usuario autenticado.
- Certificados com validade aparecem corretamente em consultas futuras.
- Senha nunca e retornada pela API.

## Dados de Teste

- Usar factories quando houver codigo.
- Evitar fixtures grandes e opacas.
- Criar dados minimos para cada teste.
- Nao usar dados reais de curriculos ou certificados.

## Agentes de IA

Quando alterarem codigo, agentes devem:

- rodar os testes relevantes se existirem;
- nao inventar comandos;
- informar testes nao executados;
- adicionar testes junto com mudancas de comportamento.

## Comandos

Ainda nao existem comandos oficiais.

Quando o scaffold existir, registrar aqui:

```text
# backend
<backend test command>

# frontend
<frontend test command>

# e2e
<e2e test command>
```
