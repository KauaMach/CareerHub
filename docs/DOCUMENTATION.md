# CareerHub - Arquitetura da Documentacao

Este documento registra a analise critica da documentacao herdada do CareerOS e define como a documentacao do CareerHub deve ser organizada.

## 1. Referencias Analisadas

- `Arq/PROJECT_ANTIGO_CareerOS.md`
- `Referencia - Central de Carreira - Projeto Antigo/docs/PROJECT.md`
- `Referencia - Central de Carreira - Projeto Antigo/docs/ARCHITECTURE.md`
- `Referencia - Central de Carreira - Projeto Antigo/docs/SECURITY_AND_QUALITY_CHECKLIST.md`
- `Referencia - Central de Carreira - Projeto Antigo/docs/CONTRIBUTING.md`
- `Referencia - Central de Carreira - Projeto Antigo/README.md`
- `Referencia - Central de Carreira - Projeto Antigo/.ai/AGENTS.md`

## 2. Analise Critica

A documentacao antiga tem uma boa base conceitual, mas mistura niveis diferentes de decisao no mesmo lugar. O `PROJECT.md` antigo deixou de ser um documento de orientacao e passou a acumular produto, arquitetura, banco de dados, API, wireframes, cronograma, backlog e plano de execucao.

Esse formato e util em uma fase inicial de ideacao, mas fica caro para manutencao porque qualquer mudanca pequena pode exigir atualizacao em muitos trechos. Tambem dificulta o uso por agentes de IA, que precisam distinguir o que e visao de produto, regra obrigatoria, sugestao antiga, detalhe tecnico ou backlog ainda nao validado.

O documento antigo tambem assumia uma ambicao muito ampla para a fase atual: ATS com IA, concursos, estudos, networking, GitHub, LinkedIn, marketplace, PWA/offline, app mobile e API publica. Essas ideias podem continuar no horizonte, mas nao devem competir com o MVP.

## 3. Principais Problemas Encontrados

- Excesso de escopo no documento central.
- Duplicacao entre `PROJECT.md`, `ARCHITECTURE.md`, `README.md`, `CONTRIBUTING.md` e `AGENTS.md`.
- Roadmap detalhado demais e baseado em datas antigas.
- Modelagem completa de banco dentro da documentacao geral.
- Endpoints de API definidos antes da consolidacao do produto.
- Fluxos, wireframes e backlog misturados com visao estrategica.
- Stack tecnica descrita com justificativas longas no mesmo pacote da visao do produto.
- Checklists de seguranca com status inconsistentes.
- Instrucoes para agentes contendo arquitetura, padroes de API, variaveis de ambiente e SOPs em excesso.
- Uso do nome CareerOS em vez de consolidar a nova identidade CareerHub.

## 4. O Que Deve Ser Removido do PROJECT.md

Devem sair do `PROJECT.md`:

- modelagem completa de banco;
- diagramas ER;
- lista de endpoints;
- payloads de API;
- estrutura completa de diretorios;
- stack com justificativas extensas;
- padroes de codigo;
- convencoes de commit;
- detalhes de ambiente local;
- checklists de seguranca;
- fluxos detalhados;
- wireframes;
- backlog granular;
- cronograma com datas;
- detalhes de deploy, CI/CD e infraestrutura;
- procedimentos operacionais para agentes.

Esses assuntos continuam importantes, mas devem viver em documentos especificos.

## 5. O Que Deve Ser Simplificado

- Modulos devem ser agrupados em dominios principais, nao listados como dezenas de funcionalidades independentes.
- IA deve ser tratada como capacidade evolutiva, nao como dependencia do MVP.
- Concursos, estudos, networking e integracoes devem ficar como expansao, nao como escopo inicial.
- Roadmap deve ser orientado por fases e maturidade, nao por datas fixas sem validacao.
- Arquitetura deve comecar simples e permitir evolucao, evitando microservices, CQRS e filas antes da necessidade real.
- Personas completas devem sair do `PROJECT.md` e ir para `docs/PRODUCT.md`.

## 6. Proposta de Arquitetura da Documentacao

### `PROJECT.md`

Objetivo: ser o documento central do produto.

Deve conter:

- proposito;
- problema;
- visao de longo prazo;
- principios do produto;
- modulos principais;
- escopo do MVP;
- arquitetura em alto nivel;
- principios arquiteturais;
- objetivos;
- roadmap macro;
- mapa da documentacao.

Nao deve conter:

- banco detalhado;
- endpoints;
- stack extensiva;
- setup local;
- checklists;
- backlog granular;
- convencoes de codigo.

Relacao: aponta para todos os documentos especializados e deve permanecer curto.

### `README.md`

Objetivo: ser a entrada operacional do repositorio.

Deve conter:

- descricao curta;
- status do projeto;
- stack resumida;
- requisitos locais;
- comandos de setup;
- comandos de teste/lint;
- links para documentacao.

Nao deve conter:

- roadmap completo;
- arquitetura detalhada;
- regras de negocio;
- modelagem de banco.

Relacao: primeiro arquivo lido por humanos que querem rodar o projeto.

### `AGENTS.md`

Objetivo: orientar agentes de IA trabalhando no repositorio.

Deve conter:

- onde buscar contexto;
- regras de edicao;
- comandos seguros;
- padroes de validacao;
- limites de autonomia;
- checklist antes de finalizar uma tarefa.

Nao deve conter:

- toda a arquitetura;
- todos os endpoints;
- roadmap completo;
- documentacao duplicada do `PROJECT.md`.

Relacao: deve apontar para `PROJECT.md`, `RULES.md`, `docs/ARCHITECTURE.md` e `docs/CONTRIBUTING.md`.

### `RULES.md`

Objetivo: registrar regras obrigatorias e invariantes do projeto.

Deve conter:

- regras que nao podem ser violadas;
- padroes obrigatorios de seguranca;
- limites de escopo;
- invariantes de dados;
- definicoes que afetam revisao de PR.

Nao deve conter:

- explicacoes longas;
- tutoriais;
- detalhes historicos;
- decisoes opcionais.

Relacao: usado por humanos e agentes como fonte de restricoes.

### `docs/ARCHITECTURE.md`

Objetivo: descrever a arquitetura tecnica.

Deve conter:

- estilo arquitetural;
- stack decidida;
- limites entre frontend, backend, banco e storage;
- padroes tecnicos;
- diagramas tecnicos;
- decisoes arquiteturais;
- estrutura de diretorios quando existir.

Nao deve conter:

- estrategia de produto;
- roadmap de negocio;
- backlog de features;
- checklist operacional.

Relacao: detalha a secao tecnica resumida do `PROJECT.md`.

### `docs/SECURITY.md`

Objetivo: documentar o modelo de seguranca.

Deve conter:

- autenticacao e autorizacao;
- protecao de dados sensiveis;
- armazenamento de secrets;
- politicas de upload;
- CORS;
- rate limiting;
- ameacas conhecidas;
- privacidade.

Nao deve conter:

- checklist de execucao;
- status temporario de tarefas;
- comandos de CI.

Relacao: fonte conceitual para seguranca; o checklist operacional fica separado.

### `docs/SECURITY_AND_QUALITY_CHECKLIST.md`

Objetivo: checklist verificavel de seguranca, qualidade e release.

Deve conter:

- itens de seguranca;
- itens de teste;
- lint/typecheck;
- revisao de dependencias;
- criterios de merge/release;
- status rastreavel e atualizado.

Nao deve conter:

- explicacoes extensas de arquitetura;
- promessas de implementacao sem verificacao;
- duplicacao de `SECURITY.md`.

Relacao: transforma `SECURITY.md`, `CONTRIBUTING.md` e `ARCHITECTURE.md` em controles operacionais.

### `docs/ROADMAP.md`

Objetivo: acompanhar evolucao do produto.

Deve conter:

- fases;
- prioridades;
- milestones;
- criterios de aceite;
- dependencias;
- decisoes pendentes.

Nao deve conter:

- detalhes de implementacao;
- modelagem de banco;
- endpoints;
- comandos locais.

Relacao: detalha o roadmap macro do `PROJECT.md`.

### `docs/API.md`

Objetivo: documentar contratos HTTP.

Deve conter:

- convencoes de API;
- autenticacao nas rotas;
- endpoints;
- schemas de request/response;
- padrao de erro;
- paginacao;
- versionamento.

Nao deve conter:

- regras de produto extensas;
- modelagem interna do banco;
- detalhes de frontend.

Relacao: deve refletir a implementacao real e, quando possivel, complementar OpenAPI gerado.

### `docs/DATABASE.md`

Objetivo: documentar persistencia e modelo de dados.

Deve conter:

- entidades;
- relacionamentos;
- indices;
- constraints;
- convencoes de migracao;
- decisoes sobre dados sensiveis;
- estrategia de seed e fixtures.

Nao deve conter:

- endpoints;
- telas;
- roadmap;
- detalhes de deploy.

Relacao: aprofunda os dominios definidos em `PROJECT.md` e suporta `API.md`.

### `docs/CONTRIBUTING.md`

Objetivo: orientar contribuicoes.

Deve conter:

- fluxo de branches;
- commits;
- como abrir PR;
- como rodar testes;
- padroes de revisao;
- comandos de desenvolvimento.

Nao deve conter:

- visao de produto;
- documentacao completa da arquitetura;
- politicas de seguranca detalhadas.

Relacao: conecta trabalho diario com `RULES.md` e checklists.

### `docs/PRODUCT.md`

Objetivo: concentrar detalhes de produto.

Deve conter:

- personas;
- jornadas;
- requisitos funcionais;
- requisitos nao funcionais percebidos pelo usuario;
- criterios de aceite por modulo;
- fluxos de produto.

Nao deve conter:

- stack;
- estrutura de pastas;
- endpoints;
- tabelas de banco.

Relacao: detalha o "por que" e o "o que" antes da traducao tecnica.

### `docs/DECISIONS/`

Objetivo: registrar Architecture Decision Records.

Deve conter:

- decisoes relevantes;
- contexto;
- alternativas consideradas;
- decisao tomada;
- consequencias.

Nao deve conter:

- discussoes abertas sem conclusao;
- documentacao operacional.

Relacao: evita que decisoes importantes fiquem escondidas em conversas ou PRs.

## 7. Indice Completo Proposto

```text
.
|-- README.md
|-- PROJECT.md
|-- AGENTS.md
|-- RULES.md
`-- docs/
    |-- DOCUMENTATION.md
    |-- PRODUCT.md
    |-- DESIGN_SYSTEM.md
    |-- ARCHITECTURE.md
    |-- ROADMAP.md
    |-- API.md
    |-- DATABASE.md
    |-- SECURITY.md
    |-- SECURITY_AND_QUALITY_CHECKLIST.md
    |-- CONTRIBUTING.md
    |-- TESTING.md
    |-- DEPLOYMENT.md
    |-- OPERATIONS.md
    `-- DECISIONS/
        `-- 0001-initial-architecture-baseline.md
```

## 8. Regras de Manutencao

- O `PROJECT.md` deve ser curto e raramente mudar.
- Documentos especializados devem ser atualizados junto com a implementacao correspondente.
- Nenhuma informacao deve existir em dois lugares com o mesmo nivel de detalhe.
- Quando houver duplicacao inevitavel, o documento central deve conter apenas resumo e link.
- Checklists devem ter status verificavel, nao declaracoes aspiracionais.
- Agentes de IA devem ler `PROJECT.md`, `AGENTS.md` e o documento especializado da tarefa antes de editar.
- Toda decisao arquitetural relevante deve virar ADR.

## 9. Recomendacoes de Migracao

1. Usar o novo `PROJECT.md` como fonte central da visao CareerHub.
2. Mover personas e casos de uso antigos para `docs/PRODUCT.md`, simplificando os modulos.
3. Mover stack, diagramas e estrutura tecnica para `docs/ARCHITECTURE.md`.
4. Mover entidades e relacionamentos para `docs/DATABASE.md`, validando contra a implementacao real.
5. Mover endpoints para `docs/API.md` somente quando os contratos estiverem confirmados.
6. Revisar o checklist de seguranca para remover inconsistencias de status.
7. Criar `AGENTS.md` enxuto com instrucoes operacionais para IA.
8. Criar `RULES.md` apenas com invariantes e regras obrigatorias.
