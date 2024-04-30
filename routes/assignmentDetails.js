let AssignmentDetails = require('../model/assignmentDetails');
let Assignment = require('../model/assignment');

function postAssignmentDetail(req, res) {
    const { _id, auteur, note, remarque, rendu } = req.body;

    AssignmentDetails.findOneAndUpdate(
        { _id: _id},
        { note: note, remarque: remarque, rendu: rendu },
        { new: true, upsert: true },
        (err, updatedDetail) => {
            if (err) {
                console.error("Une erreur s'est produite lors de la mise à jour des détails de l'assignment :", err);
                return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des détails de l'assignment." });
            }
            Assignment.findByIdAndUpdate(_id, { $push: { details: updatedDetail._id } }, (err) => {
                if (err) {
                    console.error("Une erreur s'est produite lors de la mise à jour de l'assignment :", err);
                    return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'assignment." });
                }
                console.log("Les détails de l'assignment ont été mis à jour avec succès :", updatedDetail);
                res.status(200).json({ message: "Les détails de l'assignment ont été mis à jour avec succès.", updatedDetail });
            });
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

function getAssignmentsRenduProf(req, res) {
    const matiereId = req.params.id;
    AssignmentDetails.find({ rendu: true })
        .populate({
            path: 'assignment',
            match: {
                matiere: matiereId
            },
            populate: { path: 'matiere' }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(assignments);
        });
}

function getAssignmentsNonRenduProf(req, res) {
    const matiereId = req.params.id;
    AssignmentDetails.find({ rendu: false })
        .populate({
            path: 'assignment',
            match: {
                matiere: matiereId
            },
            populate: { path: 'matiere' }
        })
        .populate('auteur')
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(assignments);
        });
}

module.exports = { 
    getAssignmentDetails, 
    postAssignmentDetail, 
    getAssignmentDetailById, 
    updateAssignmentDetail, 
    deleteAssignmentDetail,
    getAssignmentsRenduProf,
    getAssignmentsNonRenduProf
};
