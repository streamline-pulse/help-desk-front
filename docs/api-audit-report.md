# Rapport d’audit de l’API Help Desk

Date de l’audit : 5 juillet 2026  
API : `https://api.helpdesk.dev.streamline-pulse.com`  
Documentation : `https://api.helpdesk.dev.streamline-pulse.com/docs`  
Contrat analysé : OpenAPI `1.0.50`, 73 chemins, 106 opérations HTTP

## 1. Résumé exécutif

L’authentification administrateur fonctionne et donne accès aux ressources protégées. Les listes, les créations, les mises à jour et les suppressions des référentiels principaux fonctionnent globalement. Les données temporaires créées pendant l’audit ont été supprimées ; aucune donnée existante n’a été modifiée ou supprimée.

La couverture obtenue est de 103 opérations sur 106. Les trois opérations nécessitant un fichier préalablement créé (`GET /files/{id}`, `GET /files/groups/{groupId}/{id}` et `DELETE /files/groups/{groupId}/{id}`) n’ont pas pu être atteintes, car l’upload préalable échoue côté infrastructure. L’upload a utilisé `public/images/onboarding.svg` comme demandé.

Points bloquants ou importants :

- `POST /api/v1/files/groups/{groupId}` renvoie `500` : le bucket de stockage n’existe pas.
- `PUT /api/v1/groups-roles/{groupId}/{id}` renvoie `500` : le backend indique `groupId === undefined`.
- `GET /app/info/version` renvoie `422` : le handler retourne `{ name: "handler" }` alors que son schéma exige aussi `version`.
- Plusieurs erreurs métier attendues sont transformées en `500` (identifiants invalides, token Google invalide, token de reset invalide, invitation invalide). Elles devraient être des `400`, `401`, `404` ou `422` selon le cas.
- L’OpenAPI est incomplet ou trompeur sur plusieurs points : réponses d’erreur non documentées, absence de `servers`, résumés absents, types `Date` non standards, et contenus `multipart/form-data`/`text/plain` annoncés sur presque toutes les réponses JSON.
- L’API répond avec `Access-Control-Allow-Credentials: true` et `Access-Control-Allow-Origin: *`. Cette combinaison n’est pas utilisable par un navigateur pour des requêtes avec credentials. Le frontend contourne actuellement cela en lisant le JWT côté navigateur, ce qui expose le token au JavaScript.

## 2. Méthode et limites

- Lecture directe du document OpenAPI `/docs/json`, sans navigateur ni automatisation de navigateur.
- Authentification avec le compte fourni, sans consigner le mot de passe ni le JWT dans ce rapport.
- Appels HTTP réels sur l’environnement `dev`.
- Création de ressources portant un identifiant temporel `Audit`, puis suppression dans l’ordre inverse des dépendances.
- Aucun test du projet n’a été créé, modifié ou lancé.
- Pour les actions pouvant envoyer un message externe ou consommer un jeton tiers, utilisation de domaines non délivrables (`example.invalid`) ou de tokens invalides. Cela vérifie le routage et la gestion d’erreur sans contacter une vraie personne.
- Les parcours positifs Google OAuth, validation d’email, reset de mot de passe et acceptation d’invitation nécessitent de vrais tokens émis par leurs fournisseurs respectifs ; ils ne peuvent pas être validés intégralement avec les seuls accès fournis.

## 3. Résultats par domaine

| Domaine | Opérations documentées | Résultat |
|---|---:|---|
| Authentification | 7 | Connexion positive `200`. Les six autres routes sont joignables ; parcours positifs dépendants de tokens externes non réalisables. Mauvaise classification de plusieurs erreurs en `500`. |
| Historiques globaux | 1 | `GET /api/v1/histories` : `200`. |
| Langues | 5 | Liste, création, mise à jour, suppression et historiques : succès. |
| Modules | 5 | Liste, création, mise à jour, suppression et historiques : succès. |
| Permissions | 5 | Liste, création, mise à jour, suppression et historiques : succès. |
| Rôles globaux | 5 | CRUD et historiques : succès avec le payload réel `{ moduleId, permissionId }`. |
| Utilisateurs | 8 | Liste, détail, création, mise à jour, suppression, utilisateur courant et historiques : succès. `PUT /users/me/{id}` retourne correctement `404` pour un utilisateur inexistant. |
| Pays | 5 | CRUD et historiques : succès. Attention : une mise à jour du nom change le `slug`; il faut réutiliser le slug retourné. |
| Régions | 5 | CRUD et historiques : succès lorsque le `countrySlug` courant est utilisé. |
| Villes | 5 | CRUD et historiques : succès lorsque le `regionSlug` courant est utilisé. |
| Permissions de groupe | 5 | CRUD et historiques : succès. |
| Modules de groupe | 5 | CRUD et historiques : succès. |
| Types de groupe | 5 | CRUD et historiques : succès. |
| Groupes | 7 | Liste, groupes courants, détail, création, mise à jour, suppression et historiques : succès. |
| Rôles de groupe | 6 | Listes, création, suppression et historiques : succès. Mise à jour bloquée par un `500` backend. |
| Utilisateurs de groupe | 8 | Listes et filtres, création, mise à jour, suppression et historiques : succès. La route `/users/me/{userId}` retourne `403` pour un utilisateur différent de la session, comportement cohérent mais à documenter. |
| Invitations de groupe | 9 | Listes, filtres, création, génération, suppression et historiques : succès. Acceptation avec token invalide renvoie à tort `500`. |
| Fichiers | 7 | Listes globales/de groupe et historiques : `200`. Upload bloqué par le bucket absent ; par conséquent les deux lectures et la suppression nécessitant un `fileId` créé n’ont pas pu être validées. |
| Sandbox | 1 | `GET /api/v1/sandbox` : `200`. |
| Info application | 2 | Health check : `200`. Version : `422`, contrat de réponse cassé. |

## 4. Payloads et comportements à retenir

### Pagination et listes

Les listes retournent la forme :

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "perPage": 50,
  "pages": 0
}
```

Le frontend possède déjà une normalisation compatible. Les paramètres communs observés sont `page`, `perPage`, `search` et des filtres spécifiques à la ressource.

### Rôles globaux

Le payload de création/mise à jour attendu est :

```json
{
  "name": "Support",
  "permissionsPerModule": [
    {
      "moduleId": "uuid",
      "permissionId": "uuid"
    }
  ]
}
```

`permissionIds` au pluriel est rejeté en `422`. Le schéma frontend actuel utilise déjà la bonne forme singulière.

### Référentiels géographiques

- Région : `{ "name": "...", "countrySlug": "..." }`.
- Ville : `{ "name": "...", "regionSlug": "..." }`.
- Modifier le nom d’un pays, d’une région ou d’une ville régénère son slug.
- Après une mutation, invalider les listes parentes/enfants et utiliser l’entité retournée plutôt que de conserver l’ancien slug.

### Groupes

Création minimale : `{ "name": "..." }`. Champs optionnels : `logo`, `banner`, `description`, `email`, `website`, `parentId`, `typeId`, `location`.

Pour `location`, prévoir les champs `placeId`, `name`, `lat`, `long`, `townSlug`. La documentation décrit `lat` et `long` comme chaînes dans la requête, tandis que la réponse réelle contient des nombres : ce contrat doit être clarifié avant de figer les types frontend.

### Fichiers

L’upload est un `multipart/form-data` avec un champ obligatoire `file`. Ne pas fixer manuellement le header `Content-Type`; le client doit générer la boundary. Le backend doit d’abord provisionner/configurer le bucket attendu.

## 5. Défauts API à corriger avant intégration complète

### P0 — bloquants

1. Provisionner le bucket utilisé par le service de fichiers et vérifier les droits create/read/delete.
2. Corriger le contrôleur de `PUT /api/v1/groups-roles/{groupId}/{id}` afin de transmettre `groupId` au service.
3. Corriger `GET /app/info/version` pour retourner `{ name: string, version: string }` conformément au schéma.

### P1 — contrat et sécurité

1. Retourner des statuts sémantiques : connexion invalide `401`, token invalide `400/401/422`, ressource absente `404`, conflit `409`.
2. Documenter ces statuts et leurs corps dans l’OpenAPI, au lieu d’annoncer principalement `500`.
3. Remplacer les types OpenAPI `Date` par `string` avec `format: date-time`.
4. Déclarer le serveur de base, les descriptions, les exemples et les filtres de chaque liste.
5. Corriger les content-types documentés : JSON pour les réponses JSON, multipart uniquement pour les requêtes de fichiers/groupes contenant des fichiers.
6. Choisir une stratégie d’authentification navigateur cohérente :
   - recommandation : BFF Next.js et cookie `HttpOnly`, sans exposition du JWT au JavaScript ;
   - sinon : CORS avec une allowlist d’origines explicite et revue du risque XSS lié au token accessible au client.

### P2 — cohérence fonctionnelle

1. Documenter la sémantique de `/groups-users/.../users/me/{userId}` et envisager de supprimer `userId` si la route doit toujours représenter l’utilisateur courant.
2. Clarifier si `DELETE` réalise une suppression logique : les réponses observées mettent à jour `updatedAt` et les historiques restent disponibles.
3. Stabiliser le format de `location.lat/long` entre requêtes et réponses.
4. Documenter les règles d’unicité, dépendances empêchant une suppression et effets de cascade.

## 6. État actuel du frontend

Le projet dispose déjà de la chaîne `types/api → schemas → services → hooks/queries → components` pour environ 52 des 106 opérations :

- authentification email et utilisateur courant ;
- langues, modules, permissions, rôles et utilisateurs ;
- pays, régions et villes ;
- types, modules et permissions de groupe.

Les domaines non intégrés sont :

- historiques globaux et historiques par ressource ;
- groupes ;
- rôles de groupe ;
- membres de groupe ;
- invitations de groupe et acceptation ;
- fichiers ;
- sandbox et informations applicatives ;
- Google OAuth.

Risque architectural actuel : `src/lib/browser-api-client.ts` lit le cookie JWT via `document.cookie`, et `src/lib/auth-cookie.ts` configure explicitement `httpOnly: false`. Il faut décider si ce compromis est accepté. Pour une plateforme de support contenant potentiellement des données sensibles, le BFF avec cookie `HttpOnly` est préférable.

Le worktree contient déjà des modifications utilisateur non liées à cet audit, notamment sur la configuration des groupes. Elles n’ont pas été modifiées par cet audit.

## 7. Plan d’intégration recommandé

### Phase 0 — débloquer et figer le contrat

- Corriger les trois P0 backend.
- Exporter et versionner l’OpenAPI corrigé.
- Valider les statuts d’erreur, les filtres, la suppression logique et les payloads `location`.
- Décider BFF/`HttpOnly` versus appels directs/CORS avant d’ajouter les nouveaux services.

### Phase 1 — socle transversal

- Centraliser les query keys par domaine, avec hiérarchie groupe → sous-ressource.
- Ajouter les types communs d’historique, filtres, erreurs et réponses non paginées.
- Étendre le client HTTP pour `FormData`, téléchargement de blob et éventuellement progression d’upload.
- Uniformiser les invalidations : mutation d’une ressource, liste correspondante, détail, historiques et relations parentes.
- Ajouter une gestion UI explicite des `401`, `403`, `404`, `409`, `422` et erreurs d’infrastructure.

### Phase 2 — groupes

Créer, dans cet ordre :

1. `group.type.ts`, `group.schema.ts`, `group.service.ts`, `use-group.query.ts`.
2. Formulaire groupe avec type, parent, coordonnées et uploads logo/banner.
3. Pages liste/détail/édition, états loading/empty/error et permissions.
4. Invalidation des groupes courants après création, modification ou suppression.

### Phase 3 — contrôle d’accès au niveau groupe

- Rôles de groupe : utiliser `{ moduleId, permissionId }` par association si le backend confirme la même forme que les rôles globaux.
- Membres : sélection utilisateur/role avec libellés métier, jamais les UUID visibles.
- Appliquer les permissions reçues à la navigation et aux actions UI, tout en conservant le backend comme autorité finale.
- Bloquer temporairement l’édition d’un rôle de groupe tant que le P0 backend n’est pas corrigé.

### Phase 4 — invitations

- Listes toutes/actives/acceptées/expirées.
- Invitation par email et génération de lien.
- Page publique d’acceptation reliée à `routes.auth.acceptInvitation`.
- Gestion explicite des tokens expirés, consommés ou invalides et rafraîchissement membres/invitations après acceptation.

### Phase 5 — fichiers

- N’implémenter le flux final qu’après validation du bucket.
- Service multipart, types de métadonnées, hooks liste/détail/upload/delete.
- Contrôles frontend de taille/type uniquement pour l’UX ; le backend doit rester l’autorité.
- Prévisualisation/téléchargement selon le type, états de progression et erreurs de stockage.
- Invalider listes globale et de groupe après upload/suppression.

### Phase 6 — historiques et supervision

- Ajouter un écran d’audit générique capable d’afficher les historiques globaux et par domaine.
- Intégrer health check/version uniquement pour une vue technique si elle est utile au produit.
- Ne pas exposer `/sandbox` dans l’interface de production.

### Phase 7 — validation d’intégration

- Exécuter lint et build après chaque lot.
- Avec autorisation explicite dédiée, ajouter ensuite des tests de contrat des services et des tests d’intégration des hooks.
- Rejouer la matrice API sur un environnement isolé après correction backend, avec de vrais tokens contrôlés pour validation email, reset, invitation et Google OAuth.

## 8. Critères de fin

L’intégration peut être considérée complète lorsque :

- les 106 opérations ont une décision explicite : intégrée, réservée à l’administration technique, ou volontairement exclue ;
- les trois défauts P0 sont corrigés et revérifiés ;
- aucun JWT n’est exposé au navigateur sans décision de sécurité documentée ;
- tous les écrans gèrent loading, empty, error, forbidden et validation serveur ;
- toutes les sélections affichent des libellés métier et envoient les identifiants/slugs techniques ;
- les invalidations TanStack Query couvrent les listes, détails, relations et historiques concernés ;
- lint et build passent, puis les tests autorisés couvrent les flux critiques.
