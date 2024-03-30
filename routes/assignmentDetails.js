let AssignmentDetails = require('../model/assignmentDetails');
let Assignment = require('../model/assignment');

function postAssignmentDetail(req, res){
    let assignmentDetail = new AssignmentDetails();
    assignmentDetail.assignment = req.params.assignmentId; 
    assignmentDetail.auteur = req.body.auteur;
    assignmentDetail.rendu = false;

    console.log("POST assignmentDetail reçu :");
    console.log(assignmentDetail)

    AssignmentDetails.findOne({ assignment: req.params.assignmentId, auteur: req.body.auteur }, (err, existingDetail) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (existingDetail) {
            return res.status(200).json({ message: "Vous avez déjà soumis cet assignment." });
        }

        assignmentDetail.save((err, savedDetail) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(savedDetail);
        });
    });
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

module.exports = { getAssignmentDetails, postAssignmentDetail, getAssignmentDetails, updateAssignmentDetail, deleteAssignmentDetail };
