# CareerHub - Database

Este documento define o modelo inicial de dados para o MVP. Ele deve evoluir junto com as migrations reais.

## Status

Modelo conceitual inicial. Ainda nao ha migrations no repositorio atual.

## Principios

- Banco relacional como fonte principal de verdade.
- UUID como identificador publico.
- Dados sempre isolados por usuario.
- Soft delete somente quando houver necessidade real de auditoria ou recuperacao.
- Campos sensiveis nunca devem ser armazenados em texto puro.
- Indices devem acompanhar consultas reais.

## Convencoes

- Tabelas em `snake_case`.
- Colunas em `snake_case`.
- Chaves primarias: `id`.
- Chaves estrangeiras: `<entity>_id`.
- Timestamps padrao: `created_at`, `updated_at`.
- Timestamps com timezone.
- Dinheiro deve usar decimal, nunca float.

## Entidades do MVP

### user

Representa uma conta.

Campos iniciais:

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

Regras:

- `email` unico.
- `password_hash` nunca deve ser retornado pela API.

### company

Empresa relacionada a vagas e processos.

Campos iniciais:

- `id`
- `user_id`
- `name`
- `website`
- `industry`
- `location`
- `notes`
- `created_at`
- `updated_at`

Regras:

- empresa pertence a um usuario.
- nome e obrigatorio.

### job

Vaga ou oportunidade acompanhada pelo usuario.

Campos iniciais:

- `id`
- `user_id`
- `company_id`
- `title`
- `description`
- `url`
- `status`
- `location`
- `work_model`
- `salary_min`
- `salary_max`
- `currency`
- `deadline`
- `notes`
- `checklist`
- `is_favorite`
- `applied_at`
- `created_at`
- `updated_at`

Status iniciais:

- `interested`
- `applied`
- `screening`
- `interview`
- `offer`
- `rejected`
- `withdrawn`

Regras:

- vaga pertence a um usuario.
- `company_id` pode ser nulo se a empresa ainda nao foi cadastrada.
- `salary_min` nao deve ser maior que `salary_max`.
- `checklist` pode iniciar como JSON simples e ser normalizado depois se necessario.

### resume

Curriculo mantido pelo usuario.

Campos iniciais:

- `id`
- `user_id`
- `title`
- `target_role`
- `content`
- `is_default`
- `created_at`
- `updated_at`

Regras:

- `content` pode iniciar como JSON estruturado.
- versionamento fica fora do MVP.

### certificate

Certificado ou credencial profissional.

Campos iniciais:

- `id`
- `user_id`
- `title`
- `institution`
- `category`
- `issue_date`
- `expiry_date`
- `credential_id`
- `credential_url`
- `file_url`
- `created_at`
- `updated_at`

Regras:

- `expiry_date` pode ser nulo.
- anexos dependem de storage configurado.

### activity_log

Registro simples de eventos relevantes para dashboard e auditoria leve.

Campos iniciais:

- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `action`
- `metadata`
- `created_at`

Regras:

- nao armazenar secrets em `metadata`.
- manter volume controlado no MVP.

## Relacionamentos

```text
user 1--N company
user 1--N job
user 1--N resume
user 1--N certificate
user 1--N activity_log
company 0--N job
```

## Indices Iniciais

- `user.email` unico.
- `company.user_id`.
- `company.user_id + company.name`.
- `job.user_id`.
- `job.user_id + job.status`.
- `job.user_id + job.deadline`.
- `job.company_id`.
- `resume.user_id`.
- `certificate.user_id`.
- `certificate.user_id + certificate.expiry_date`.
- `activity_log.user_id + activity_log.created_at`.

## Dados Sensiveis

- `password_hash`: nunca expor.
- API keys futuras: criptografia reversivel se persistidas.
- anexos: acesso autorizado por usuario.
- logs: nao registrar dados sensiveis.

## Fora do MVP

- `resume_version`.
- `job_attachment`.
- `interview`.
- `contact`.
- `study`.
- `exam`.
- `ats_analysis`.
- `cover_letter`.
- `ai_provider_settings`.

Essas entidades devem ser adicionadas por demanda validada e registradas em migrations.

## Migracoes

Quando o backend existir:

- toda alteracao estrutural deve ter migration;
- migrations devem ser revisadas junto com models;
- migrations nao devem depender de dados locais;
- alteracoes destrutivas exigem plano de migracao.
