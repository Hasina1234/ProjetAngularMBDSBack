let AssignmentDetails = require('../model/assignmentDetails');
let Assignment = require('../model/assignment');
const { SendMail } = require('../util/mail');
let Matiere = require('../model/matieres');

function postAssignmentDetail(req, res) {
    const { _id, auteur, note, remarque, rendu, prof, sujet, message } = req.body;

    AssignmentDetails.findOneAndUpdate(
        { _id: _id},
        { note: note, remarque: remarque, rendu: rendu },
        { new: true, upsert: true },
        async (err, updatedDetail) => {
            if (err) {
                console.error("Une erreur s'est produite lors de la mise à jour des détails de l'assignment :", err);
                return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des détails de l'assignment." });
            }
            try {
                await Assignment.findByIdAndUpdate(_id, { $push: { details: updatedDetail._id } });
                console.log("Les détails de l'assignment ont été mis à jour avec succès :", updatedDetail);

                await SendMail(auteur, sujet, message, prof);

                res.status(200).json({ message: "Les détails de l'assignment ont été mis à jour avec succès.", updatedDetail });
            } catch (updateErr) {
                console.error("Une erreur s'est produite lors de la mise à jour de l'assignment :", updateErr);
                return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'assignment." });
            }
        }
    );
}





function updateAssignmentDetail(req, res) {
    console.log("UPDATE reçu pour les détails de l'assignment : ");
    console.log(req.body);
    AssignmentDetails.findByIdAndUpdate(req.body._id, { note: req.body.note, remarque: req.body.remarque }, {new: true}, (err, assignmentDetail) => {
        if (err) {
            return res.status(500).send(err);
        } else {
          res.json({message: 'Détails de l\'assignment mis à jour'})
        }
    });
}

function deleteAssignmentDetail(req, res) {
    AssignmentDetails.findByIdAndRemove(req.params.id, (err, assignmentDetail) => {
        if (err) {
            return res.status(500).send(err);
        }
        Assignment.findById(assignmentDetail.assignment, (err, assignment) => {
            if (err) {
                return res.status(500).send(err);
            }
            const index = assignment.details.indexOf(req.params.id);
            if (index !== -1) {
                assignment.details.splice(index, 1);
                assignment.save((err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.json({message: `Détails de l'assignment supprimés`});
                });
            } else {
                res.status(404).send("Détail non trouvé dans l'assignment");
            }
        });
    });
}

function getAssignmentDetails(req, res) {
    AssignmentDetails.find({ assignment: req.params.assignmentId })
        .populate('auteur') 
        .exec((err, details) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(details);
        });
}

function getAssignmentDetailById(req, res) {
    let assignmentDetailId = req.params.id;
    AssignmentDetails.findById(assignmentDetailId)
        .populate('auteur')
        .exec((err, details) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(details);
            }
        });
}

function getAssignmentsRenduParDevoirProf(req, res) {
    const idAssignment = req.params.id;
    const profId = req.params.idp;
    console.log('idassignment: ', idAssignment);
    console.log('idprof: ', profId);
    AssignmentDetails.find({ assignment: idAssignment, rendu: true })
        .populate({
            path: 'assignment',
            populate: {
                path: 'matiere',
                match: {
                    prof: profId
                }
            }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }

            const filteredResult = assignments.filter(assignment => assignment.assignment);

            if (filteredResult.length === 0) {
                return res.json([]);
            }

            res.json(assignments);
        });
}

function getAssignmentsNonRenduParDevoirProf(req, res) {
    const idAssignment = req.params.id;
    const profId = req.params.idp;

    AssignmentDetails.find({ assignment: idAssignment, rendu: false })
        .populate({
            path: 'assignment',
            populate: {
                path: 'matiere',
                populate: {
                    path: 'prof',
                    match: { _id: profId }
                }
            }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            const filteredAssignments = assignments.filter(assignment => assignment.assignment !== null);
            
            res.json(filteredAssignments);
        });
}


function getAssignmentsRenduProf(req, res) {
    const matiereId = req.params.id;
    const profId = req.params.idp;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    AssignmentDetails.find({ rendu: true })
        .populate({
            path: 'assignment',
            match: {
                matiere: matiereId
            },
            populate: {
                path: 'matiere',
                match: {
                    prof: profId
                }
            }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            // Ajout d'une vérification pour s'assurer que assignment.assignment et assignment.assignment.matiere ne sont pas null
            const filteredAssignments = assignments.filter(assignment => assignment.assignment && assignment.assignment.matiere);

            const totalCount = filteredAssignments.length;

            const paginatedAssignments = filteredAssignments.slice((page - 1) * limit, page * limit);

            res.json({
                total: totalCount,
                page: page,
                pages: Math.ceil(totalCount / limit),
                assignments: paginatedAssignments
            });
        });
}



function getAssignmentsNonRenduProf(req, res) {
    const matiereId = req.params.id;
    const profId = req.params.idp;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    AssignmentDetails.find({ rendu: false })
        .populate({
            path: 'assignment',
            match: {
                matiere: matiereId
            },
            populate: {
                path: 'matiere',
                match: {
                    prof: profId
                }
            }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            const filteredAssignments = assignments.filter(assignment => assignment.assignment !== null);

            const totalCount = filteredAssignments.length;

            const paginatedAssignments = filteredAssignments.slice((page - 1) * limit, page * limit);

            res.json({
                total: totalCount,
                page: page,
                pages: Math.ceil(totalCount / limit),
                assignments: paginatedAssignments
            });
        });
}


function getDetailDevoirByAssignmentId(req, res) {
    const assignmentId = req.params.idAssignment;
    const eleveId = req.params.idEleve;
    // Ajout des logs pour idAssignment et eleveId
    console.log("ID de l'assignment:", assignmentId);
    console.log("ID de l'élève:", eleveId);
    // Trouver l'assignment par son ID
    Assignment.findById(assignmentId)
       .populate('details') // Peuple les détails liés à l'assignment
       .exec((err, assignment) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!assignment) {
                return res.status(404).send("Devoir non trouvé");
            }

            // Filtrer pour obtenir uniquement les détails marqués comme rendus et dont l'auteur est égal à eleveId
            const detailsRendus = assignment.details.filter(detail => detail.rendu && detail.auteur.toString() === eleveId);

            // Vérifier s'il y a des détails rendus
            if (detailsRendus.length > 0) {
                res.json(detailsRendus);
            } else {
                res.status(400).send("Aucun détail de devoir rendu pour cet assignment");
            }
        });
}





function newAssignmentDetail(req, res) {
    const { assignmentId, auteurId, note, remarque, rendu } = req.body;

    // Créer un nouveau assignmentDetail
    const newAssignmentDetail = new AssignmentDetails({
        assignment: assignmentId,
        auteur: auteurId,
        note: note,
        remarque: remarque,
        rendu: rendu
    });

    // Sauvegarder le nouveau assignmentDetail dans la base de données
    newAssignmentDetail.save()
        .then((createdDetail) => {
            // Mettre à jour l'assignment correspondant pour inclure le nouveau detail
            Assignment.findByIdAndUpdate(assignmentId, { $push: { details: createdDetail._id } })
                .then(() => {
                    console.log('Détail d\'assignment ajouté avec succès à l\'assignment.');
                    res.status(200).json({ message: "Détail d'assignment ajouté avec succès à l'assignment.", createdDetail });
                })
                .catch(err => {
                    console.error("Une erreur s'est produite lors de la mise à jour de l'assignment :", err);
                    res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'assignment." });
                });
        })
        .catch(err => {
            console.error("Une erreur s'est produite lors de la création du détail d'assignment :", err);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création du détail d'assignment." });
        });
}

function getAssignmentsTotalCount(req, res) {
    const matiereId = req.params.id;
    const profId = req.params.idp;

    // Vérifier si matiereId et profId existent
    if (!matiereId || !profId) {
        console.log("matiereId ou profId manquant");
        return res.json({
            renduCount: 0,
            nonRenduCount: 0,
            totalCount: 0
        });
    }

    Matiere.findById(matiereId, (err, matiere) => {
        if (err || !matiere) {
            console.log("Matière non trouvée ou erreur: ", err);
            return res.json({
                renduCount: 0,
                nonRenduCount: 0,
                totalCount: 0
            });
        }

        console.log("Matière trouvée: ", matiere);

        const fetchAssignments = (rendu) => {
            return new Promise((resolve, reject) => {
                console.log("Fetching assignments with rendu =", rendu);
                AssignmentDetails.find({ rendu: rendu })
                    .populate({
                        path: 'assignment',
                        match: {
                            matiere: matiereId
                        },
                        populate: {
                            path: 'matiere',
                            match: {
                                prof: profId
                            }
                        }
                    })
                    .populate('auteur')
                    .exec((err, assignments) => {
                        if (err) {
                            console.log("Erreur lors de la récupération des assignments: ", err);
                            reject(err);
                        } else {
                            const filteredAssignments = assignments.filter(a => a.assignment && a.assignment.matiere);
                            resolve(filteredAssignments);
                        }
                    });
            });
        };

        const fetchAllAssignmentsByProf = () => {
            return new Promise((resolve, reject) => {
                console.log("Fetching all assignments created by the professor");
                Assignment.find({ matiere: matiereId })
                    .populate('matiere')
                    .exec((err, assignments) => {
                        if (err) {
                            console.log("Erreur lors de la récupération de tous les assignments: ", err);
                            reject(err);
                        } else {
                            resolve(assignments);
                        }
                    });
            });
        };

        Promise.all([fetchAssignments(true), fetchAssignments(false), fetchAllAssignmentsByProf()])
            .then(results => {
                const renduCount = results[0].length;
                const nonRenduCount = results[1].length;
                const totalCount = results[2].length;

                res.json({
                    renduCount: renduCount,
                    nonRenduCount: nonRenduCount,
                    totalCount: totalCount
                });
            })
            .catch(err => {
                console.log("Erreur lors de la récupération des données: ", err);
                res.status(500).send(err);
            });
    });
}







module.exports = { 
    getAssignmentsTotalCount,
    getAssignmentDetails, 
    postAssignmentDetail, 
    getAssignmentDetailById, 
    updateAssignmentDetail, 
    deleteAssignmentDetail,
    getAssignmentsRenduProf,
    getAssignmentsNonRenduProf,
    newAssignmentDetail,
    getAssignmentsNonRenduParDevoirProf,
    getAssignmentsRenduParDevoirProf,
    getDetailDevoirByAssignmentId
};
