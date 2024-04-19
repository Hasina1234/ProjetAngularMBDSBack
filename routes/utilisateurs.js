let Utilisateur = require('../model/utilisateurs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UPLOAD_PATH = path.join(__dirname, '../uploads');

function uploadPhotoAndGetFileName(req, res) {
    var uploadedFile = req.files[0];
    if (!uploadedFile) {
        console.log('Fichier introuvable!');
        return;
    }
    const fileName = `${uploadedFile.originalname.replace(/\s+/g, '')}_${Date.now()}`;
    const destinationPath = path.join(__dirname, '/../uploads', fileName);
    fs.rename(uploadedFile.path, destinationPath, err => {
        if (err) {
            console.log('Erreur lors de l\'upload du fichier');
            console.error(err);
        } else {
            console.log('Fichier uploadé avec succès !');
        }
    });
    return fileName;
}

function updateUtilisateur(req, res) {
    let utilisateur = {
        nom: req.body.nom,
        mail: req.body.mail
    }
    if (req.files) {
        var photo = uploadPhotoAndGetFileName(req, res);
        utilisateur.photo = photo; 
    }

    Utilisateur.findByIdAndUpdate(req.body._id, utilisateur, { new: true }, (err, utilisateur) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Utilisateur mis à jour' });
        }
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

module.exports = { getUtilisateurs, getUtilisateurById, postUtilisateur, updateUtilisateur, deleteUtilisateur,se_connecter,s_inscrire };