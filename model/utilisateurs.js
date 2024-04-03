const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const utilisateurSchema = new Schema({
  nom: String,
  mail: String,
  mdp: String,
  photo: String,
  role: Number // 0: prof, 1: eleve
});

module.exports = mongoose.model('utilisateurs', utilisateurSchema);
