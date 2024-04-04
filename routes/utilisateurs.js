let Utilisateur = require('../model/utilisateurs');
const multer = require('multer');
const fs = require('fs');

const UPLOAD_PATH = path.join(__dirname, '../uploads');

function uploadPhotoAndGetFileName(req, res) {
    var uploadedFile = req.files[0];
    if (!uploadedFile) {
        console.log('Fichier introuvable!');
        return;
    }
    const fileName = `${uploadedFile.originalname.replace(/\s+/g, '')}_${Date.now()}`;
    const destinationPath = path.join(UPLOAD_PATH, fileName);
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

function updateUtilisateur(req, res) {
    let photo = uploadPhotoAndGetFileName(req, res);
    const updateData = req.body;

    if (photo) {
        updateData.photo = photo; 
    }

    Utilisateur.findByIdAndUpdate(req.body._id, updateData, { new: true }, (err, utilisateur) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Utilisateur mis à jour' });
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

module.exports = { getUtilisateurs, getUtilisateurById, postUtilisateur, updateUtilisateur, deleteUtilisateur };