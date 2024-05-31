# ProjetAngularMBDSBack
# 15- RAHARIMANANTENA NY ONY Diary et 25- RAKOTOMANGA Hasindranto

## Fonctionnalités de l'étudiant
- **Interface de connexion :** Une interface de connexion pour se connecter.
- **Interface d'inscription :** Une interface d'inscription où l'étudiant peut créer manuellement son compte.
- **Interface d'accueil :** Une interface d'accueil pour voir la liste des matières et permettre d'accéder aux devoirs liés à chaque matière.
- **Interface des détails des matières :** Une interface permettant de voir la liste des devoirs rendus et non rendus, ainsi que leur état (en cours de correction ou corrigé). L'étudiant peut y voir la note et les remarques du professeur. Il y a aussi un filtre multi-critère de nom et un intervalle de date de début et de fin pour faciliter la recherche d’un devoir.
- **Interface de modification de profil :** Lors de l'inscription, l'élève n'a pas encore de photo. Cette interface permet de modifier le profil pour ajouter une photo.
- **Menu des devoirs :** Un menu affichant la liste des devoirs rendus et non rendus, regroupés par matière, avec une pagination pour faciliter la navigation.

## Fonctionnalités du professeur
- **Interface de connexion :** Une interface de connexion pour se connecter.
- **Interface accueil :** Une interface accueil pour voir la matière rattachée au professeur et permettre d’accéder aux boutons de modification et suppression de cette matière. Cela permet aussi de voir le nombre total des devoirs qui sont rattachés à la matière, le nombre total des devoirs rendus ainsi que le nombre total des devoirs non rendus.
- **Interface ajout devoir :** Une interface pour ajouter un nouveau devoir pour la matière du professeur.
- **Interface liste devoirs :** Une interface pour voir la liste de tous les devoirs qui sont rattachés à la matière du professeur, permettant aussi d’accéder aux boutons vers la page de détails, la modification et la suppression des devoirs.
- **Interface détails devoirs :** Une interface pour afficher les détails du devoir ainsi que de voir la liste des élèves qui ont réalisé le devoir. Cela permettra aussi au professeur de corriger les devoirs réalisés par les élèves et d’envoyer un mail en même temps pour notifier l’élève.
- **Interface devoirs rendus et non rendus :** Des interfaces pour afficher la liste des devoirs corrigés et la liste des devoirs non encore corrigés.
- **Interface ajout professeur :** Une interface pour ajouter d’autres professeurs pour avoir accès à l’application.
- **Interface liste des professeurs :** Une interface pour voir la liste de tous les professeurs.

## Installation
Avant de pouvoir exécuter ce projet sur votre machine, vous devez d'abord :
1. **Cloner le dépôt :**
   - Back : `git clone https://github.com/raharimanantenadiary/ProjetAngularMBDSBack.git`
   - Front : `git clone https://github.com/raharimanantenadiary/ProjetAngularMBDSFront.git`
2. **Installer les dépendances :**
   - Nodemailer : `npm install nodemailer`
   - Pour le lancement du projet, installez d’abord les dépendances avec `npm install`

## Exécution
Pour exécuter le projet, utilisez les commandes suivantes :
- `npm start` pour démarrer le back 
- `ng serve` pour démarrer le front

**NB :** Vous devrez lancer les commandes d’exécution du projet dans les répertoires où ils se trouvent.

## Outils utilisés
- Card
- Stepper
- Spinner
- Snack bar
- Drag and drop
- Scroll infini
- Pagination
- Filtre multi-critère
- Nav-bar et tool-bar

## Outils utilisés pour l’inscription
Nous avons utilisé du JWT (JSON Web Token) et bcrypt pour l’authentification et le hachage des mots de passe.

### Détails :
- **JWT (JSON Web Token) pour l'authentification :**
  - JWT permet de créer des tokens sécurisés qui sont utilisés pour vérifier l'identité des utilisateurs.
  - Chaque token contient des informations encodées sur l'utilisateur, ce qui permet de vérifier rapidement son identité sans avoir à interroger la base de données à chaque requête.
- **bcrypt pour le hachage des mots de passe :**
  - bcrypt est un algorithme de hachage puissant qui permet de sécuriser les mots de passe avant de les stocker dans la base de données.
  - Il utilise un salt unique pour chaque mot de passe, ce qui protège contre les attaques par dictionnaire et autres attaques similaires.

## Sécurité utilisateur
Afin de garantir que chaque utilisateur ne puisse pas voir les liens des autres utilisateurs, nous avons protégé les URL avec des Guards d'Angular pour assurer la sécurité des données.

## Difficultés rencontrées
- **Envoi de mail :** La configuration des paramètres a été un peu difficile, mais nous avons pu trouver des solutions grâce à des recherches.
- **Drag and drop :** L’adaptation du scroll infini dans la partie drag and drop a été un peu compliquée du côté de l'affichage.
