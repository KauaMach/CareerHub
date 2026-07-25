# CareerHub - Produto

Este documento define os detalhes operacionais, modelagens de domínio e regras de negócio essenciais do CareerHub.

## Regra de Ouro: Zero Cartas de Apresentação
O sistema **NÃO** terá suporte para Cartas de Apresentação (Cover Letters).
Não haverá upload de cartas, geração de cartas por IA ou associação de cartas às vagas. O foco é otimização de currículos, métricas de conversão e gestão de funil.

## Modelagem do Domínio Principal: Vagas (Jobs)

A entidade `Vaga` é o "Centro de Comando" do CareerHub. Ela deve ser robusta o suficiente para suportar Analytics e cruzamento de dados com IA.

### Campos Essenciais
1. **Dados Estruturais:**
   - `id` e `user_id`
   - `company_id` (Opcional, gera histórico com empresas)
   - `resume_id` (Opcional no início, obrigatório ao aplicar. Essencial para rastrear qual currículo converte mais).

2. **O Núcleo da Vaga (Preparado para IA):**
   - `title`: Cargo (Ex: Engenheiro Backend).
   - `description`: Descritivo completo. Usado pela IA para calcular ATS Match Score.
   - `url`: Link original da vaga.
   - `source`: Origem (Ex: LinkedIn, Indicação). Métrica de ouro para saber qual canal funciona.
   - `seniority`: Estágio, Júnior, Pleno, Sênior, Especialista.
   - `work_model`: Remoto, Híbrido, Presencial.
   - `location` e `employment_type` (CLT, PJ).

3. **Dados Financeiros:**
   - `salary_min`, `salary_max`, `currency`, `benefits` (JSON).

4. **Pipeline e Métricas:**
   - `status`: BACKLOG, APPLIED, INTERVIEW, OFFER, REJECTED.
   - `applied_at` e `deadline`.
   - `rejection_reason`: Motivo da recusa (Ghosting, Falta de Fit, etc). Gera insights de falha.
   - `ats_match_score`: Nota de aderência calculada por IA.
   - `notes`.

## Modelagem do Domínio: Currículos (Resumes)
O currículo não é apenas um arquivo estático. Ele precisa ser rastreável.
O usuário pode ter N currículos (ex: "CV Frontend" e "CV Fullstack"). Ao vincular um currículo a uma Vaga (`resume_id`), o sistema consegue calcular:
- Qual currículo gera mais entrevistas.
- Qual currículo tem a maior taxa de aprovação técnica.

## Módulos do Sistema

### 1. Dashboard de Analytics
Deve exibir:
- Funil de vagas em tempo real.
- Taxa de conversão (Aplicações -> Entrevistas).
- Gráfico de origens que mais convertem.
- Gráfico de motivos de rejeição.

### 2. Kanban Board (Vagas)
Visualização clara do pipeline. Modal de inserção robusto permitindo classificar a vaga profundamente (Senioridade, Origem, Empresa) com rapidez.

### 3. Empresas e Networking
Repositório das empresas que o usuário mapeou, incluindo anotações de cultura e link do portal de vagas delas.

## Criterios de Sucesso do Produto
- O usuário percebe o CareerHub não como uma planilha gourmet, mas como um "Assessor de Carreira".
- O sistema consegue sugerir mudanças de rota (ex: "Você está sendo reprovado para vagas Sênior, tente aplicar para vagas Pleno onde seu ATS Score médio é 90%").
- O design UI/UX impressiona desde o primeiro clique.
