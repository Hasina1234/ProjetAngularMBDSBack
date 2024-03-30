let Assignment = require('../model/matieres');

function getMatieres(req, res) {
    Matiere.find((err, matieres) => {
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
    let matiere = new Matiere(req.body);
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé');
    }
    matiere.photo = req.file.buffer;
    matiere.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${matiere.nom} saved!` });
        }
    });
}


function updateMatiere(req, res) {
    const updateData = req.body;

    if (req.file) {
        updateData.photo = req.file.buffer; 
    }

    Matiere.findByIdAndUpdate(req.params.id, updateData, { new: true }, (err, updatedMatiere) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Updated', updatedMatiere });
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

module.exports = { getMatiereById, getMatieres, postMatiere, updateMatiere, deleteMatiere};
