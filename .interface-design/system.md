# Help Desk Front — Interface Design System

## Direction

L’interface est un outil opérationnel destiné aux administrateurs et agents du Help Desk. Elle doit permettre de parcourir, rechercher et modifier des données rapidement, avec une densité maîtrisée et une hiérarchie calme.

Principes directeurs :

- privilégier la lisibilité et l’efficacité aux éléments décoratifs ;
- conserver une seule action principale visible par vue ;
- utiliser la couleur pour l’état et l’action, jamais comme décoration ;
- rendre les dépendances métier visibles, notamment `Pays → Régions → Villes` et `Rôles → Modules → Permissions` ;
- utiliser les composants et tokens existants avant d’en créer de nouveaux.

## Monde visuel

Le produit s’appuie sur le vocabulaire d’un centre de support : file de traitement, référentiels, accès, responsabilités, statuts et traçabilité.

La palette reste celle de `src/app/globals.css` :

- fonds et surfaces neutres via `background`, `card` et `popover` ;
- structure discrète via `border`, `muted` et `muted-foreground` ;
- accent d’action unique via `primary` ;
- suppression et erreurs via `destructive` ;
- aucun dégradé, glow ou couleur arbitraire.

## Profondeur et surfaces

Stratégie principale : bordures discrètes et faibles variations de surface.

- page : `bg-background` ;
- table et contrôles : surface de page avec `border` ;
- en-têtes et sélections : `bg-muted/30` à `bg-muted/40` ;
- dialogues et menus : `bg-popover` avec le niveau d’élévation fourni par les primitives UI ;
- ne pas ajouter de carte autour d’un tableau uniquement pour le décorer ;
- réserver les ombres aux overlays et composants flottants existants.

## Espacement et rayons

- unité de base : 4 px ;
- contenu de page : marge horizontale `px-6` ;
- séparation majeure : multiples de 8 px ;
- contrôles denses : hauteurs `h-7` ou `h-8` ;
- utiliser l’échelle de rayon dérivée de `--radius` ;
- préférer `rounded-lg` pour tables, formulaires et contrôles groupés.

## Typographie

- utiliser `font-sans` pour l’interface et `font-heading` lorsqu’un composant existant le prévoit ;
- titre de page : `text-3xl`, `font-semibold`, `text-balance` ;
- descriptions : `text-pretty`, `text-muted-foreground` ;
- libellés et données importantes : `font-medium` ;
- nombres et pagination : `tabular-nums` ;
- textes denses : `truncate` ou `line-clamp` lorsque nécessaire ;
- ne pas ajouter de `tracking-*` sans décision explicite.

## Structure des pages métier

Ordre recommandé :

1. `PageHeader` avec contexte, titre et description ;
2. navigation locale lorsqu’un espace contient plusieurs ressources ;
3. barre d’outils du tableau ;
4. tableau, états et pagination.

Les espaces validés sont :

- Configuration : Langues, Pays, Régions, Villes ;
- Rôles et permissions : Rôles, Modules, Permissions.

Une navigation locale utilise des boutons-liens `ghost` et `secondary`. Avec Base UI, un bouton rendu comme lien doit déclarer `nativeButton={false}`.

## Data Table

Le Data Table partagé est la source de vérité pour les listes métier.

- pagination, recherche et filtres sont contrôlés par le serveur ;
- la recherche utilise un debounce de 300 à 500 ms et remet la page à 1 ;
- aucun tri local ne doit être présenté comme un tri global d’une collection serveur ;
- activer le tri seulement lorsqu’un endpoint expose un contrat de tri serveur ;
- afficher distinctement chargement initial, actualisation, vide, aucun résultat et erreur ;
- conserver les données précédentes pendant une actualisation paginée ;
- toutes les tables administratives proposent sélection multiple, export CSV et suppression groupée ;
- l’export porte sur la sélection lorsqu’elle existe, sinon sur les lignes visibles ;
- les valeurs numériques utilisent `tabular-nums`.

## Actions

- une ou deux actions de ligne : boutons visibles directement ;
- plus de deux actions : menu contextuel ;
- tout bouton icône seul possède un `aria-label` précis incluant la ressource ;
- toute suppression utilise `AlertDialog` ;
- afficher l’erreur de mutation dans le dialogue ou formulaire propriétaire ;
- désactiver les actions pendant la mutation ;
- éviter les notifications multiples pour une même erreur.

## Formulaires

- utiliser TanStack Form avec validation Zod centralisée ;
- utiliser les composants `Field`, `Input`, `Select` et `Checkbox` existants ;
- afficher les erreurs de champs à proximité immédiate ;
- afficher l’erreur globale en tête du formulaire ;
- utiliser un `Dialog` pour les créations et modifications courtes ;
- réinitialiser valeurs, erreurs et mutations à la fermeture ;
- rendre les relations métier avec des sélecteurs explicites ;
- rendre les droits d’un rôle sous forme de matrice Module × Permission.

## Accessibilité et interactions

- utiliser les primitives Base UI existantes pour dialogues, menus, selects et popovers ;
- ne pas reconstruire manuellement la gestion du clavier ou du focus ;
- préserver les états focus, hover, disabled, loading et error ;
- utiliser des boutons natifs sauf lorsqu’un composant est explicitement rendu comme lien ;
- ne jamais bloquer le collage dans les champs ;
- ne pas ajouter d’animation sans besoin explicite ;
- respecter les libellés accessibles, les régions `aria-live` et les états `aria-busy` existants.

## Règles de réutilisation

- les primitives génériques restent dans `src/components/ui` ;
- les patterns non métier réutilisables restent dans `src/components/shared` ;
- les variantes d’une ressource sont décrites par configuration plutôt que dupliquées ;
- ne pas créer un composant partagé pour un pattern utilisé une seule fois ;
- ne pas introduire de nouvelle couleur, police, ombre ou primitive tant que le système existant couvre le besoin.
