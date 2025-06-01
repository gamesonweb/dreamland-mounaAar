# CHESS'LAND– Jeu d'échecs 3D ♟️☁️✨

Bienvenue sur GameLand, mon projet d’échecs en 3D !
Ici, chaque case et chaque pièce sont modélisées en 3D grâce à BabylonJS, avec la logique de jeu gérée par chess.js. 
Le résultat : un plateau immersif dans ton navigateur, où tu peux cliquer sur une pièce, voir les déplacements possibles, et jouer contre une IA simple.

Lien du jeu : https://gamesonweb.github.io/dreamland-mounaAar/
Lien de la vidéo : https://www.canva.com/design/DAGo-RSzbFM/eKJmmytFR-HzuqXdVFoDfQ/watch?utm_content=DAGo-RSzbFM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=had4d5b7607
## Fonctionnalités principales

- Plateau 3D modélisé dans Blender et exporté au format .glb
- Pièces clonées dynamiquement et placées sur les cases
- Surlignage (HighlightLayer) des pièces sélectionnées et des cases légales
## Logique d’échecs via chess.js :
- Calcul des déplacements légaux
- Détection d’échec, échec et mat, promotion de pion
- Une IA basique qui joue un coup aléatoire après chaque coup humain
## Contrôles :
- Rotation/zoom de la caméra autour du plateau
- Vue du plateau du dessus 
- Clic sur une pièce pour la sélectionner, puis clic sur une case surlignée pour déplacer
- Activer désactiver la musique d'ambiance et/ou le son
## Technologies utilisées : 
### BabylonJS 7 :
- SceneLoader pour importer les .glb
- ArcRotateCamera, HemisphericLight, DirectionalLight, ShadowGenerator, HighlightLayer
### chess.js :
- Gère les règles d’échecs 
- Permet à l’IA de jouer un coup aléatoire
### Blender :
- Modélisation du plateau (cases nommées a1…h8) et des pièces
### HTML/CSS 
### Node.js / npm / Webpack 

## Comment jouer ? 
- Choisi la couleur de ton choix (noir ou blanc)
- Sélectionne la pièce de ta couleur de ton choix.
- Les cases où la pièce peut se déplacer se surlignent en jaune.
- Clique sur l’une de ces cases pour effectuer le déplacement.
- L’IA jouera ensuite un coup aléatoire.
- Continue jusqu’à ce qu’il y ait échec et mat.
- Recharge la page pour une nouvelle partie.

## Améliorations pas encore implémentées (manque de temps...)

Mise en place du temps de jeu (chronomètre) 
Gestion de bug 
Enrichir l’interface : bouton nouvelle partie et historique des parties.
Optimiser le rendu (shaders, textures, décor...)

# Merci d’avoir lu ! Amuse-toi bien sur Chess'Land 3D.
