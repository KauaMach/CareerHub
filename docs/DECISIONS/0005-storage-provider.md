# ADR 0005 - Estratégia de Storage e Arquivos

## Status

Accepted

## Context

O sistema passará a suportar o upload e gestão de arquivos pesados (ex: PDFs de Certificados, Currículos e futuramente anexos em observações de empresas). Manter arquivos presos ao disco local do servidor inviabiliza escalabilidade horizontal e compromete o backup, além de ferir a regra do "Twelve-Factor App" (Stateless Processes).

## Decision

Criar um padrão `StorageProvider` para abstrair completamente o local onde os arquivos são gravados.

O sistema inicializará com a seguinte cadeia ou configuração:
1. **LocalStorageProvider:** Apenas para ambiente de desenvolvimento local, gravando em `./uploads`.
2. **S3Provider / R2Provider:** Para ambientes de staging e produção, utilizando a interface padrão S3 compatível da AWS, Cloudflare R2 ou MinIO.

## Consequences

Benefícios:
- O servidor de aplicação (FastAPI) permanece "Stateless", podendo escalar livremente em containers (K8s / ECS).
- Flexibilidade total para trocar o Cloud Provider de storage sem reescrever o código de negócio.

Tradeoffs:
- O desenvolvimento local exigirá criação de diretórios e ignorar os uploads via `.gitignore`, ou subir um MinIO em Docker-Compose.
