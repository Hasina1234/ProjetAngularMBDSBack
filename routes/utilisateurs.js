let Assignment = require('../model/utilisateurs');

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
    let utilisateur = new Utilisateur(req.body);
    if (!req.file) {
        return res.status(400).send('Aucune photo téléchargée');
    }
    utilisateur.photo = req.file.buffer;
    utilisateur.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${utilisateur.nom} enregistré!` });
        }
    });
}

function updateUtilisateur(req, res) {
    const updateData = req.body;

    if (req.file) {
        updateData.photo = req.file.buffer; 
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