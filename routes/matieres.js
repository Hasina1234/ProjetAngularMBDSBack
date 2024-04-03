let Matiere = require('../model/matieres');
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
    let photo = uploadPhotoAndGetFileName(req, res);
    let matiere = new Matiere(req.body);
    if (!photo) {
        return res.status(400).send('Aucun fichier téléchargé');
    }
    matiere.photo = photo;
    matiere.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: `${matiere.nom} saved!` });
        }
    });
}


function updateMatiere(req, res) {
    let photo = uploadPhotoAndGetFileName(req, res);
    const updateData = req.body;

    if (photo) {
        updateData.photo = photo; 
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
