const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const matiereSchema = new Schema({
  nom: String,
  photo: String,
  prof: { type: Schema.Types.ObjectId, ref: 'utilisateurs' }
});

module.exports = mongoose.model('matieres', matiereSchema);
