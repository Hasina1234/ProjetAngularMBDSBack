let Assignment = require('../model/assignment');
const assignmentDetails = require('../model/assignmentDetails');

function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery, 
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
    
            res.send(data);
        }
    );
}

function getAssignmentById(req, res) {
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId)
        .populate('details')
        .populate('matiere')
        .exec((err, assignment) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(assignment);
            }
        });
}

function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.matiere= req.body.matiere;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }
    });

}

function deleteAssignment(req, res) {
    const assignmentId = req.params.id;
    assignmentDetails.deleteMany({ assignment: assignmentId }, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        Assignment.findByIdAndRemove(assignmentId, (err, assignment) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ message: `${assignment.nom} deleted` });
        });
    });
}

function getAssignmentsRenduEleve(req, res) {
    const auteurId = req.params.id; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    Assignment.find({})
        .populate({
            path: 'details',
            match: {
                auteur: auteurId
            }
        })
        .populate({
            path: 'matiere',
            populate: {
                path: 'prof'
            }
        })
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }
            const filteredAssignments = assignments.filter(assignment => assignment.details.length > 0);
            const totalCount = filteredAssignments.length;
            const paginatedAssignments = filteredAssignments.slice((page - 1) * limit, page * limit);
            res.json({
                total: totalCount,
                page: page,
                totalPages: Math.ceil(totalCount / limit),
                assignments: paginatedAssignments
            });
        });
}

function getAssignmentsNonRenduEleve(req, res) {
    const auteurId = req.params.id; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    Assignment.find({})
        .populate({
            path: 'details',
            match: {
                auteur: auteurId
            }
        })
        .populate({
            path: 'matiere',
            populate: {
                path: 'prof'
            }
        })
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }

            const filteredAssignments = assignments.filter(assignment => {
                if (assignment.details.length > 0) {
                    const isAuteurPresent = assignment.details.some(detail => detail.auteur.toString() === auteurId);
                    return !isAuteurPresent;
                }
                return true;
            });

            const totalCount = filteredAssignments.length;
            const paginatedAssignments = filteredAssignments.slice((page - 1) * limit, page * limit);

            res.json({
                total: totalCount,
                page: page,
                totalPages: Math.ceil(totalCount / limit),
                assignments: paginatedAssignments
            });
        });
}


function getAssignmentsByMatiereAndProf(req, res) {
    const matiereId = req.params.matiereId;
    const profId = req.params.profId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    Assignment.countDocuments({ matiere: matiereId })
    .exec((err, totalCount) => {
        if (err) {
            return res.status(500).send(err);
        }

        Assignment.find({ matiere: matiereId })
        .populate({
            path: 'matiere',
            match: { prof: profId },
            populate: 'prof'
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.json({
                total: totalCount,
                page: page,
                pages: Math.ceil(totalCount / limit),
                assignments: assignments
            });
        });
    });
}


function getAssignmentsEleveByMatiere(req, res) {
    const auteurId = req.params.auteurId;
    const matiereId = req.params.matiereId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    Assignment.countDocuments({ matiere: matiereId, 'details.auteur': auteurId })
        .then(totalCount => {
            return Assignment.find({ matiere: matiereId })
                .populate({
                    path: 'details',
                    match: { auteur: auteurId }
                })
                .populate('matiere')
                .skip(skip)
                .limit(limit)
                .then(assignments => {
                    res.json({
                        page,
                        limit,
                        totalCount,
                        results: assignments
                    });
                });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}




function getInformationAssignmentDetailByEleve(req, res) {
    const assignmentId = req.params.ida; // Récupération de l'ID de l'assignment
    const eleveId = req.params.idu; // Supposons que l'ID de l'élève soit aussi passé en paramètre

    // Chercher l'Assignment avec l'ID fourni
    Assignment.findById(assignmentId)
        .populate({
            path: 'details',
            match: { rendu: true, auteur: eleveId } // Filtrer les details où 'rendu' est true et 'auteur' correspond à 'eleveId'
        })
        .exec((err, assignment) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!assignment) {
                return res.status(404).send({ message: "Assignment not found" });
            }
            // Vérifier si les details ne sont pas vides
            if (assignment.details.length === 0) {
                return res.status(404).send({ message: "No details found for this student or none have been submitted" });
            }
            res.json(assignment.details[0] || null); // Envoyer les details filtrés
        });
}






module.exports = { 
    getAssignmentById, 
    getAssignments,
    postAssignment, 
    updateAssignment, 
    deleteAssignment,
    getAssignmentsRenduEleve,
    getAssignmentsNonRenduEleve,
    getAssignmentsByMatiereAndProf,
    getAssignmentsEleveByMatiere,
    getInformationAssignmentDetailByEleve
};
