let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let matieres = require('./routes/matieres');
let utilisateur_routes = require('./routes/utilisateurs');
let assignmentDetails = require('./routes/assignmentDetails');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});


let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

const uri = 'mongodb+srv://master:masterM2@cluster0.zpspipp.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// http://serveur..../utilisateurs
app.route(prefix + '/utilisateurs')
  .get(utilisateur_routes.getUtilisateurs)
  .put(upload.any(),utilisateur_routes.updateUtilisateur);

app.route(prefix + '/utilisateurs/:id')
  .get(utilisateur_routes.getUtilisateurById)
  .delete(utilisateur_routes.deleteUtilisateur);

app.post(prefix + '/utilisateur/login',utilisateur_routes.se_connecter );
app.post(prefix + '/utilisateur/inscription',utilisateur_routes.s_inscrire);

// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignmentById)
  .delete(assignment.deleteAssignment);

// http://serveur...../matieres
app.route(prefix + '/matieres')
  .post(matieres.postMatiere)
  .get(matieres.getMatieres)
  .put(upload.any(),matieres.updateMatiere);

app.route(prefix + '/matieres/:id')
  .get(matieres.getMatiereById)
  .delete(matieres.deleteMatiere);

// http://serveur...../assignmentDetails
app.route(prefix + '/assignmentDetails')
  .post(assignmentDetails.postAssignmentDetail)
  .get(assignmentDetails.getAssignmentDetails)
  .put(assignmentDetails.updateAssignmentDetail);

app.route(prefix + '/assignmentDetails/:id')
  .get(assignmentDetails.getAssignmentDetailById)
  .delete(assignmentDetails.deleteAssignmentDetail);

// mise en cache
const staticOptions = {
  maxAge: '1y', // Durée de mise en cache
}; 

// dossier image uploader 
app.use("/api/uploads", express.static("uploads", staticOptions));




// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


