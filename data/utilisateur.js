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

const insererUtilisateur = async () => {
  try {
    const nouvelUtilisateur = new Utilisateur({
      nom: 'Mopolo',
      mail: 'mopolo@mail.com',
      mdp: await crypterMotDePasse('mt5'), 
      photo: null,
      role: 0
    });

    await nouvelUtilisateur.save();
    console.log('Utilisateur enregistré avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error);
  } finally {
    mongoose.connection.close();
  }
}

insererUtilisateur();
