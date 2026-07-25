# CareerHub - Roadmap

Este documento detalha fases, prioridades e criterios de aceite. O resumo estrategico fica em `PROJECT.md`.

## Principios de Priorizacao

- Validar o fluxo principal antes de automacoes.
- Entregar valor operacional antes de inteligencia avancada.
- Evitar dependencias externas no MVP.
- Expandir somente depois que os dados centrais estiverem confiaveis.

## Fase 0 - Fundacao

Objetivo: preparar base documental e tecnica.

Entregas:

- documentacao central;
- arquitetura da documentacao;
- regras para agentes;
- regras obrigatorias;
- decisao de stack;
- scaffold inicial;
- ambiente local;
- padroes de qualidade.

Criterios de aceite:

- documentos base existem e nao duplicam responsabilidades;
- stack inicial foi decidida;
- README contem comandos reais assim que houver scaffold;
- agentes sabem onde buscar contexto.

## Fase 1 - MVP

Objetivo: substituir planilhas e arquivos soltos por um fluxo centralizado.

Entregas:

- autenticacao basica;
- empresas;
- vagas;
- pipeline de candidatura;
- notas e checklist;
- curriculos;
- certificados;
- dashboard operacional;
- responsividade basica.

Criterios de aceite:

- usuario cria conta e acessa area privada;
- usuario cadastra empresas;
- usuario cadastra vagas;
- usuario altera status de candidaturas;
- usuario registra notas e checklist por vaga;
- usuario cadastra curriculos;
- usuario cadastra certificados;
- dashboard mostra KPIs basicos.

## Fase 2 - Produto Util

Objetivo: melhorar o uso diario do produto.

Possiveis entregas:

- entrevistas;
- anexos em vagas e certificados;
- timeline de candidatura;
- filtros e busca;
- exportacao simples de curriculos;
- tags;
- lembretes simples;
- melhorias de UX.

Criterios de aceite:

- usuario consegue rastrear historico completo de uma candidatura;
- documentos importantes ficam associados ao contexto correto;
- o produto reduz retrabalho de acompanhamento.

## Fase 3 - Inteligencia

Objetivo: usar os dados acumulados para apoiar decisoes.

Possiveis entregas:

- analise de aderencia vaga-curriculo;
- score ATS;
- sugestoes de melhoria;
- geracao assistida de carta;
- simulacao de entrevista;
- providers de IA configuraveis;
- controle de custo e limites.

Criterios de aceite:

- IA e opcional;
- dados sensiveis sao protegidos;
- sugestoes sao rastreaveis e revisaveis pelo usuario;
- providers podem ser trocados sem alterar regras de produto.

## Fase 4 - Expansao

Objetivo: ampliar o ecossistema de carreira.

Possiveis entregas:

- estudos;
- concursos;
- networking;
- integracao GitHub;
- integracao LinkedIn;
- importacao de vagas;
- API publica;
- mobile ou PWA avancado;
- automacoes.

Criterios de aceite:

- expansoes nao quebram o core;
- modulos novos usam os mesmos principios de dominio;
- integracoes sao opcionais e isoladas.

## Decisoes Pendentes

- Ordem exata das features do MVP.
- Nivel de detalhe do dashboard inicial.
- Estrategia de anexos no MVP.
- Autenticacao local ou provider externo.
- Detalhes do scaffold inicial.

## Itens Rejeitados para o MVP

- Microservices.
- CQRS completo.
- Event sourcing.
- IA obrigatoria.
- App mobile nativo.
- Marketplace.
- API publica.
- Integracoes externas obrigatorias.
