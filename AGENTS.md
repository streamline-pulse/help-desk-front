<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Contexte du projet

- **Nom** : Help Desk Front
- **Objectif** : Interface frontend de la plateforme Help Desk CCMT.
- **Framework** : Next.js (App Router)
- **Langage** : TypeScript
- **Gestionnaire de paquets** : pnpm
- **UI** : React, Tailwind CSS, composants UI partagés
- **Données serveur** : TanStack Query
- **Formulaires** : TanStack Form + Zod
- **État client global** : Zustand
- **Internationalisation** : Aucune

---

# Commandes courantes

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
```

Utiliser les versions de Node.js et pnpm définies dans `package.json`, `.nvmrc` ou `.tool-versions`.

---

# Règles d’exécution

- Utiliser les dépendances déjà installées.
- Ne pas lancer `pnpm install`, modifier le lockfile, supprimer `node_modules` ou vider les caches sans autorisation explicite.
- Ne pas ajouter de dépendance lorsqu'une solution existe déjà dans le projet.
- Ne pas lancer de test sans autorisation explicite.
- Le lint et le build peuvent être utilisés pour valider une implémentation.
- Préserver les modifications existantes sans rapport avec la tâche.
- Ne jamais introduire de secret, token ou donnée sensible dans le dépôt.

---

# Principes d’architecture

Respecter les responsabilités suivantes :

```text
types/api
    ↓
schemas
    ↓
services
    ↓
hooks/queries
    ↓
components
```

## Types API

**Emplacement :**

```
src/types/api/
```

- Décrire uniquement les contrats de l'API.
- Aucun schéma Zod.
- Aucune logique métier.
- Conserver le contrat de l'API.

---

## Schémas

**Emplacement :**

```
src/schemas/
```

- Définir tous les schémas Zod.
- Dériver les types via `z.infer`.
- Centraliser les validations réutilisables.

---

## Services

**Emplacement :**

```
src/services/
```

- Contenir uniquement les appels HTTP.
- Utiliser le client HTTP partagé.
- Aucun hook React.
- Aucun toast.
- Aucune logique UI.

---

## Hooks de requêtes

**Emplacement :**

```
src/hooks/queries/
```

- Utiliser TanStack Query.
- Centraliser les clés de cache.
- Encapsuler les services.
- Gérer les invalidations.
- Exposer une API simple aux composants.

---

## Composants

- Les composants utilisent uniquement les hooks.
- Ils n'appellent jamais directement un service.
- Les composants partagés restent indépendants du métier.
- Les composants spécifiques à une page restent proches de cette page.

---

# Organisation recommandée

```text
src/
├── app/
│   ├── (public)/
│   ├── (authenticated)/
│   └── api/
├── components/
│   ├── ui/
│   └── shared/
├── config/
├── hooks/
│   └── queries/
├── lib/
├── provider/
├── schemas/
├── services/
├── stores/
├── types/
│   └── api/
└── utils/
```

### Description

- `app/` : routes Next.js.
- `components/ui/` : composants primitifs du Design System.
- `components/shared/` : composants réutilisables non liés à une fonctionnalité métier.
- `config/` : configuration et constantes.
- `hooks/` : hooks React.
- `lib/` : intégrations techniques.
- `provider/` : providers React.
- `schemas/` : validations Zod.
- `services/` : appels HTTP.
- `stores/` : stores Zustand.
- `types/api/` : contrats API.
- `utils/` : utilitaires purs.

---

# Conventions de nommage

Utiliser le **kebab-case**.

| Élément | Convention |
|----------|------------|
| Type API | `<resource>.type.ts` |
| Schéma | `<resource>.schema.ts` |
| Service | `<resource>.service.ts` |
| Hook Query | `use-<resource>.query.ts` |
| Hook | `use-<feature>.ts` |
| Store | `<resource>.store.ts` |
| Provider | `<name>.provider.tsx` |
| Formulaire | `<name>.form.tsx` |
| Modal | `<name>.modal.tsx` |
| Table | `<name>.table.tsx` |
| Header | `<name>.header.tsx` |

Règles :

- React → PascalCase
- Fonctions → camelCase
- Variables → camelCase
- Constantes → UPPER_SNAKE_CASE uniquement lorsqu'elles sont réellement constantes.
- Éviter les `index.ts` servant uniquement de barrel.

---

# Imports

- Utiliser l'alias `@/`.
- Éviter les chemins relatifs profonds.
- Importer directement le fichier source.
- Éviter les dépendances circulaires.

---

# Composants React

- Utiliser les Server Components par défaut.
- Ajouter `"use client"` uniquement lorsque nécessaire.
- Garder les composants déclaratifs.
- Déplacer la logique réutilisable dans des hooks.
- Éviter les effets inutiles.
- Ne jamais utiliser Zustand comme cache serveur.

---

# Appels API

- Utiliser un client HTTP unique.
- Tous les appels passent par les services.
- TanStack Query gère le cache.
- Les composants ne font jamais d'appel HTTP.
- Gérer explicitement les états loading, empty et error.

---

# Client HTTP (Ky)

- Tous les appels HTTP passent par une instance Ky unique.
- Configurer l'URL de base, les headers, l'authentification et les hooks dans un seul endroit.
- Les services ne doivent jamais créer leur propre instance Ky.
- Les services retournent des données typées et ne contiennent aucune logique d'affichage.
- Les erreurs globales sont gérées via les hooks Ky et TanStack Query.

---

# Formulaires

- Utiliser TanStack Form.
- Utiliser Zod pour toutes les validations.
- Dériver les types depuis les schémas.
- Afficher les erreurs serveur lorsqu'elles existent.
- Désactiver les actions pendant la soumission.
- Séparer validation, logique métier et présentation.

---

# État global

- Zustand uniquement pour un état partagé.
- Préférer l'état local lorsque possible.
- Préférer l'URL pour les filtres persistants.
- Ne jamais stocker de données sensibles.

---

# Routes

- Centraliser les routes dans :

```
src/config/routes.ts
```

- Utiliser des constantes.
- Utiliser les groupes de routes Next.js.
- Les composants spécifiques à une page restent dans `_components`.

---

# Authentification

- Centraliser la gestion des tokens.
- Les composants ne lisent jamais directement le localStorage.
- Protéger les routes côté serveur lorsque possible.
- Centraliser les permissions.

---

# Internationalisation

Aucune internationalisation n'est prévue pour ce projet.

Tous les textes peuvent être écrits directement dans les composants.

---

# Styles et composants UI

- Réutiliser un composant existant avant d'en créer un nouveau.
- `components/ui` contient uniquement les composants primitifs du Design System.
- Un composant placé dans `components/ui` doit pouvoir être réutilisé indépendamment du métier.
- Les composants métier ne doivent jamais être placés dans `components/ui`.
- Préférer les tokens du Design System aux valeurs arbitraires.
- Vérifier systématiquement les états :
  - focus
  - hover
  - disabled
  - loading
  - error
  - empty

---

# Qualité du code

- Indentation : 2 espaces.
- Éviter `any`.
- Préférer les retours anticipés.
- Supprimer le code mort.
- Ne pas commenter du code inutilement.
- Les commentaires doivent être en anglais.
- Une fonction = une responsabilité.

---

# Validation

Avant de terminer :

1. Vérifier le diff.
2. Vérifier les types.
3. Vérifier les imports.
4. Vérifier les conventions.
5. Exécuter le build ou le lint lorsque cela est autorisé.

---

# Décisions propres au projet

- **Authentification** : À définir
- **Client HTTP** : Ky
- **Gestion des erreurs** : Centralisée via le client Ky et TanStack Query
- **Notifications** : À définir
- **Permissions** : À définir
- **Persistance locale** : Zustand Persist (uniquement si nécessaire)
- **Pagination** : TanStack Query
- **Tests** : À définir
- **Déploiement** : À définir

---

<!-- END:nextjs-agent-rules -->
