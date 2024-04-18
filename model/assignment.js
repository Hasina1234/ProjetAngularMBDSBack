let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    nom: String,
    dateDeRendu: Date,
    matiere: { type: Schema.Types.ObjectId, ref: 'matieres' },
    details: [{ type: Schema.Types.ObjectId, ref: 'assignmentDetails' }]
});

module.exports = mongoose.model('assignments', AssignmentSchema);
//AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
