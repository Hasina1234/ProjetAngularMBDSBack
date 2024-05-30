const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('../model/utilisateurs');

mongoose.connect('mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

const crypterMotDePasse = async (mdp) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(mdp, saltRounds);
    return hash;
}

const utilisateurs = [
    { nom: 'Jean Dupont', mail: 'jean@gmail.com' },
    { nom: 'Marie Martin', mail: 'marie@gmail.com' },
    { nom: 'Pierre Durand', mail: 'pierred@gmail.com' },
    { nom: 'Sophie Leroy', mail: 'sophie@gmail.com' },
    { nom: 'Lucie Lefevre', mail: 'lucie@gmail.com' },
    { nom: 'Thomas Moreau', mail: 'thomas@gmail.com' },
    { nom: 'Julie Laurent', mail: 'julie@gmail.com' },
    { nom: 'Nicolas Michel', mail: 'nicolas@gmail.com' },
    { nom: 'Camille Garcia', mail: 'camille@gmail.com' },
    { nom: 'Alexandre Petit', mail: 'alexandre@gmail.com' }
];

const insererUtilisateurs = async (utilisateurs) => {
    try {
        const motDePasse = await crypterMotDePasse('a'); // Mot de passe commun pour tous les utilisateurs
        const utilisateursEnregistres = [];

        for (const utilisateur of utilisateurs) {
            const nouvelUtilisateur = new Utilisateur({
                nom: utilisateur.nom,
                mail: utilisateur.mail,
                mdp: motDePasse,
                photo: null,
                role: 0
            });

            utilisateursEnregistres.push(nouvelUtilisateur);
        }

        await Utilisateur.insertMany(utilisateursEnregistres);
        console.log(`${utilisateurs.length} utilisateurs enregistrés avec succès.`);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des utilisateurs :', error);
    } finally {
        mongoose.connection.close();
    }
}

insererUtilisateurs(utilisateurs);
