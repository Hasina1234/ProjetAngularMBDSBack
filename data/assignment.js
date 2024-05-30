const Assignment = require('../model/assignment');
const Matiere = require('../model/matieres');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err)); 

// Liste des noms d'assignments génériques
const genericAssignmentNoms = [
  'Mini Project', 'Map Reduce Task', 'Homework 1', 'Final Exam', 
  'Group Project', 'Presentation', 'Research Report', 
  'Case Study', 'Quiz 1', 'Lab Work 1', 'Practical Exam', 'Midterm Exam', 
  'Homework Assignment', 'Essay', 'Research Paper', 'Final Project', 
  'Simulation', 'Field Study', 'Technical Report', 'Class Test 1',
  'Assignment 1', 'Project Report', 'Code Review', 'Practical Test',
  'Literature Review', 'Design Document', 'Implementation Task'
];

// Données des matières
const matieres = [
  { _id: "6651f6d492a70f0bc04f8140", nom: "Sql 3" },
  { _id: "6651f6e792a70f0bc04f8145", nom: "Big Data" },
  { _id: "6651f71b92a70f0bc04f814d", nom: "IOS" },
  { _id: "6657203be9b54a57b0005057", nom: "Tuning-1" },
  { _id: "665725099647f557b8c71abb", nom: "Hadoop spark" },
  { _id: "6657820d1cb089005590f317", nom: "JAKARTA EE" }
];

async function insertGenericAssignments() {
  try {
    const existingAssignmentsCount = await Assignment.countDocuments();
    const totalAssignmentsNeeded = Math.max(1000 - existingAssignmentsCount, 0);

    if (totalAssignmentsNeeded === 0) {
      console.log('Il y a déjà plus de 1000 assignments dans la base de données.');
      return;
    }

    const assignments = [];

    // Insérer les assignments génériques
    for (let i = 0; i < totalAssignmentsNeeded; i++) {
      const nom = genericAssignmentNoms[Math.floor(Math.random() * genericAssignmentNoms.length)];
      const randomMatiere = matieres[Math.floor(Math.random() * matieres.length)];
      const assignment = new Assignment({
        nom: nom,
        dateDeRendu: generateRandomDate(new Date(), new Date(new Date().getTime() + 1000 * 3600 * 24 * 30)), // Générer une date aléatoire dans les 30 prochains jours
        matiere: randomMatiere._id
      });
      assignments.push(assignment);
    }

    await Assignment.insertMany(assignments);
    console.log(`Assignments génériques créés avec succès. Total: ${totalAssignmentsNeeded}`);
  } catch (err) {
    console.error('Erreur lors de la création des assignments génériques :', err);
  } finally {
    mongoose.connection.close();
  }
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

insertGenericAssignments();
