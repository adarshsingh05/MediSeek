const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// 📌 API to Save Report Metadata in MongoDB
router.post('/upload', async (req, res) => {
    try {
        const { patientName, testType, supabaseUrl } = req.body;

        if (!patientName || !testType || !supabaseUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log("📝 Incoming Data:", req.body);

        // Save report metadata in MongoDB
        const newReport = new Report({
            patientName,
            testType,
            supabaseUrl
        });

        const savedReport = await newReport.save();
        console.log("✅ Report Saved in MongoDB:", savedReport);

        res.status(201).json({ message: "Report uploaded successfully", fileUrl: supabaseUrl });

    } catch (error) {
        console.error("❌ Upload Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});
router.get('/extract/:reportId', async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);
        if (!report) return res.status(404).json({ message: "Report not found" });

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

    } catch (error) {
        console.error("❌ Extraction Error:", error.message);
        res.status(500).json({ message: "Failed to extract report data" });
    }
});

// 📌 API to Get All Reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
