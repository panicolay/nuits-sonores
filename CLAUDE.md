# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Mini-app (SPA) du programme des **jours 2 et 3 des Nuits Sonores 2026**. Voir [brief.md](brief.md) pour le cahier des charges et [liens-utiles.md](liens-utiles.md) pour les sources officielles. L'UI est en français (libellés, routes).

## Commandes

Gestionnaire de paquets : **pnpm** (cf. `pnpm-lock.yaml`).

- `pnpm dev` — Vite dev server
- `pnpm build` — `tsc -b && vite build` (le typecheck fait partie du build, il n'y a pas de script `lint` ni `test` séparé)
- `pnpm preview` — sert le build de production

Pas de framework de test configuré.

## Architecture

### Source de données unique : `programme.json`

Le fichier [programme.json](programme.json) à la racine est l'**unique source de vérité** pour tout le contenu (artistes, scènes, horaires, genres, moods, descriptions, artistes liés). Il est importé directement par TypeScript via `resolveJsonModule` (configuré dans [tsconfig.app.json](tsconfig.app.json), qui l'inclut explicitement) puis casté au type `ArtistSet[]`.

Toutes les vues dérivées (jours regroupés, comptes par genre/mood, lookups par slug) sont **calculées au chargement du module** dans [src/data/programme.ts](src/data/programme.ts). Les types vivent dans [src/data/types.ts](src/data/types.ts). Si la forme du JSON change, ces deux fichiers sont à mettre à jour ensemble.

### Routage par slug (français)

[src/router.tsx](src/router.tsx) déclare toutes les routes (`/`, `/jour/:dayId`, `/artiste/:slug`, `/decouvrir`, `/filtre/:type/:slug`). Les segments dynamiques sont des **slugs générés** par `slugify()` ([src/data/programme.ts:8](src/data/programme.ts#L8)), qui retire les diacritiques (NFD) puis remplace tout non-`[a-z0-9]` par `-`. Toute construction de lien ou résolution de paramètre doit passer par `slugify()` pour rester cohérente — ne jamais hardcoder un slug.

`dayId` suit la même logique mais à partir du libellé `jour` du JSON (`"Day 2"` → `"day-2"`).

### Structure des écrans

- [src/layouts/RootLayout.tsx](src/layouts/RootLayout.tsx) — shell global (Header + `<Outlet />`)
- [src/pages/](src/pages/) — un fichier par route, sans state global ; chaque page lit ses params et appelle les helpers de `data/programme.ts`
- [src/index.css](src/index.css) — CSS unique, classes BEM-ish (`day__list`, `filter__count`…)

Pas de state management, pas de fetch réseau, pas d'API : tout est synchrone et résolu à partir du JSON.

### Contraintes TypeScript

[tsconfig.app.json](tsconfig.app.json) active `strict`, `noUnusedLocals` et `noUnusedParameters` — un import ou paramètre non utilisé **casse le build**.

## Conventions

- Code et commentaires en anglais ; libellés UI et routes en français (cf. instructions globales)
- Préférer enrichir `programme.json` plutôt que de hardcoder du contenu dans les composants

## Workflow Git

Une fois la tâche terminée, poussée sur la branche de feature et validée (build OK), **merger automatiquement sur `main`** via les outils GitHub MCP, sans redemander confirmation :

1. `mcp__github__create_pull_request` — base `main`, head = branche courante
2. `mcp__github__merge_pull_request` — `merge_method: "squash"` (cohérent avec l'historique du repo)

Ne pas pousser de force ni merger si le build casse.
