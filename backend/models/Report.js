const mongoose = require('mongoose');

// Report Schema (For Lab Reports with Extracted Data)
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

// Prescription Schema
const PrescriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Ensure that the userId is included here

    doctorName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    diseaseName: { type: String, required: true },
    supabaseUrl: { type: String, required: true } // Stores the file URL from Supabase
});

// Lab Report Schema
const LabReportSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Ensure that the userId is included here

    hospitalName: { type: String, required: true },
    reportName: { type: String, required: true },
    supabaseUrl: { type: String, required: true } // Stores the file URL from Supabase
});

// Scan Schema
const ScanSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Ensure that the userId is included here

    scanName: { type: String, required: true },
    documentName: { type: String, required: true },
    supabaseUrl: { type: String, required: true } // Stores the file URL from Supabase
});

// Medical Bill Schema
const MedicalBillSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Ensure that the userId is included here

    hospitalName: { type: String, required: true },
    amount: { type: Number, required: true },
    supabaseUrl: { type: String, required: true } // Stores the file URL from Supabase
});

module.exports = {
    Report: mongoose.model('Report', ReportSchema),
    Prescription: mongoose.model('Prescription', PrescriptionSchema),
    LabReport: mongoose.model('LabReport', LabReportSchema),
    Scan: mongoose.model('Scan', ScanSchema),
    MedicalBill: mongoose.model('MedicalBill', MedicalBillSchema),
};
