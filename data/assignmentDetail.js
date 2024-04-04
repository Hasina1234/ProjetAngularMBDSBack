const AssignmentDetail = require('../model/assignmentDetails');
const Assignment = require('../model/assignment');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

const idAssignment = "660eccb5c8ab0c19fcda0cf4";

const idAuteur1 = "660d54eec8711c4548f373e6";
const idAuteur2 = "660ec6765356470a8068b593";
const idAuteur3 = "660ecfd905f2c30758f0b205";

const details = [
  { assignment: idAssignment, auteur: idAuteur1 },
  { assignment: idAssignment, auteur: idAuteur2 },
  { assignment: idAssignment, auteur: idAuteur3, note: 14, remarque: 'Vous pouvez faire mieux', rendu: true }
];

AssignmentDetail.insertMany(details)
  .then((insertedDetails) => {
    const insertedDetailIds = insertedDetails.map(detail => detail._id);
    Assignment.findByIdAndUpdate(idAssignment, { $push: { details: { $each: insertedDetailIds } } })
      .then(() => console.log('Détails d\'assignment ajoutés avec succès à l\'assignment.'))
      .catch(err => console.error('Erreur lors de l\'ajout des détails d\'assignment à l\'assignment :', err));
  })
  .catch(err => console.error('Erreur lors de l\'insertion des détails d\'assignment :', err));
