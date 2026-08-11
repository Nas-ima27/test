# SGAS — Frontend

Système de Gestion et d'Archivage des Stages — interface web.

Stack : **React 18 + TypeScript + Vite + Tailwind CSS + React Router + TanStack Query + Axios + Recharts**.

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner VITE_API_URL vers votre backend NestJS
npm run dev
```

L'app tourne par défaut sur http://localhost:5173.

## Build de production

```bash
npm run build
npm run preview
```

## Architecture

Le code est organisé **par domaine métier**, pour matcher les modules du backend NestJS :

```
src/
├── api/            # client HTTP (Axios) partagé
├── types/          # types TypeScript par entité métier
├── components/
│   ├── layout/     # Sidebar, Topbar, AppLayout
│   └── ui/         # composants réutilisables (Badge, Avatar, Button...)
├── features/
│   ├── dashboard/
│   ├── users/            # gestion des comptes / accès
│   ├── stagiaires/
│   ├── encadrants/
│   ├── sujets/            # sujets de stage + détection de similarité
│   ├── candidatures/
│   ├── rapports/          # bibliothèque + workflow de validation
│   └── parametres/
├── App.tsx          # déclaration des routes
└── main.tsx          # point d'entrée (Router + QueryClientProvider)
```

Chaque module de `features/` contient :
- `XxxPage.tsx` — la page (UI)
- `api.ts` — hooks React Query (`useXxx`) + appels Axios
- `mock.ts` — données de démonstration

## Brancher le backend NestJS

Chaque fichier `features/*/api.ts` contient un flag :

```ts
const USE_MOCK = true; // passer à false une fois l'endpoint NestJS prêt
```

Passez-le à `false` module par module au fur et à mesure que les endpoints
correspondants (`/users`, `/stagiaires`, `/encadrants`, `/sujets`,
`/candidatures`, `/rapports`, `/dashboard/stats`) sont disponibles côté API.
Les appels Axios sont déjà écrits et pointent vers `VITE_API_URL`.

## Prochaines étapes suggérées

- Authentification (page de connexion + garde de route + stockage du JWT)
- Formulaire complet de création de sujet avec appel à
  `checkSujetSimilarity` (déjà préparé dans `features/sujets/api.ts`)
- Upload de fichiers pour le dépôt de rapports (`features/rapports`)
- Pagination réelle côté serveur pour les tables (Utilisateurs, Stagiaires)
- Gestion des rôles/permissions (Admin / Encadrant / RH) pour l'affichage
  conditionnel des actions
