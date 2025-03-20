const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this is correctly imported
const bodyParser = require('body-parser');
const http = require("http");
const reportRoutes = require('./routes/reportRoutes'); // Ensure this is correctly imported
const authRoutes = require('./routes/authRoutes'); // Ensure this is correctly imported
const app = express();
const chatRoutes = require('./routes/chatRoutes');
const socketHandler = require('./controller/socket');
connectDB();



// ✅ Fix CORS Issues
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.json()); // ✅ Middleware to parse JSON bodies

app.use(bodyParser.json());
const server = http.createServer(app);

// ✅ Correct way to use routes
app.use('/api/reports', reportRoutes);
app.use("/api/auth", authRoutes);
// API Routes
app.use("/api/chat", chatRoutes);

// Socket.IO Integration
socketHandler(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
