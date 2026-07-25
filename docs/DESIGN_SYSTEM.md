# CareerHub - Design System

Este documento centraliza as regras de interface, identidade visual e bibliotecas de componentes do frontend, garantindo que o visual do CareerHub seja moderno, consistente e fiel a referencia original.

## 1. Stack Visual e Bibliotecas

A stack de interface foi escolhida para entregar alta qualidade visual com baixo acoplamento:

- **Tailwind CSS (v4):** Motor principal de estilisticas utility-first.
- **Shadcn UI:** Base de componentes prontos (copiados para o repositorio), permitindo customizacao total.
- **Base UI / Radix:** Fornece a fundacao headless e acessibilidade (ARIA, focus trap) para o Shadcn.
- **Framer Motion:** Responsavel pelas animacoes fluidas e transicoes de tela.
- **Lucide React:** Biblioteca oficial de icones.
- **Next Themes:** Gerenciamento seguro de transicao entre Modo Claro e Escuro.

## 2. Paleta de Cores (Themes)

O design adota o padrao de Variaveis CSS do Shadcn UI, priorizando uma paleta neutra e profissional.

### Modo Claro (Light Mode)
- **Background:** Branco (`#ffffff`) ou Cinza muito claro (`#fafafa`).
- **Foreground:** Texto quase preto (`#09090b`).
- **Primary:** Cor de destaque e acoes principais (ex: Negro `#18181b` ou Azul forte).
- **Borders & Muted:** Cinzas suaves (`#e4e4e7`, `#f4f4f5`) para delimitacao sutil.

### Modo Escuro (Dark Mode)
- **Background:** Cinza muito escuro ou quase preto (`#09090b`).
- **Foreground:** Texto claro (`#fafafa`).
- **Primary:** Branco (`#fafafa`) para alto contraste em acoes principais.
- **Borders & Muted:** Cinzas escuros (`#27272a`) para delimitar cards e modais.

### Feedback Semantico
- **Destructive (Erro):** Vermelho padrao (`#ef4444`).
- **Success:** Verde suave (`#10b981`).
- **Warning:** Amarelo/Laranja (`#f59e0b`).

## 3. Tipografia

- **Fonte Principal:** Familia Sans-Serif moderna (ex: `Inter`, `Geist Sans` ou `Roboto`).
- Tamanhos padronizados pelo Tailwind:
  - `text-xs` (12px) e `text-sm` (14px) para labels e metadados.
  - `text-base` (16px) para corpo de texto.
  - `text-lg` (18px) a `text-2xl` (24px) para titulos de sessoes.
  - `text-3xl` e `text-4xl` para titulos de paginas (Hero).

## 4. Animacoes e Micro-interacoes

Um design premium requer movimento. O CareerHub utiliza:

- **Hover & Focus:** Todo botao, link e card clicavel deve ter feedback instantaneo via Tailwind (`hover:bg-accent`, `transition-colors`, `duration-200`).
- **Framer Motion:** 
  - Usado para montar paginas (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
  - Animacoes de listas e drag-and-drop quando necessarios.
  - Modais, tooltips e menus dropdown (combinado com as animacoes padrao do Shadcn).

## 5. Diretrizes de Codigo UI

1. **Evite CSS Customizado:** 99% das necessidades de layout devem ser resolvidas com classes do Tailwind.
2. **Componentes Isolados:** Se uma combinacao de classes se repetir 3 ou mais vezes, ela deve virar um componente (ex: `Button`, `Badge`, `JobCard`).
3. **Sempre pense no Dark Mode:** Ao declarar uma cor como `bg-white`, lembre-se de declarar seu equivalente `dark:bg-zinc-950`.
4. **Responsividade Mobile-First:** Projete a interface para celular primeiro (`p-4`), e expanda para telas maiores (`md:p-8`).
