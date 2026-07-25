# CareerHub - Project

Documento central do CareerHub. Ele define a visao do produto, o escopo atual, os modulos principais, os principios arquiteturais e os caminhos para a documentacao especializada.

## 1. Proposito

O CareerHub e uma plataforma para centralizar a gestao da carreira profissional em um unico lugar: oportunidades, candidaturas, curriculos, empresas, certificados, projetos, entrevistas e progresso.

O produto nasce como um hub pratico para organizar a busca por oportunidades e evolui gradualmente para uma plataforma inteligente de desenvolvimento de carreira.

## 2. Problema

Profissionais costumam gerenciar sua carreira com ferramentas fragmentadas:

- vagas em planilhas ou favoritos do navegador;
- curriculos espalhados em arquivos locais;
- certificados, projetos e experiencias sem organizacao;
- historico de candidaturas perdido em e-mails;
- pouca visibilidade sobre progresso, taxa de resposta e proximos passos.

O CareerHub resolve esse problema criando uma fonte unica de contexto sobre a carreira do usuario.

## 3. Visao de Longo Prazo

O CareerHub deve se tornar um assistente operacional de carreira: uma plataforma que combina organizacao, historico, analytics e inteligencia artificial para ajudar o usuario a tomar melhores decisoes profissionais.

A visao de longo prazo inclui:

- acompanhamento completo de oportunidades e processos seletivos;
- curriculos versionados e adaptaveis por objetivo profissional;
- analise de aderencia entre perfil, curriculo e vaga;
- organizacao de certificados, projetos, contatos e entrevistas;
- apoio a estudos, planos de evolucao e transicoes de carreira;
- integracoes futuras com GitHub, LinkedIn e plataformas de vagas;
- automacoes com IA sempre sob controle do usuario.

## 4. Principios do Produto

- Simplicidade antes de abrangencia: cada funcionalidade deve resolver uma dor real antes de ganhar automacoes avancadas.
- Evolucao incremental: o MVP deve validar o fluxo principal antes de expandir para IA, integracoes e modulos secundarios.
- Dados do usuario como ativo central: o produto deve preservar historico, contexto e rastreabilidade.
- Clareza para humanos e agentes de IA: documentacao modular, objetiva e sem duplicacao.
- Arquitetura escalavel sem excesso prematuro: preparar extensao futura sem transformar o MVP em uma plataforma complexa demais.

## 5. Usuarios-Alvo

O foco inicial e em profissionais de tecnologia que estao buscando novas oportunidades, organizando sua evolucao profissional ou preparando transicoes de carreira.

Personas detalhadas, jornadas e casos de uso devem ficar em `docs/PRODUCT.md`.

## 6. Modulos Principais

### 6.1 Oportunidades

Gerencia empresas, vagas, candidaturas, status do processo seletivo, notas, prazos, checklist e entrevistas.

Este e o modulo principal do MVP.

### 6.2 Perfil Profissional

Organiza curriculos, certificados, projetos, experiencias, habilidades e materiais usados em candidaturas.

No MVP, o foco e CRUD de curriculos e certificados. Versionamento, exportacao avancada e personalizacao por IA ficam para fases posteriores.

### 6.3 Dashboard

Apresenta indicadores simples sobre a jornada do usuario: candidaturas abertas, etapas do funil, proximos prazos, entrevistas e atividades recentes.

No MVP, o dashboard deve ser operacional, nao analitico demais.

### 6.4 Inteligencia de Carreira

Modulo evolutivo para analise ATS, sugestoes de melhoria, geracao de cartas, comparacao de vaga com curriculo, simulacao de entrevistas e planos de estudo.

Nao faz parte do core obrigatorio do MVP. Deve ser introduzido depois que os dados principais estiverem bem modelados.

### 6.5 Desenvolvimento Profissional

Agrupa estudos, roadmaps, concursos, networking e metas de carreira.

Essas funcionalidades sao importantes para a visao de longo prazo, mas devem entrar em fases posteriores para evitar excesso de escopo inicial.

## 7. Escopo do MVP

O MVP deve validar se o usuario consegue substituir planilhas e arquivos soltos por um fluxo centralizado de acompanhamento de carreira.

### Incluido

- Autenticacao basica.
- Cadastro e gerenciamento de empresas.
- Cadastro e gerenciamento de vagas.
- Pipeline de candidaturas com status.
- Notas e checklist por vaga.
- Cadastro e gerenciamento de curriculos.
- Cadastro e gerenciamento de certificados.
- Dashboard basico com KPIs operacionais.
- Interface responsiva.
- Tema claro/escuro se a stack de frontend ja suportar isso sem custo alto.

### Fora do MVP

- IA generativa.
- Analise ATS automatica.
- Integracoes com LinkedIn, GitHub ou plataformas de vagas.
- Marketplace de templates.
- Aplicativo mobile nativo.
- Modo offline completo.
- Concursos, estudos, Pomodoro e simulados.
- API publica.
- Automacoes complexas de notificacao.

## 8. Arquitetura em Alto Nivel

O CareerHub deve comecar como um monolito modular ou monorepo simples, separando claramente frontend, backend, banco de dados e documentacao.

Arquitetura recomendada:

- Frontend web para a experiencia do usuario.
- Backend HTTP para regras de aplicacao, autenticacao e persistencia.
- Banco relacional como fonte principal de dados.
- Storage de arquivos para certificados, curriculos exportados e anexos.
- Jobs assincronos apenas quando houver necessidade real.
- Integracoes externas isoladas por adaptadores.
- IA isolada atras de uma interface de provider, sem acoplar regras de produto a um fornecedor especifico.

Detalhes tecnicos, stack, diagramas, estrutura de pastas e decisoes devem ficar em `docs/ARCHITECTURE.md`.

## 9. Principios Arquiteturais

- Modularidade por dominio: vagas, empresas, curriculos, certificados e usuarios devem evoluir com baixo acoplamento.
- Regras de negocio fora da camada de transporte: controllers, rotas e telas nao devem concentrar logica de dominio.
- Contratos explicitos: APIs, schemas, eventos e modelos devem ser documentados nos arquivos especializados.
- Seguranca desde o inicio: autenticacao, autorizacao, validacao de entrada e protecao de dados sensiveis nao sao pos-MVP.
- Observabilidade proporcional: logs e erros rastreaveis desde cedo; metricas avancadas conforme o produto amadurecer.
- Evitar overengineering: filas, CQRS, event sourcing, microservices e cache distribuido so entram quando o problema justificar.

## 10. Objetivos do Projeto

- Reduzir a fragmentacao da gestao de carreira.
- Dar visibilidade ao funil de candidaturas.
- Manter historico confiavel de empresas, vagas, curriculos e certificados.
- Criar uma base de dados bem estruturada para futuras funcionalidades com IA.
- Permitir colaboracao eficiente entre desenvolvedores humanos e agentes de IA.
- Manter documentacao pequena, modular e atualizada.

## 11. Roadmap em Alto Nivel

### Fase 0 - Fundacao

Definir stack, estrutura inicial, autenticacao, padroes de qualidade, banco, ambiente local e documentacao base.

### Fase 1 - MVP

Entregar oportunidades, empresas, curriculos, certificados e dashboard operacional.

### Fase 2 - Produto Util

Adicionar entrevistas, anexos, timeline de candidatura, filtros melhores, exportacao simples de curriculos e melhorias de usabilidade.

### Fase 3 - Inteligencia

Adicionar analise ATS, sugestoes de melhoria, geracao assistida de conteudo, comparacao de vaga com curriculo e provedores de IA configuraveis.

### Fase 4 - Expansao

Adicionar estudos, networking, concursos, integracoes externas, automacoes, API publica e experiencias mobile/offline se houver demanda validada.

Roadmap detalhado, priorizacao e milestones devem ficar em `docs/ROADMAP.md`.

## 12. Mapa da Documentacao

- `README.md`: entrada rapida do repositorio, setup local e comandos principais.
- `PROJECT.md`: visao central do produto e escopo macro.
- `docs/DOCUMENTATION.md`: arquitetura da documentacao e regras de separacao entre arquivos.
- `docs/ARCHITECTURE.md`: arquitetura tecnica, stack, diagramas e decisoes.
- `docs/PRODUCT.md`: personas, jornadas, requisitos e regras de produto.
- `docs/ROADMAP.md`: fases, prioridades, milestones e criterios de aceite.
- `docs/API.md`: contratos HTTP, endpoints, payloads e erros.
- `docs/DATABASE.md`: modelagem, entidades, relacionamentos, indices e migracoes.
- `docs/SECURITY.md`: modelo de seguranca, privacidade, ameacas e controles.
- `docs/SECURITY_AND_QUALITY_CHECKLIST.md`: checklist operacional de seguranca e qualidade.
- `docs/TESTING.md`: estrategia de testes e validacao.
- `docs/DEPLOYMENT.md`: diretrizes de ambientes, deploy e rollback.
- `docs/OPERATIONS.md`: operacao, logs, metricas, backups e incidentes.
- `docs/DECISIONS/`: registros de decisoes arquiteturais.
- `docs/CONTRIBUTING.md`: fluxo de desenvolvimento, commits, branches, testes e revisao.
- `AGENTS.md`: instrucoes especificas para agentes de IA.
- `RULES.md`: regras obrigatorias e invariantes do projeto.

## 13. Regra de Manutencao

Sempre que uma decisao for especifica demais para este arquivo, ela deve ser movida para a documentacao especializada e referenciada aqui apenas em alto nivel.

O `PROJECT.md` deve responder: o que e o produto, por que ele existe, quais modulos importam, qual e o MVP e para onde ele esta indo.
