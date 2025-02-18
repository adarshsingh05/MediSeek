const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const Report = require('../models/Report');
const { authMiddleware } = require("../controller/authController");
const axios = require('axios');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const router = express.Router();

// 📌 API to Save Report Metadata in MongoDB
router.post('/upload',authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        const { patientName, testType, supabaseUrl } = req.body;
        const userId = req.user.id; // Get user ID from authentication middleware

        if (!patientName || !testType || !supabaseUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log("📝 Incoming Data:", req.body);

        const newReport = new Report({
            patientName,
            testType,
            supabaseUrl,
            userId // Store the user who uploaded
        });

        const savedReport = await newReport.save();
        console.log("✅ Report Saved in MongoDB:", savedReport);

        res.status(201).json({ message: "Report uploaded successfully", fileUrl: supabaseUrl });

    } catch (error) {
        console.error("❌ Upload Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});
router.get('/extract/:reportId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const report = await Report.findOne({ _id: req.params.reportId, userId }); // Ensure only owner's report is fetched

        if (!report) return res.status(404).json({ message: "Report not found or access denied" });

        const fileUrl = report.supabaseUrl;
        console.log("🔍 Fetching File from:", fileUrl);

        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const fileBuffer = Buffer.from(response.data);

        let extractedText = "";

        if (fileUrl.endsWith(".pdf")) {
            const pdfData = await pdfParse(fileBuffer);
            extractedText = pdfData.text;
        } else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) {
            const { data } = await Tesseract.recognize(fileBuffer, "eng");
            extractedText = data.text;
        } else {
            return res.status(400).json({ message: "Unsupported file format" });
        }

        console.log("📄 Extracted Data:", extractedText);

        // Create a PDF from the extracted text
        const doc = new PDFDocument();
        
        // Set the response header to download the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=health_report.pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add content to the PDF
        doc.fontSize(18).text('Electronic Health Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Patient Name: ${report.patientName}`);
        doc.text(`Test Type: ${report.testType}`);
        doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`);
        doc.moveDown();

        // Add the extracted data (the report content)
        doc.fontSize(10).text(`Extracted Report Data:\n${extractedText}`);

        // Finalize the PDF document
        doc.end();

    } catch (error) {
        console.error("❌ Extraction and PDF Generation Error:", error.message);
        // Ensure no response is sent if the PDF generation fails
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to extract report data and generate PDF" });
        }
    }
});
router.get('/extsract/:reportId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const report = await Report.findOne({ _id: req.params.reportId, userId }); // Ensure only owner's report is fetched
        
        if (!report) return res.status(404).json({ message: "Report not found or access denied" });

        const fileUrl = report.supabaseUrl;
        console.log("🔍 Fetching File from:", fileUrl);

        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const fileBuffer = Buffer.from(response.data);

        let extractedText = "";

        if (fileUrl.endsWith(".pdf")) {
            const pdfData = await pdfParse(fileBuffer);
            extractedText = pdfData.text;
        } else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) {
            const { data } = await Tesseract.recognize(fileBuffer, "eng");
            extractedText = data.text;
        } else {
            return res.status(400).json({ message: "Unsupported file format" });
        }

        console.log("📄 Extracted Data:", extractedText);
        res.json({ reportId: report._id, text: extractedText });
         // Create a PDF from the extracted text
         const doc = new PDFDocument();
        
         // Set the response header to download the PDF file
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename=health_report.pdf');
 
         // Pipe the PDF document to the response
         doc.pipe(res);
 
         // Add content to the PDF
         doc.fontSize(18).text('Electronic Health Report', { align: 'center' });
         doc.moveDown();
 
         doc.fontSize(12).text(`Patient Name: ${report.patientName}`);
         doc.text(`Test Type: ${report.testType}`);
         doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`);
         doc.moveDown();
 
         // Add the extracted data (the report content)
         doc.fontSize(10).text(`Extracted Report Data:\n${extractedText}`);
 
         // Finalize the PDF document
         doc.end();

    } catch (error) {
        console.error("❌ Extraction Error:", error.message);
        res.status(500).json({ message: "Failed to extract report data" });
    }
});



// 📌 API to Get All Reports
router.get('/reports', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const reports = await Report.find({ userId }); // Fetch only user's reports
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
