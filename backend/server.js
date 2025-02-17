const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this is correctly imported
const bodyParser = require('body-parser');
const reportRoutes = require('./routes/reportRoutes'); // Ensure this is correctly imported
const authRoutes = require('./routes/authRoutes'); // Ensure this is correctly imported
const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// ✅ Correct way to use routes
app.use('/api/reports', reportRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
