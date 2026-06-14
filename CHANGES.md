# Modifications - Preview d'image et positionnement

## Résumé des changements

J'ai ajouté une fonctionnalité complète de preview d'image dans l'éditeur principal avec la possibilité de placer l'image dans les embeds ou à l'extérieur.

## Fichiers modifiés

### 1. State Management (`state/source.ts`)
- **Ajouté** : Propriétés `imagePosition` et `imageEmbedIndex` au type `SourceState`
- **Ajouté** : Action `setImagePosition` pour gérer la position de l'image
- **Modifié** : Initialisation par défaut avec `imagePosition: "outside"`

### 2. Composant d'édition de position (`components/dashboard/guild/editor/image-position-editor.tsx`)
- **Nouveau fichier** : Composant permettant de choisir où placer l'image
- Deux options :
  - À l'extérieur des embeds (par défaut)
  - Dans un embed spécifique (avec sélection de l'embed cible)
- Affichage conditionnel basé sur l'existence d'une carte active

### 3. Éditeur principal (`components/dashboard/guild/editor/editor.tsx`)
- **Ajouté** : Import et intégration du composant `ImagePositionEditor`
- Placé entre `EmbedEditor` et `SaveButton` pour une meilleure UX

### 4. Fonction de parsing des messages (`lib/discord/text.tsx`)
- **Modifié** : `parseMessageToReactElement` accepte maintenant un paramètre `options` optionnel
- **Ajouté** : Support pour afficher l'image générée :
  - Dans un embed spécifique (via `imagePosition: "embed"` et `imageEmbedIndex`)
  - À l'extérieur des embeds (via `imagePosition: "outside"`)
- **Modifié** : `renderEmbed` accepte un paramètre `imageUrl` optionnel

### 5. Preview du message (`components/dashboard/guild/editor/message-preview.tsx`)
- **Ajouté** : Chargement dynamique de l'image générée basé sur `activeCardId`
- **Ajouté** : État de chargement avec spinner et message
- **Ajouté** : Passage des options d'image à `parseMessageToReactElement`
- Utilise la fonction `generateImage` pour créer la preview en temps réel

### 6. Preview dans le contexte Discord (`components/dashboard/guild/image-editor/components/message-context-preview.tsx`)
- **Nouveau fichier** : Preview de l'image dans un contexte Discord réaliste
- Affiche comment l'image apparaîtra dans un message Discord
- Synchronisé avec les modifications en temps réel du store de l'image card

### 7. Éditeur d'image (`components/dashboard/guild/image-editor/editor.tsx`)
- **Ajouté** : Intégration de `MessageContextPreview` dans la colonne de droite
- Permet de voir la preview de l'image dans son contexte Discord pendant l'édition

## Fonctionnalités ajoutées

### 1. Sélection de la position de l'image
- Interface claire avec deux options radio :
  - **À l'extérieur des embeds** : L'image apparaît comme un attachement séparé
  - **Dans un embed** : L'image est intégrée dans un embed spécifique

### 2. Preview en temps réel
- L'éditeur principal affiche maintenant la preview de l'image générée
- La position de l'image est respectée dans la preview
- Indicateur de chargement pendant la génération de l'image

### 3. Preview contextuelle dans l'éditeur d'image
- Nouvelle section dans l'éditeur d'image montrant comment l'image apparaîtra dans Discord
- Mise à jour automatique lors de modifications de la configuration

## Comportement

1. **Par défaut** : Si une carte d'image est active (`activeCardId`), elle est placée à l'extérieur des embeds
2. **Changement de position** : L'utilisateur peut changer via le composant `ImagePositionEditor`
3. **Sélection d'embed** : Si "Dans un embed" est sélectionné, un second sélecteur apparaît pour choisir l'embed cible
4. **Preview synchronisée** : Les changements sont immédiatement reflétés dans la preview du message

## Améliorations futures possibles

1. Persister `imagePosition` et `imageEmbedIndex` dans la base de données
2. Ajouter plus d'options de positionnement (thumbnail vs image)
3. Améliorer le cache des images générées pour réduire les appels
4. Ajouter une option pour désactiver temporairement l'image sans supprimer la carte

## Notes techniques

- Utilise Zustand pour la gestion d'état
- Compatible avec la structure existante des stores
- Pas de breaking changes sur l'API existante
- Backward compatible (position par défaut si non spécifiée)
