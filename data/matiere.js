const mongoose = require('mongoose');
const Matiere = require('../model/matieres'); 

mongoose.connect('mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));


const idProfesseur = "660ed04cecfd160b08f8fb7d";

const insererMatiere = async () => {
  try {
    const nouvelleMatiere = new Matiere({
      nom: 'Oracle',
      photo: 'oracle.png',
      prof: idProfesseur 
    });
    await nouvelleMatiere.save();
    console.log('Matière enregistrée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la matière :', error);
  } finally {
    mongoose.connection.close(); 
  }
}

insererMatiere();
