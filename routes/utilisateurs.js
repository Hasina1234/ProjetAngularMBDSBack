let Utilisateur = require('../model/utilisateurs');
let Matiere = require('../model/matieres');
let Devoir = require('../model/assignment');
let DetailDevoir = require('../model/assignmentDetails');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UPLOAD_PATH = path.join(__dirname, '../uploads');

function uploadPhotoAndGetFileName(req) {
    var uploadedFile = req.files[0];
    if (!uploadedFile) {
        console.log('Fichier introuvable!');
        return null;
    }
    const fileName = `${uploadedFile.originalname.replace(/\s+/g, '')}_${Date.now()}`;
    const destinationPath = path.join(__dirname, '/../uploads', fileName);
    fs.renameSync(uploadedFile.path, destinationPath); 
    console.log('Fichier uploadé avec succès ! Chemin du fichier :', destinationPath);
    return fileName; 
}

function updateUtilisateur(req, res) {
    const updateData = req.body;
    Utilisateur.findById(req.body._id, (err, utilisateur) => {
        if (err) {
            console.log("Erreur lors de la recherche de l'utilisateur dans la base de données :", err);
            res.status(500).send({ message: "Erreur lors de la recherche de l'utilisateur dans la base de données" });
            return;
        }
        if (!utilisateur) {
            console.log("Aucun utilisateur trouvé avec l'ID spécifié :", req.body._id);
            res.status(404).send({ message: "Utilisateur non trouvé" });
            return;
        }
        if (req.files) {
            var photoName = uploadPhotoAndGetFileName(req);
            if (photoName) {
                updateData.photo = photoName;
                console.log("Nouvelle photo sélectionnée :", photoName);
                utilisateur.photo = photoName;
            } else {
                console.log("Aucune nouvelle photo sélectionnée.");
            }
        } else {
            if (!updateData.photo) {
                delete updateData.photo;
                console.log("Aucune photo n'a été sélectionnée et aucune photo n'était présente dans la base de données.");
            }
        }
        if (updateData.nom !== utilisateur.nom) {
            console.log("Le nom de l'utilisateur a été modifié :", utilisateur.nom, "->", updateData.nom);
            utilisateur.nom = updateData.nom;
        }
        if (updateData.mail !== utilisateur.mail) {
            console.log("Le mail de l'utilisateur a été modifié :", utilisateur.mail, "->", updateData.mail);
            utilisateur.mail = updateData.mail;
        }
        utilisateur.save((err, utilisateurMaj) => {
            if (err) {
                console.log("Erreur lors de la mise à jour de l'utilisateur dans la base de données :", err);
                res.status(500).send({ message: "Erreur lors de la mise à jour de l'utilisateur dans la base de données" });
            } else {
                res.json({ message: 'Utilisateur mis à jour', utilisateur: utilisateurMaj });
            }
        });
    });
}

function getUtilisateurs(req, res) {
    Utilisateur.find((err, utilisateurs) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(utilisateurs);
        }
    });
}

function getUtilisateurById(req, res) {
    let utilisateurId = req.params.id;
    Utilisateur.findById(utilisateurId, (err, utilisateur) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(utilisateur);
        }
    });
}

function postUtilisateur(req, res) {
    // let photo = uploadPhotoAndGetFileName(req, res);
    let utilisateur = new Utilisateur(req.body);
    // if (!photo) {
    //     return res.status(400).send('Aucune photo téléchargée');
    // }
    // utilisateur.photo = req.photo;
    utilisateur.photo = null;
    utilisateur.role = 1;
    utilisateur.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${utilisateur.nom} enregistré!` });
        }
    });
}



function deleteUtilisateur(req, res) {
    Utilisateur.findByIdAndRemove(req.params.id, (err, utilisateur) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${utilisateur.nom} supprimé` });
        }
    });
}




async function se_connecter(req, res) {
  const { email, motDePasse } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({ mail: email });
    if (!utilisateur) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.mdp);
    if (!motDePasseValide) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const token = jwt.sign({ id: utilisateur._id }, 'secret', { expiresIn: '1h' });
    // const token = jwt.sign({ id: utilisateur._id }, 'secret', { expiresIn: '1m' });

    const resultat_utilisateur = {
      _id: utilisateur._id,
      nom: utilisateur.nom,
      mail: utilisateur.mail,
      photo: utilisateur.photo,
      role: utilisateur.role
    };

    res.json({ token, utilisateur: resultat_utilisateur });
  } catch (erreur) {
    res.status(400).json({ erreur: erreur.message });
  }
}

async function s_inscrire(req, res) {
  const { nom, email, motDePasse, photo, role } = req.body;
  try {
    const utilisateurExistant = await Utilisateur.findOne({ mail: email });
    if (utilisateurExistant) {
      throw new Error('Cet e-mail est déjà utilisé.');
    }

    // Vérifier si l'e-mail contient "@gmail.com"
    if (!/@gmail\.com$/.test(email)) {
      throw new Error('L\'adresse e-mail doit être de la forme "@gmail.com".');
    }

    const hashMotDePasse = await bcrypt.hash(motDePasse, 10);

    const nouvelUtilisateur = new Utilisateur({
      nom,
      mail: email,
      mdp: hashMotDePasse,
      photo,
      role
    });

    // Enregistrer l'utilisateur dans la base de données
    const utilisateurEnregistre = await nouvelUtilisateur.save();
    res.json({ message: 'Utilisateur enregistré avec succès', utilisateur: utilisateurEnregistre });
  } catch (erreur) {
    res.status(400).json({ erreur: erreur.message });
  }
}


async function getListeMatiere(req, res) {
  const userId = req.params.id;
  try {
    const mongoose = require('mongoose');
    const utilisateurObjectId = mongoose.Types.ObjectId(userId);
    const assignmentDetails = await DetailDevoir.find({ auteur: utilisateurObjectId });
    const assignmentIds = assignmentDetails.map(detail => detail.assignment);
    const assignments = await Devoir.find({ _id: { $in: assignmentIds } });
    const matiereIds = assignments.map(assignment => assignment.matiere);
    const matieres = await Matiere.find({ _id: { $in: matiereIds } });

    res.status(200).json(matieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des matières de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur de serveur lors de la récupération des matières' });
  }
}


module.exports = { getUtilisateurs, getUtilisateurById, postUtilisateur, updateUtilisateur, deleteUtilisateur,se_connecter,s_inscrire,getListeMatiere };