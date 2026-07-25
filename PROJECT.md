# CareerHub - Project

Documento central do CareerHub. Ele define a visão do produto, o escopo, os módulos principais, os princípios arquiteturais e os caminhos para a documentação especializada.

## 1. Propósito

O CareerHub é a plataforma definitiva e completa para a gestão de carreira profissional: oportunidades, candidaturas, currículos otimizados, empresas, certificados, analytics e histórico detalhado.

Diferente de um simples Trello ou Kanban, o CareerHub atua como um "Motor de Analytics" de carreira, cruzando dados de aplicações, currículos e feedback para fornecer insights reais sobre o desempenho do usuário no mercado de trabalho, preparando o terreno para automações inteligentes (IA).

## 2. Problema

Profissionais costumam gerenciar sua carreira com ferramentas fragmentadas:
- vagas em planilhas ou favoritos do navegador;
- currículos espalhados em arquivos locais sem saber qual performa melhor;
- falta de visibilidade sobre taxa de conversão (ex: qual modelo de vaga ou currículo aprova mais);
- motivos de rejeição esquecidos, impedindo a evolução direcionada.

O CareerHub resolve esse problema sendo o "Centro de Comando" robusto do profissional de tecnologia.

## 3. Visão do Produto

O CareerHub é um assistente operacional de carreira completo. A visão do produto engloba:
- Acompanhamento completo de oportunidades e processos seletivos com dados detalhados (origem, senioridade, salário, motivos de rejeição).
- Associação obrigatória entre Vaga e Currículo para gerar o "Match Score" e métricas de sucesso.
- Analytics profundos sobre o pipeline de vagas.
- Organização de empresas, certificados e networking.
- *Nota: Cartas de Apresentação (Cover Letters) estão permanentemente fora do escopo do sistema.*

## 4. Princípios do Produto

- **Robustez Estrutural:** A modelagem de dados deve ser completa desde o início, suportando cruzamento de informações e inteligência artificial nativamente.
- **Métricas Acionáveis:** Tudo o que é cadastrado deve gerar valor em dashboards e relatórios de conversão.
- **Experiência Premium:** O design e a usabilidade devem encantar o usuário, fugindo de interfaces "cruas" ou puramente utilitárias.
- **IA como Aliada:** A inteligência artificial deve ler descrições de vagas e currículos para sugerir melhorias de "Fit", sem tirar o controle do usuário.

## 5. Módulos Principais

### 5.1 Oportunidades (O Motor Principal)
Gerencia o Kanban de vagas de forma avançada. Inclui senioridade, modelo de trabalho, benefícios, origem da vaga (fonte), motivos de rejeição e associação direta com a empresa e o currículo utilizado.

### 5.2 Perfil e Currículos
Organiza múltiplos currículos. Em vez de apenas salvar PDFs, o sistema rastreia qual currículo foi usado em qual vaga, permitindo calcular o desempenho de cada versão. Inclui gestão de certificados.

### 5.3 Analytics e Dashboard
Apresenta indicadores complexos de forma simples: taxa de conversão geral, conversão por currículo, taxa de rejeição técnica vs fit cultural, funil em tempo real.

### 5.4 Inteligência de Carreira (ATS Score)
Algoritmos e integrações com IA para calcular a aderência (ATS Score) entre o texto do currículo do usuário e a descrição completa da vaga salva no sistema.

## 6. Arquitetura em Alto Nível

- **Frontend:** Next.js, React, TailwindCSS, Shadcn UI. Focado em uma estética "WOW", suporte a Dark Mode, transições fluidas e componentes ricos.
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, Alembic para migrations estruturadas.
- **Autenticação:** JWT nativa com senhas criptografadas via bcrypt.

Detalhes técnicos, diagramas e decisões arquiteturais devem ficar em `docs/ARCHITECTURE.md`.

## 7. Mapa da Documentação

- `README.md`: Setup local e comandos principais.
- `PROJECT.md`: Visão central e escopo macro (este documento).
- `docs/PRODUCT.md`: Modelagem detalhada do produto, regras de negócios e requisitos.
- `docs/ROADMAP.md`: Fases de evolução e marcos de entrega.
- `docs/ARCHITECTURE.md`: Arquitetura técnica e stack.
- `AGENTS.md`: Instruções para agentes de IA.
