# Space Invader - Documentation Technique

## 1. Description du jeu

**Space Invader** est un jeu de tir et esquive top-down en JavaScript vanilla. Le joueur incarne un vaisseau spatial qui doit survivre à des vagues de rochers tombant du ciel. Le gameplay intègre un système de tir pour détruire les rochers, un système de santé (3 vies), et un mécanisme de bouclier débloqué via un mini-jeu de mots. Le jeu propose plusieurs vagues de difficulté progressive avec un score sauvegardé en localStorage.

## 2. Structure du projet

### Organisation du Projet

```
space_invader/
├── space_invader.html      # Fichier HTML principal (canvas et imports)
├── README.md               # Documentation technique
│
├── js/                     # Modules JavaScript
│   ├── spaceGame.js        # Boucle de jeu, HUD, gestion d'états
│   ├── vaisseau.js         # Classe Vaisseau (joueur)
│   ├── vagues.js           # Classe Vagues (gestion des vagues)
│   └── rocher.js           # Classe Rocher (ennemis)
│
└── asset/                  # Ressources graphiques
    ├── vaisseau.png        # Image du vaisseau
    ├── shell.png           # Image du bouclier
    ├── feu.png             # Image des projectiles
    ├── rocher.png          # Image des rochers
    ├── Fond.png            # Image de fond
    └── shieldobject-removebg-preview.png  # Variante bouclier
```

### Détails des Modules

Le projet est organisé en modules JavaScript répartis dans le dossier `js/` :

### **vaisseau.js**
Classe représentant le vaisseau du joueur. Elle gère :
- Les propriétés du vaisseau : position (x, y), dimensions (largeur, hauteur)
- Le système de bouclier (temporaire pour les mots, et temporaire après collision)
- L'état de mort du vaisseau
- Le rendu du vaisseau avec gestion des images (vaisseau normal, vaisseau avec bouclier, vaisseau mort)
- Un fallback en rectangle si les images ne se chargent pas

### **rocher.js**
Classe statique pour les ennemis (rochers). Elle contient :
- Une méthode statique `loadImage()` pour charger l'image partagée des rochers
- Le constructeur instancie chaque rocher avec un rayon, une position aléatoire en haut du canvas, et une vitesse de chute
- Gestion des collisions : détecte si un rocher sort du canvas
- Le rendu du rocher avec image ou fallback en cercle gris

### **vagues.js**
Classe gérant les vagues d'ennemis. Elle assure :
- Le système de progression : chaque vague augmente le nombre de rochers à tuer et accélère le spawn rate
- Le spawn progressif des rochers (respectant un nombre maximal)
- La mise à jour de tous les rochers (déplacement, suppression hors limites)
- Passage automatique à la vague suivante une fois tous les rochers éliminés
- Le rendu de tous les rochers visibles

### **spaceGame.js**
Fichier principal et cœur du jeu. Il contient :
- **Classe Tirer** : représente chaque projectile tiré par le joueur
- **Boucle de jeu** : `requestAnimationFrame` pour le rendu et les mises à jour
- **Gestion des assets** : chargement des images (vaisseau, rochers, tirs, bouclier, fond)
- **Système d'intro** : écran narratif de 8 secondes au démarrage
- **Système de tir** : délai entre les tirs, vérification des collisions
- **Système de vies** : le vaisseau perd une vie en touchant un rocher (sauf avec bouclier)
- **Système de bouclier** : mini-jeu de mots temporaire permettant d'étendre la durée du bouclier
- **HUD** : affichage du score, des vies restantes, du mot actuel (si bouclier actif), du timer
- **Écrans de jeu** : menu principal, pause, game over, victoire
- **Sauvegarde du score** : localStorage avec récupération du meilleur score

### **jeux.html**
Page HTML contenant le canvas et les imports des modules JavaScript. Elle intègre le CSS `jeu_style.css` pour la mise en page (canvas centré, style noir/pixel art).

### **css/jeu_style.css**
Feuille de style pour :
- Positionnement et dimensionnement du canvas
- Mise en page générale du jeu (fond noir)
- Import de police pixel art (Pixelify Sans depuis Google Fonts)
- Style des textes du HUD

## 3. Mécaniques clés

- **Déplacement** : souris (le vaisseau suit le curseur et reste dans les limites du canvas)
- **Tir** : barre d'espace (délai de 300ms entre les tirs)
- **Collision projectile-ennemi** : détection par distance (proximité entre projectile et rocher)
- **Mini-jeu de bouclier** : le joueur doit taper les lettres d'un mot aléatoire pour prolonger le bouclier (max 3 extensions par mot)
- **Santé du vaisseau** : 3 vies, perte de 1 vie au contact d'un rocher (le bouclier absorbe le coup sans perdre de vie)
- **Progression** : vague 1 = 10 rochers, vague 2 = 20 rochers, etc. Le spawn rate diminue de 20% par vague

## 4. Rôle de l'IA

L'IA a été utilisée à deux moments clés :

1. **Architecture générale** : Aide pour définir la structure du projet, comment découper en classes (vaisseau, rochers, vagues, projectiles), et comment organiser la boucle de jeu avec `requestAnimationFrame`.

2. **Rendu Canvas avancé** : Génération du code de dessin du vaisseau, des rochers et des projectiles avec gestion des transformations (translate, rotate) pour un rendu centré et rotatif. Cette contribution est signalée par des commentaires dans `vaisseau.js` et `rocher.js`.

**Travail effectué par le développeur** : Intégration complète du système de tir, collision projectile-ennemi, système d'intro narratif, mini-jeu de mots pour le bouclier, gestion des vies, HUD dynamique, écrans de jeu (menu/pause/game over), sauvegarde du score en localStorage, débogage des collisions et des transitions d'état, et optimisation du système d'assets.
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
