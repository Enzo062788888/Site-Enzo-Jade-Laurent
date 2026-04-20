# Space Invader Game

Un jeu Space Invader développé avec JavaScript et Canvas HTML5.

## Organisation du Projet

```
Space invader/
├── spaceGame.js         # Fichier principal du jeu
├── vaisseau.js          # Classe Vaisseau (joueur)
├── vagues.js            # Classe Vagues (gestion des vagues et rochers)
├── rocher.js            # Classe Rocher (ennemis)
├── spaceinvader.html    # Fichier HTML principal
├── vaisseau.png         # Image du vaisseau
├── shell.png            # Image du bouclier
├── feu.png              # Image des tirs
├── rocher.png           # Image des rochers
├── Fond.png             # Image de fond
└── shieldobject-removebg-preview.png  # Image du bouclier objet
```

## Architecture et Design

### Classes Principales

1. **Vaisseau** (`vaisseau.js`)
   - Classe représentant le vaisseau du joueur
   - Propriétés : position (x, y), images, santé, bouclier
   - Méthodes : `draw(ctx)` pour l'affichage

2. **Vagues** (`vagues.js`)
   - Gère les vagues d'ennemis
   - Propriétés : numéro de vague, liste de rochers, objectifs
   - Méthodes : `update()`, `draw()`, `startWave()`, `nextWave()`
   - Difficultés crescendos à chaque vague

3. **Rocher** (`rocher.js`)
   - Classe représentant les ennemis
   - Propriétés : position, rayon, vitesse
   - Méthodes : `update()`, `draw()`, `isOutOfBounds()`

4. **Tirer** (classe interne dans spaceGame.js)
   - Représente les projectiles du joueur
   - Utilise `ctx.translate()` et `ctx.rotate()` pour les rotations

### Gestion d'États

Le jeu gère plusieurs états :
- `introActif` : afficher l'introduction
- `gameOver` : état de game over
- `vaisseau.shield` : bouclier de jeu de mots
- `vaisseau.shieldedFromRocks` : bouclier protecteur (1 coup)
- `shipHealth` : santé du vaisseau (0-3)

### Animation

- **requestAnimationFrame()** pour la boucle principale
- **setInterval()** uniquement pour les logs et affichages UI
- Pas de `setTimeout()` pour l'animation, seulement pour les délais de mécanique

## Bonus et Mécanique de Jeu

### Système de Bouclier
- **Bouclier de mots** : Un joueur doit taper des mots pour prolonger le bouclier
- **Bouclier protecteur** : Réduit de 1 coup de rocher

### Système de Santé
- Commence avec 3 cœurs (♥♥♥)
- Perd 1 cœur par collision avec un rocher
- Game Over à 0 cœurs

### Progression des Vagues
- Vague 1 : 10 rochers à détruire
- Vague 2 : 20 rochers à détruire
- À chaque vague : spawn rate diminue de 20% (devient plus difficile)

## Contrôles

- **Souris** : Position du vaisseau
- **Espace / Click** : Tirer
- **Clavier** : Taper les mots du bouclier

## Ressources et Références

### MOOC HTML5 - Recommandé
- Chapitres sur le dessin dans Canvas
- Chapitres sur l'animation avec requestAnimationFrame
- **IMPORTANT** : Chapitre sur les transformations géométriques
  - `ctx.translate()` : repositionner l'origine
  - `ctx.rotate()` : rotation
  - `ctx.save()` et `ctx.restore()` : sauvegarder/restaurer le contexte

### Bonnes Pratiques Appliquées ✓
- ✓ Organisation en classes et fichiers séparés
- ✓ Animation avec requestAnimationFrame()
- ✓ ctx.save() / ctx.restore() pour les transformations
- ✓ ctx.translate() et ctx.rotate() systématiquement appliqués à tous les objets
- ✓ Gestion d'états du jeu
- ✓ Collision detection optimisée
- ✓ **Écouteurs d'événements centralisés** dans la fonction `setupEventListeners()`
- ✓ Tous les objectes dessinés comme en (0,0) avec translate()

### Détails des Améliorations Récentes

#### Transformations Géométriques
Chaque classe utilise maintenant `ctx.translate()` et `ctx.rotate()` pour positionner les objets :

**Vaisseau.js** :
```javascript
ctx.save();
ctx.translate(centerX, centerY);  // Aller au centre du vaisseau
// Dessiner à l'origine (0,0)
ctx.drawImage(image, -w/2, -h/2, w, h);
ctx.restore();
```

**Rocher.js** :
```javascript
ctx.save();
ctx.translate(this.x, this.y);  // Aller au centre du rocher
// Dessiner à l'origine (0,0)
ctx.drawImage(image, -radius, -radius, diameter, diameter);
ctx.restore();
```

#### Écouteurs Centralisés
Tous les écouteurs d'événements sont maintenant dans la fonction `setupEventListeners()` :
- Contextmenu (prévenir le menu droit)
- Mouvements souris (position du vaisseau)
- Clavier (tirs, mots du bouclier, backspace)
- Resize (adapter le canvas à la fenêtre)

### À Améliorer en Futur
- Utiliser ctx.translate() et ctx.rotate() systématiquement pour TOUS les objets dessinés
- Centraliser davantage les écouteurs d'événements
- Ajouter des effets visuels (particules, flash)
- Ajouter de la musique/sons

## Hitbox et Collisions

- **Rochers** : Rayon × 0.7 (assez tolérant)
- **Vaisseau** : 60% de sa taille réelle (difficile à toucher)
- **Projectiles** : Rayon du rocher × 0.7

## Configuration Canvas

Le canvas s'adapte à la taille complète de la fenêtre du navigateur avec gestion du resize.

```javascript
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```

## Fichiers Modifiés et Corrections

Ce projet a été amélioré et corrigé pour :
1. Corriger les imports ES6 (Rocher.js → rocher.js)
2. Adapter les chemins d'images au bon dossier
3. Implémenter le système de vagues progressives
4. Ajouter la gestion complète du canvas fullscreen
5. Réduire les hitbox pour plus de précision

---

**Dernière mise à jour** : Février 2026
**Auteur** : Proyecto Space Invader
