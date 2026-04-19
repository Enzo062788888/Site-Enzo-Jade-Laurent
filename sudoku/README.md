## Description

En solo : Laurent DUPUIS

SUDOKU est un jeu de puzzle classique implémenté en JavaScript vanilla. Le joueur doit compléter une grille de 9x9 avec des chiffres de 1 à 9, en respectant les règles du Sudoku : chaque ligne, chaque colonne et chaque bloc 3x3 doit contenir tous les chiffres de 1 à 9 sans répétition. Le jeu génère automatiquement des grilles complètes et valides, puis masque aléatoirement certaines cellules pour créer le puzzle.

## Fonctionnalités

- Génération automatique de grilles de Sudoku valides par backtracking
- Système de sélection de cellules intuitif
- Vérification en temps réel des réponses
- Compteur d'erreurs
- Indication visuelle des réponses correctes et incorrectes
- Possibilité de générer un nouveau niveau à tout moment

## Difficultés

La principale difficulté rencontrée a été l'implémentation de l'algorithme de génération de grilles valides. L'utilisation du backtracking avec un mélange aléatoire des nombres a permis de créer des grilles uniques à chaque partie. La gestion de la sélection des cellules et la correspondance entre l'index de la cellule dans le DOM et ses coordonnées dans la grille a également nécessité une attention particulière.

## Prompt IA

L'IA a été consultée pour optimiser l'algorithme de génération de grilles de Sudoku et pour améliorer la logique de validation des règles (vérification des lignes, colonnes et blocs 3x3).

## Points d'améliorations

- Ajouter différents niveaux de difficulté (facile, moyen, difficile) avec un nombre variable de cellules masquées
- Implémenter un système d'indices pour aider le joueur
- Ajouter un chronomètre pour mesurer le temps de résolution
- Permettre de marquer des notes dans les cellules (mode crayon)
- Sauvegarder la progression du joueur
- Améliorer le design avec des animations plus fluides
- Ajouter un système de score basé sur le temps et le nombre d'erreurs
