# ProjetAngularMBDSBack

### Fonctionnalités de l'étudiant
	•	Interface de connexion : Une interface de connexion pour se connecter.
•	Interface d'inscription : Une interface d'inscription où l'étudiant peut créer manuellement son compte.
•	Interface d'accueil : Une interface d'accueil pour voir la liste des matières et permettre d'accéder aux devoirs liés à chaque matière.
•	Interface des détails des matières : Une interface permettant de voir la liste des devoirs rendus et non rendus, ainsi que leur état (en cours de correction ou corrigé). L'étudiant peut y voir la note et les remarques du professeur. Il y a aussi un filtre multi critère de nom et un intervalle de date de début et de fin pour faciliter la recherche d’un devoir.
•	Interface de modification de profil : Lors de l'inscription, l'élève n'a pas encore de photo. Cette interface permet de modifier le profil pour ajouter une photo.
•	Menu des devoirs : Un menu affichant la liste des devoirs rendus et non rendus, regroupés par matière, avec une pagination pour faciliter la navigation.

Fonctionnalités du professeur
•	Interface de connexion : Une interface de connexion pour se connecter.
•	Interface accueil : Une interface accueil pour voir la matière rattachée au professeur et permettre d’accéder aux boutons de modification et suppression de cette matière. Cela permet aussi de voir le nombre total des devoirs qui sont rattachées à la matière, le nombre total des devoirs rendus ainsi que le nombre total des devoirs non rendus.
•	Interface ajout devoir : Une interface pour ajouter un nouveau devoir pour la matière du professeur.
•	Interface liste devoirs : Une interface pour voir la liste de tous les devoirs qui sont rattachées à la matière du professeur, cela permet aussi d’accéder aux boutons vers la page détails, la modification et la suppression du devoirs.
•	Interface détails devoirs : Une interface pour afficher les détails du devoir ainsi que de voir la liste des élèves qui ont réalisés le devoir. Cela permettra aussi au professeur de corriger les devoirs réalisés par les élèves et d’envoyer un mail en même temps pour notifier l’élève.
•	Interface devoirs rendus et non rendus : Des interfaces pour afficher la liste des devoirs qui sont rendu (devoirs corrigés) et la liste des devoirs qui ne sont pas encore rendu (devoirs pas encore corrigés).
•	Interface ajout professeur : Une interface pour ajouter d’autres professeur pour avoir l’accès à l’application.
•	Interface liste des professeurs : Une interface pour voir la liste de tous les professeurs.
Installation :
	Avant de pouvoir exécuter ce projet sur votre machine, vous devez d’abords : 
	Cloner le dépôt : 
1.	Back :  ‘ git clone https://github.com/raharimanantenadiary/ProjetAngularMBDSBack.git ‘
2.	Front : ‘ git clone https://github.com/raharimanantenadiary/ProjetAngularMBDSFront.git ‘
	Installer les dépendances :
o	Nodemailer : ‘ npm install nodemailer ‘
o	Pour le lancement du projet installé lancé d’abord ‘npm install’ 
Exécution :
	Pour exécuter le projet, utilisez les commandes suivantes :
	‘ npm start ‘ pour démarrer le back 
	‘ ng serve ‘ pour démarrer le front
NB : Vous devrez lancer les commandes d’exécution du projet dans le répertoire dans lequel ils se trouvent
Outil utilisé :
•	Card 
•	Stepper
•	Spinner
•	Snack bar
•	Drag and drop
•	Scroll infinis 
•	Pagination
•	Filtre multi-critère
•	Nav-bar et tool-bar
Outil utilisé pour l’inscription :
•	On a utilisé du JWT (JSON Web Token) et du bycrypt pour l’authetification et et le hachage de mot de passe.
Détails :
JWT (JSON Web Token) pour l'authentification : 
o	JWT permet de créer des tokens sécurisés qui sont utilisés pour vérifier l'identité des utilisateurs.
o	Chaque token contient des informations encodées sur l'utilisateur, ce qui permet de vérifier rapidement son identité sans avoir à interroger la base de données à chaque requête.
           bcrypt pour le hachage des mots de passe : 
o	bcrypt est un algorithme de hachage puissant qui permet de sécuriser les mots de passe avant de les stocker dans la base de données.
o	Il utilise un salt unique pour chaque mot de passe, ce qui protège contre les attaques par dictionnaire et les attaques.
Sécurité utilisateur :
	Afin de garantir que chaque utilisateur ne puisse pas voir les liens des autres utilisateurs, nous avons protégé les URL avec des Guards d'Angular pour assurer la sécurité des donnéest des pages.

Difficultés rencontrées :
•	Send mail, la configuration des paramètres a été un peu difficile mais on a pu trouver des solutions grâce à des recherches
•	Drag and drop, l’adaptation du scroll infinis sur la partie drag and drop qui a été un peu dure coté affichage

