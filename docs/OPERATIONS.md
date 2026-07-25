# CareerHub - Operations

Este documento descreve operacao, observabilidade e manutencao do CareerHub.

## Status

Diretrizes iniciais. Deve ser detalhado quando houver ambiente real.

## Objetivos

- Detectar falhas rapidamente.
- Investigar problemas sem expor dados sensiveis.
- Manter backups e recuperacao claros.
- Operar o MVP sem infraestrutura excessiva.

## Healthchecks

Quando o backend existir, expor healthcheck simples:

```text
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

Checks avancados para banco, storage e filas podem entrar depois.

## Logs

Logs devem permitir investigar:

- erros de API;
- falhas de autenticacao;
- lentidao;
- falhas de banco;
- problemas de storage;
- falhas de providers externos futuros.

Logs nao devem conter:

- senha;
- token;
- API key;
- arquivos;
- conteudo sensivel completo.

## Metricas

Metricas iniciais recomendadas:

- taxa de erro por rota;
- latencia por rota;
- volume de requests;
- falhas de login;
- uso de storage quando existir;
- tempo de queries relevantes.

## Alertas

Alertas iniciais:

- API fora do ar;
- taxa de erro alta;
- banco indisponivel;
- disco/storage perto do limite;
- falhas repetidas de login acima do normal.

## Backups

Banco de producao deve ter backup automatico.

Regras:

- testar restauracao periodicamente;
- proteger backups como dados sensiveis;
- documentar retencao;
- evitar exportar dados reais para desenvolvimento.

## Manutencao

Tarefas recorrentes:

- atualizar dependencias;
- revisar vulnerabilidades;
- revisar logs de erro;
- validar backups;
- revisar custos de infraestrutura;
- limpar artefatos temporarios.

## Incidentes

Fluxo minimo:

1. identificar impacto;
2. conter problema;
3. comunicar quando houver usuarios afetados;
4. corrigir;
5. validar;
6. registrar causa raiz e prevencao.

## Runbooks Futuros

Criar runbooks quando houver ambiente real para:

- API fora do ar;
- banco indisponivel;
- migration falhou;
- storage indisponivel;
- vazamento de secret;
- deploy com rollback.
