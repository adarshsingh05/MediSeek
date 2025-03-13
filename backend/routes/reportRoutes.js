const express = require('express');
const PDFDocument = require('pdfkit');

const {Report, Prescription} = require('../models/Report');
const {Scan} = require('../models/Report');
const {LabReport} = require('../models/Report');
const { authMiddleware } = require("../controller/authController");
const axios = require('axios');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");   
const router = express.Router();
const {marked} = require('marked'); // <--- Here, at the top level
const pdf = require('html-pdf');
const Doctor = require('../models/doctors');

// 📌 API to Save Report Metadata in MongoDB

// GET all reports using userId from req.body
router.post("/all-reports", async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch all reports for the provided userId
    const [reports, prescriptions, labReports, scans, medicalBills] = await Promise.all([
      Report.find({ userId }),
      Prescription.find({ userId }),
      LabReport.find({ userId }),
      Scan.find({ userId }),
    ]);

    res.json({
      reports,
      prescriptions,
      labReports,
      scans,
      medicalBills,
    });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});


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
router.post('/uploadscan',authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        const userId = req.user.id; // Get user ID from authentication middleware

        const { scanName, supabaseUrl,documentName } = req.body;
        if (!scanName || !supabaseUrl || !documentName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("incoming data", req.body);

        const newScan = new Scan({
            scanName,
            documentName,
            supabaseUrl,
            userId // Store the user who uploaded
        });
        const savedScan = await newScan.save();
        console.log("✅ Report Saved in MongoDB:", savedScan);

        res.status(201).json({ message: "Report uploaded successfully"});
      }

        catch (error) {
            console.error("❌ Upload Error:", error.message);
        }
      });
router.post('/uploadlabreport',authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        const userId = req.user.id; // Get user ID from authentication middleware

        const { hospitalName, supabaseUrl,reportName } = req.body;
        if (!hospitalName || !supabaseUrl || !reportName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("incoming data", req.body);

        const SavedLabReport = new LabReport({
          reportName,
          hospitalName,
                      supabaseUrl,
            userId // Store the user who uploaded
        });
        const savedLabReport = await SavedLabReport.save();
        console.log("✅ Report Saved in MongoDB:", savedLabReport);

        res.status(201).json({ message: "Report uploaded successfully"});
      }

        catch (error) {
            console.error("❌ Upload Error:", error.message);
        }
      });
router.post('/uploadprescription',authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        const userId = req.user.id; // Get user ID from authentication middleware

        const {hospitalName, diseaseName, doctorName, supabaseUrl } = req.body;
        if (!hospitalName || !supabaseUrl || !diseaseName|| !doctorName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("incoming data", req.body);

        const SavedLabReport = new Prescription({
          diseaseName,
          doctorName,
          hospitalName,
                      supabaseUrl,
            userId // Store the user who uploaded
        });
        const savedLabReport = await SavedLabReport.save();
        console.log("✅ Report Saved in MongoDB:", savedLabReport);

        res.status(201).json({ message: "Report uploaded successfully"});
      }

        catch (error) {
            console.error("❌ Upload Error:", error.message);
        }
      });




      const genAI = new GoogleGenerativeAI('AIzaSyBCOb-nGoETvhIQKY6KjXouGICkr8DK2rE');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      router.post('/process-report', async (req, res) => {
          const { extractedData } = req.body;
          const structureCommand = 'Hey kindly structure this entire report in a more readable form with rows and columns. Include the patient name, laboratory information at the top, and structure according to Indian lab standards. At the top, add "Electronic Health Report Powered by meediseek.ai" in bold, large font, centered. Keep all details from the report in the proper way.';
      
          const prompt = `
            You are an AI assistant that formats blood report data. 
            Here is the extracted data:
            ${extractedData}
            Please structure the data into a table with the following format: ${structureCommand}.
            Return only the structured data in a table. Do not include any explanatory text.
          `;
        
          try {
            const result = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
        
            const structuredData = result.response.candidates[0].content.parts[0].text;
        
            // Create PDF with the structured data
            const pdfFilePath = await generatePDF(structuredData);
        
            if (pdfFilePath) {
              res.download(pdfFilePath, 'structured-report.pdf', (err) => {
                if (err) {
                  console.error("Error downloading PDF:", err);
                  res.status(500).send('Error downloading PDF');
                } else {
                  console.log("PDF sent successfully.");
                }
              });
            } else {
              res.status(500).send("Error generating PDF");
            }
        
          } catch (error) {
            console.error('Error formatting health report:', error);
            res.status(500).send('Failed to process health report');
          }
      });
      
      async function generatePDF(structuredData) {
        return new Promise((resolve, reject) => {
          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                  word-wrap: break-word;
                }
                th {
                  background-color: #f2f2f2;
                }
                .header {
                  text-align: center;
                  font-size: large;
                  font-weight: bold;
                }
                .sub-header {
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="header">Electronic Health Report Powered by meediseek.ai</div>
              <hr>
              <table>
                <tr>
                  <td style="width:50%;">
                    <b>Royal Diagnostics Research Centre</b><br>
                    429-614, Ramachandrarao (Nakkala) Road,<br>
                    Suryaraopet, VIJAYAWADA - 520 002.<br>
                    T: 0866 - 2436487, 2435934, M: 9542235559<br>
                    royaldiagnosticsvjw@gmail.com | www.royaldiagnostics.com
                  </td>
                  <td style="width:50%;">
                    <b>Patient Name:</b> VYASASWINI<br>
                    <b>Patient ID:</b> 256820<br>
                    <b>Gender/Age:</b> Female / 20 Years<br>
                    <b>Reg Date:</b> 10-02-2025 02:50 PM<br>
                    <b>Report No:</b> (Not Provided)
                  </td>
                </tr>
              </table>
              <hr>
              <h2>HAEMATOLOGY REPORT</h2>
              <table>
                <thead>
                  <tr>
                    <th>TEST DESCRIPTION</th>
                    <th>RESULT</th>
                    <th>UNITS</th>
                    <th>BIOLOGICAL REFERENCE RANGES</th>
                  </tr>
                </thead>
                <tbody>
                  ${structuredData}
                </tbody>
              </table>
              <h3>BLOOD PICTURE</h3>
              <p>RBC: Normocytic, Moderately Hypochromic RBC.<br>
              No Haemoparasites Seen.<br>
              WBC Total Count is within normal limits. No abnormal cells seen.<br>
              Platelets: Platelets are adequate with normal clumping.</p>
              <hr>
              <p style="text-align:right;"><b>Lab Incharge:</b> DR. P. ANNAPURNA, MD, G. RAMESH, MSc.(BIOCHEM)<br>Consultant Pathologist</p>
            </body>
            </html>`;
      
          const pdfFilePath = './output/structured-report.pdf';
      
          fs.mkdirSync('./output', { recursive: true }); // Create folder if doesn't exist
      
          pdf.create(html, { format: 'Letter' }).toFile(pdfFilePath, function (err, res) {
            if (err) {
              console.error("Error creating PDF:", err);
              reject(null); // Indicate error
            } else {
              console.log("PDF created:", res);
              resolve(pdfFilePath);
            }
          });
        });
      }

      router.post('/generate-summary', async (req, res) => {
        const { extractedData } = req.body;
    
        const summaryCommand = `Please provide a 15 to 20 line summary of the following blood report data in simple language that anyone can understand. 
        Highlight important points like abnormalities, key health indicators, and any actionable insights, but avoid medical jargon. 
        Keep the tone friendly and informative. Give me the response in plain text without any star symbols or anything ready to paste and use kind of remember do not
        include any star symbol and or anything in the text and write the summary in a way that it is easy to understand for a layman also when you give response start with summary powered by 
        meediseek ai and then write in text format entire summary remove any special symbol or asterick symbol from the response.`;
    
        const prompt = `
          You are an AI assistant tasked with summarizing blood report data.
          Here is the extracted data:
          ${extractedData}
          ${summaryCommand}
          Return only the summary, without any extra explanations or headers.
        `;
    
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
    
            const summary = result.response.candidates[0].content.parts[0].text;
    
            res.json({ summary });
        } catch (error) {
            console.error('Error generating summary:', error);
            res.status(500).send('Failed to generate summary');
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
        res.status(200).json({ extractedData: extractedText });

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
});// Endpoint to process the extracted report





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
router.get('/scanreports', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const reports = await Scan.find({ userId }); // Fetch only user's reports
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/labreports', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const reports = await LabReport.find({ userId }); // Fetch only user's reports
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/getpres', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID
        const reports = await Prescription.find({ userId }); // Fetch only user's reports
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/doctors', async (req, res) => {
  try {
      const doctors = await Doctor.find(); // Fetch all doctors
      res.json(doctors);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;
