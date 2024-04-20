let Matiere = require('../model/matieres');
let Utilisateur = require('../model/utilisateurs');
const path = require('path');
const fs = require('fs');

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

function getMatieres(req, res) {
    Matiere.find()
        .populate('prof', '_id nom photo') 
        .exec((err, matieres) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(matieres);
            }
        });
}


function getMatiereById(req, res) {
    let matiereId = req.params.id;
    Matiere.findById(matiereId, (err, matiere) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(matiere);
        }
    });
}

function postMatiere(req, res) {
    // let photo = uploadPhotoAndGetFileName(req, res);
    let matiere = new Matiere(req.body);
    // if (!photo) {
    //     return res.status(400).send('Aucun fichier téléchargé');
    // }
    matiere.photo = null;
    // matiere.photo = photo;
    matiere.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${matiere.nom} enregistré!` });
        }
    });
}


function updateMatiere(req, res) {
    const updateData = req.body;
    const ancienneMatiere = Matiere.findById(req.params.id); // Supposons que vous puissiez obtenir la matière à partir de la base de données
    if (!ancienneMatiere) {
        console.log("Aucune matière trouvée avec l'ID spécifié :", req.params.id);
        res.status(404).send({ message: "Matière non trouvée" });
        return;
    }

    if (req.files) {
        let photo = uploadPhotoAndGetFileName(req, res);
        if (photo) {
            updateData.photo = photo; 
            console.log("Nouvelle photo sélectionnée :", photo);
        } else {
            console.log("Aucune nouvelle photo sélectionnée.");
        }
    } else {
        // Si aucune nouvelle photo n'est envoyée, conserver la photo actuelle de la matière si elle existe
        if (!updateData.photo) {
            // Si aucune nouvelle photo n'est sélectionnée et que l'ancienne photo n'existe pas, supprimer la clé 'photo' de updateData
            delete updateData.photo;
            console.log("Aucune photo n'a été sélectionnée et aucune photo n'était présente dans la base de données.");
        }
    }

    if (updateData.nom !== ancienneMatiere.nom) {
        console.log("Le nom de la matière a été modifié :", ancienneMatiere.nom, "->", updateData.nom);
    }

    // Autres comparaisons pour les champs que vous souhaitez suivre...

    Matiere.findByIdAndUpdate(req.params.id, updateData, { new: true }, (err, updatedMatiere) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Matière mise à jour', updatedMatiere });
        }
    });
}



function deleteMatiere(req, res) {
    Matiere.findByIdAndRemove(req.params.id, (err, deletedMatiere) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${deletedMatiere.nom} deleted` });
        }
    });
}


function getMatiereByProf(req, res) {
    let profId = req.params.idProf;
    Matiere.find({ prof: profId }, (err, matieres) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(matieres);
        }
    });
}

module.exports = { getMatiereById, getMatieres, postMatiere, updateMatiere, deleteMatiere, getMatiereByProf };
