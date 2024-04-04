const Assignment = require('../model/assignment');
const Matiere = require('../model/matieres');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err)); 

const idMatiere = "660ed17b0f5e3a2a40ec6f19";

const assignmentNoms = ['Mini projet', 'TP map reduce'];

const assignments = assignmentNoms.map(nom => {
  return new Assignment({
    nom: nom,
    dateDeRendu: new Date(), 
    matiere: idMatiere
  });
});

Assignment.insertMany(assignments)
  .then(() => console.log('Assignments créés avec succès.'))
  .catch(err => console.error('Erreur lors de la création des assignments :', err));
