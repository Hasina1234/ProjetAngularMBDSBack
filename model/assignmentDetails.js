const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const assignmentDetailsSchema = new mongoose.Schema({
  assignment: { type: Schema.Types.ObjectId, ref: 'assignments' },
  auteur: { type: Schema.Types.ObjectId, ref: 'utilisateurs' }, 
  note: Number,
  remarque: String,
  rendu: Boolean
});

module.exports = mongoose.model('assignmentDetails', assignmentDetailsSchema);
