let Matiere = require('../model/matieres');
let Utilisateur = require('../model/utilisateurs');
let Assignments = require('../model/assignment');
let AssignmentDetails = require('../model/assignmentDetails');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = path.join(__dirname, '../uploads');


function supprimerMatiereByMatiereId(req, res) {
    const matiereId = req.body._id;
    res.status(200).send({ message: 'Matière supprimée avec succès.', data: req.body });


    // AssignmentDetails.deleteMany({ assignment: { $in: await Assignments.find({ matiere: matiereId }) } }, (err) => {
    //     if (err) {
    //         return res.status(500).send({ message: 'Erreur lors de la suppression des AssignmentDetails.', error: err });
    //     }

    //     res.status(200).send({ message: 'AssignmentDetails supprimés avec succès.' });

    //     Assignments.deleteMany({ matiere: matiereId }, (err) => {
    //         if (err) {
    //             return res.status(500).send({ message: 'Erreur lors de la suppression des Assignments.', error: err });
    //         }

    //         res.status(200).send({ message: 'Assignments supprimés avec succès.' });

    //         Matiere.findByIdAndDelete(matiereId, (err, deletedMatiere) => {
    //             if (err) {
    //                 return res.status(500).send({ message: 'Erreur lors de la suppression de la matière.', error: err });
    //             }
    //             if (!deletedMatiere) {
    //                 return res.status(404).json({ message: 'Matière non trouvée.' });
    //             }

    //             res.json({ message: `${deletedMatiere.nom} supprimée avec succès` });
    //         });
    //     });
    // });
}


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


function updateMatiere(req, res) {
    const updateData = req.body;
    Matiere.findById(req.body._id, (err, ancienneMatiere) => {
        if (err) {
            console.error("Erreur lors de la recherche de la matière dans la base de données :", err);
            return res.status(500).json({ message: "Erreur lors de la recherche de la matière dans la base de données" });
        }
        if (!ancienneMatiere) {
            console.log("Aucune matière trouvée avec l'ID spécifié :", req.body._id);
            return res.status(404).json({ message: "Matière non trouvée" });
        }

        if (req.files) {
            let photoName = uploadPhotoAndGetFileName(req, res);
            if (photoName) {
                updateData.photo = photoName;
                console.log("Nouvelle photo sélectionnée :", photoName);
            } else {
                console.log("Aucune nouvelle photo sélectionnée.");
            }
        } else {
            if (!updateData.photo) {
                delete updateData.photo;
                console.log("Aucune photo n'a été sélectionnée et aucune photo n'était présente dans la base de données.");
            }
        }

        // Comparaison pour les autres champs que vous souhaitez suivre
        if (updateData.nom !== ancienneMatiere.nom) {
            console.log("Le nom de la matière a été modifié :", ancienneMatiere.nom, "->", updateData.nom);
        }

        Matiere.findByIdAndUpdate(req.body._id, updateData, { new: true }, (err, updatedMatiere) => {
            if (err) {
                console.error("Erreur lors de la mise à jour de la matière dans la base de données :", err);
                return res.status(500).json({ message: "Erreur lors de la mise à jour de la matière dans la base de données" });
            }
            console.log("Matière mise à jour avec succès :", updatedMatiere);
            res.json({ message: 'Matière mise à jour', updatedMatiere });
        });
    });
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

// function postMatiere(req, res) {
//     let photo = uploadPhotoAndGetFileName(req, res);
//     let matiere = new Matiere(req.body);
//     if (!photo) {
//         return res.status(400).send('Aucun fichier téléchargé');
//     }
//     matiere.photo = null;
//     matiere.photo = photo;
//     matiere.save((err) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.json({ message: `${matiere.nom} enregistré!` });
//         }
//     });
// }
// 

function postMatiere(req, res) {
    if (!req.files || !req.files[0]) {
        return res.status(400).send('Aucun fichier téléchargé');
    }

    const photo = uploadPhotoAndGetFileName(req);
    if (!photo) {
        return res.status(500).send('Erreur lors du téléchargement de la photo');
    }

    const matiere = new Matiere(req.body);
    matiere.photo = photo;

    matiere.save((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: `${matiere.nom} enregistré!` });
    });
}







function deleteMatiere(req, res) {
    Matiere.findByIdAndRemove(req.body._id, (err, deletedMatiere) => {
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






module.exports = { getMatiereById, getMatieres, postMatiere, updateMatiere, deleteMatiere, getMatiereByProf ,supprimerMatiereByMatiereId };
