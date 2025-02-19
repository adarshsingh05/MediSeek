const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    testType: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: String, required: true }, // Ensure that the userId is included here
    supabaseUrl: { type: String, required: true }, // Stores the file URL from Supabase
    extractedData: [
        {
            testName: String,
            result: String,
            normalRange: String
        }
    ]
});

module.exports = mongoose.model('Report', ReportSchema);
