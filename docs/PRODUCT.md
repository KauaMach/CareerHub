# CareerHub - Produto

Este documento concentra contexto de produto: publico-alvo, personas, jornadas, modulos e requisitos. A visao resumida fica em `PROJECT.md`.

## Proposta de Valor

CareerHub ajuda profissionais a organizar a carreira em um unico lugar, com foco inicial em oportunidades, candidaturas, curriculos, empresas, certificados e acompanhamento de progresso.

## Publico-Alvo Inicial

Profissionais de tecnologia que:

- estao buscando novas oportunidades;
- aplicam para varias vagas ao mesmo tempo;
- precisam adaptar curriculos por objetivo;
- querem acompanhar historico e progresso;
- querem construir uma base confiavel para futuras analises com IA.

## Personas

### Lucas - Desenvolvedor em Transicao

Lucas e um desenvolvedor pleno buscando oportunidades melhores, possivelmente remotas ou internacionais.

Dores:

- controla candidaturas em planilhas;
- perde prazos e historico;
- nao sabe qual curriculo enviou para cada vaga;
- nao mede taxa de resposta.

Objetivos:

- centralizar vagas;
- acompanhar status no pipeline;
- manter curriculos organizados;
- medir progresso.

Prioridade: alta para o MVP.

### Mariana - Desenvolvedora em Evolucao

Mariana e uma profissional junior ou em crescimento que precisa organizar curriculos, certificados, estudos e portfolio.

Dores:

- certificados espalhados;
- projetos sem curadoria;
- falta clareza sobre evolucao profissional;
- dificuldade para priorizar estudos.

Objetivos:

- organizar perfil profissional;
- manter certificados e projetos;
- futuramente receber sugestoes de desenvolvimento.

Prioridade: media. Parte do perfil entra no MVP; estudos entram depois.

### Rafael - Profissional Focado em Concursos

Rafael organiza editais, cronogramas, disciplinas e estudos para concursos de tecnologia.

Dores:

- editais e prazos dispersos;
- planejamento manual;
- baixa visibilidade de progresso por disciplina.

Objetivos:

- centralizar concursos;
- montar plano de estudos;
- acompanhar simulados e desempenho.

Prioridade: baixa para o MVP. Deve ficar no roadmap futuro.

## Modulos de Produto

### Oportunidades

Inclui empresas, vagas, candidaturas, status, notas, checklist, prazos e entrevistas.

Requisitos iniciais:

- criar, editar, listar e excluir empresas;
- criar, editar, listar e excluir vagas;
- associar vaga a empresa;
- controlar status da candidatura;
- registrar notas e checklist;
- visualizar pipeline.

### Perfil Profissional

Inclui curriculos, certificados, projetos, habilidades e experiencias.

Requisitos iniciais:

- criar, editar, listar e excluir curriculos;
- criar, editar, listar e excluir certificados;
- registrar metadados basicos de certificados.

Futuro:

- projetos;
- habilidades;
- versionamento;
- exportacao;
- anexos;
- sugestoes com IA.

### Dashboard

Inclui indicadores operacionais do usuario.

Requisitos iniciais:

- total de vagas;
- candidaturas por status;
- proximos prazos;
- entrevistas agendadas quando o modulo existir;
- atividades recentes.

### Inteligencia de Carreira

Inclui ATS, comparacao vaga-curriculo, cartas, respostas para plataformas e simulacao de entrevistas.

Nao entra no MVP. Deve depender de dados bem modelados em vagas, curriculos e perfil.

### Desenvolvimento Profissional

Inclui estudos, networking, concursos, metas e roadmaps.

Nao entra no MVP. Deve ser desenhado depois de validar o core de oportunidades.

## Jornada Principal do MVP

1. Usuario cria conta.
2. Usuario cadastra empresas relevantes.
3. Usuario cadastra vagas.
4. Usuario move vagas pelo pipeline de candidatura.
5. Usuario registra notas, checklist e prazos.
6. Usuario cadastra curriculos e certificados.
7. Usuario acompanha progresso no dashboard.

## Fora do Escopo Inicial

- IA generativa.
- ATS automatico.
- Importacao por URL.
- Integracoes externas.
- Estudos e concursos.
- Networking avancado.
- App mobile.
- Marketplace.
- API publica.

## Criterios de Sucesso do MVP

- O usuario consegue abandonar uma planilha simples de candidaturas.
- O funil de vagas fica claro.
- O usuario consegue saber qual oportunidade exige qual proximo passo.
- Curriculos e certificados ficam organizados.
- O dashboard ajuda a decidir o que fazer em seguida.
