let Matiere = require('../model/matieres');
let Utilisateur = require('../model/utilisateurs');
let Assignments = require('../model/assignment');
let AssignmentDetails = require('../model/assignmentDetails');
const path = require('path');
const fs = require('fs');
const UPLOAD_PATH = path.join(__dirname, '../uploads');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});


function postMatiere(req, res) {
    console.log("Clés des données FormData :", Object.keys(req.body));
    console.log("Clés des données FormData :", Object.keys(req.files));
    let photo;
    if (req.files && req.files[0]) {
        console.log("Fichier téléchargé");
        photo = req.files[0].filename;
        if (!photo) {
            console.log("Erreur lors du téléchargement de la photo");
            return res.status(500).send('Erreur lors du téléchargement de la photo');
        }
        console.log("Photo téléchargée :", photo);
    }
  
    const { nom, prof } = req.body;
  
    console.log("Données du formulaire :", nom, prof, photo);
  
    const matiere = new Matiere({ nom, prof });
    if (photo) {
        matiere.photo = photo;
    }
  
    matiere.save((err) => {
        if (err) {
            console.log("Erreur lors de l'enregistrement de la matière:", err);
            return res.status(500).send(err);
        }
        console.log("Matière enregistrée avec succès:", `${matiere.nom} enregistré!`);
        res.json({ message: `${matiere.nom} enregistré!` });
    });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    Matiere.find().countDocuments().exec((err, totalCount) => {
        if (err) {
            return res.status(500).send(err);
        }

        Matiere.find()
            .populate('prof', '_id nom photo')
            .skip((page - 1) * limit)
            .limit(limit)
            .exec((err, matieres) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json({ total: totalCount, matieres });
                }
            });
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

// function deleteMatiere(req, res) {
//     const matiereId = req.body._id;

//     Assignments.find({ matiere: matiereId }, (err, assignments) => {
//         if (err) {
//             return res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des assignments associés à la matière." });
//         }

//         if (assignments.length > 0) {
//             console.log("Assignments trouvés :", assignments);

//             // Pour chaque assignment trouvé, rechercher les detailsAssignment associés
//             assignments.forEach((assignment) => {
//                 AssignmentDetails.find({ assignment: assignment._id }, (err, detailsAssignments) => {
//                     if (err) {
//                         return res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des detailsAssignment associés à l'assignment." });
//                     }

//                     console.log("DetailsAssignment associés à l'assignment", assignment._id, ":", detailsAssignments);
//                 });
//             });
//         } else {
//             console.log("Aucun assignment associé à la matière.");
//         }
//     });
// }

function deleteMatiere(req, res) {
    const matiereId = req.body._id;

    // Trouver tous les assignments associés à la matière
    Assignments.find({ matiere: matiereId }, (err, assignments) => {
        if (err) {
            return res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des assignments associés à la matière." });
        }

        // Si des assignments sont trouvés
        if (assignments.length > 0) {
            console.log("Assignments trouvés :", assignments);

            // Supprimer les detailsAssignments associés à chaque assignment
            assignments.forEach((assignment) => {
                AssignmentDetails.deleteMany({ assignment: assignment._id }, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression des detailsAssignment associés à l'assignment." });
                    }

                    console.log("DetailsAssignment associés à l'assignment", assignment._id, "supprimés avec succès.");
                });

                // Supprimer l'assignment lui-même
                Assignments.findByIdAndDelete(assignment._id, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'assignment." });
                    }

                    console.log("Assignment", assignment._id, "supprimé avec succès.");
                });
            });
        } else {
            console.log("Aucun assignment associé à la matière.");
        }

        // Supprimer la matière elle-même
        Matiere.findByIdAndDelete(matiereId, (err) => {
            if (err) {
                return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la matière." });
            }

            console.log("Matière", matiereId, "supprimée avec succès.");
            res.status(200).json({ message: "La matière et ses assignments associés ont été supprimés avec succès." });
        });
    });
}






// function deleteMatiere(req, res) {
//     const matiereId = req.body._id;

//     // Étape 1 : Trouver tous les assignments associés à la matière
//     Assignments.find({ matiere: matiereId }, (err, assignments) => {
//         if (err) {
//             return res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des assignments associés à la matière." });
//         }

//         // Étape 2 : Si aucun assignment n'est trouvé, passer directement à l'étape 4
//         if (assignments.length === 0) {
//             return deleteMatiereAndRespond(matiereId, res);
//         }

//         // Étape 3 : Pour chaque assignment, trouver et supprimer les assignmentDetails associés
//         let assignmentsDeleted = 0;
//         assignments.forEach((assignment) => {
//             AssignmentDetails.deleteMany({ assignment: assignment._id }, (err) => {
//                 if (err) {
//                     return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression des assignmentDetails associés à l'assignment." });
//                 }

//                 // Marquer l'assignment comme supprimé
//                 assignmentsDeleted++;

//                 // Si tous les assignments ont été traités, passer à l'étape 4
//                 if (assignmentsDeleted === assignments.length) {
//                     deleteMatiereAndRespond(matiereId, res);
//                 }
//             });
//         });
//     });
// }

function deleteMatiereAndRespond(matiereId, res) {
    // Étape 4 : Supprimer la matière elle-même
    Matiere.findByIdAndDelete(matiereId, (err) => {
        if (err) {
            return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la matière." });
        }
        res.status(200).json({ message: "La matière et ses assignments associés ont été supprimés avec succès." });
    });
}



// function deleteMatiere(req, res) {
//     // console.log("La fonction deleteMatiere a été appelée.",req.body); 
//     const matiereId = req.body._id; // supposons que l'ID de la matière à supprimer soit passé dans les paramètres de la requête

//     // Étape 1 : Trouver tous les assignments associés à la matière
//     Assignments.find({ matiere: matiereId }, (err, assignments) => {
//         if (err) {
//             return res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des assignments associés à la matière." });
//         }

//         // Étape 2 : Pour chaque assignment, trouver et supprimer les assignmentDetails associés
//         assignments.forEach((assignment) => {
//             AssignmentDetails.deleteMany({ assignment: assignment._id }, (err) => {
//                 if (err) {
//                     return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression des assignmentDetails associés à l'assignment." });
//                 }

//                 // Étape 3 : Supprimer l'assignment
//                 Assignment.findByIdAndDelete(assignment._id, (err) => {
//                     if (err) {
//                         return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'assignment." });
//                     }
//                 });
//             });
//         });

//         // Étape 4 : Supprimer la matière elle-même
//         Matiere.findByIdAndDelete(matiereId, (err) => {
//             if (err) {
//                 return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la matière." });
//             }
//             res.status(200).json({ message: "La matière et ses assignments associés ont été supprimés avec succès." });
//         });
//     });
// }


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
