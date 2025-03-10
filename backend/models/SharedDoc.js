const mongoose = require('mongoose');

const sharedDocSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Ensure that the userId is included here

  docId: { type: String, required: true },
  supabaseUrl: { type: String, required: true } // Stores the file URL from Supabase
});
module.exports = mongoose.model('SharedDoc', sharedDocSchema);