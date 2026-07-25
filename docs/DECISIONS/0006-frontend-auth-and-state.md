# ADR 0006 - Gestão de Estado Frontend e Autenticação (Next.js)

## Status

Accepted

## Context

A stack frontend utiliza Next.js (App Router), projetado para priorizar renderização Server-Side (SSR). Atualmente, a autenticação baseada em um token JWT guardado no `localStorage` paralisa as proteções Server-Side. Além disso, as buscas (fetches) usando puramente `useEffect` geram recarregamentos lentos e ausência de cache agressivo na UI.

## Decision

1. **Autenticação via HttpOnly Cookies:**
   - O armazenamento de token passará de `localStorage` para **Cookies HttpOnly**.
   - Isso permite que o `Middleware` do Next.js faça a inspeção do token antes da renderização e redirecione o usuário rapidamente. Reduz drasticamente a superfície de ataques XSS.

2. **Gestão de Fetch com React Query (ou SWR):**
   - Substituiremos as chamadas HTTP espalhadas em `useEffect` pelo uso de bibliotecas de cache State (TanStack React Query ou Vercel SWR).
   - Componentes deixarão de guardar "dados da API" no `useState`, delegando a responsabilidade de *stale-while-revalidate* e dedupicação para a biblioteca central.

## Consequences

Benefícios:
- O sistema parecerá "instantâneo" ao navegar entre abas (Analytics -> Vagas), pois o React Query retornará o dado de cache imediatamente enquanto o atualiza em background.
- SSR completo e segurança robusta de sessão (HttpOnly).

Tradeoffs:
- Curva de aprendizado inicial para quem está acostumado apenas com `fetch` e `useEffect`.
- Necessidade de gerenciar e invalidar caches explicitamente quando uma entidade for atualizada ou excluída.
