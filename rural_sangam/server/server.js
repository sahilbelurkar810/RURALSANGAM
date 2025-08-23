const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes.js");
const schoolRoutes = require("./routes/schoolRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const roomRoutes = require("./routes/roomRoutes.js");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// CORS configuration - same domain setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ruralsangam.com', 'https://www.ruralsangam.com']
    : ['http://localhost:5173', 'http://localhost:3000'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route (useful for Vercel)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rural Sangam API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/rooms", roomRoutes);

// 404 handler - should be after all routes
app.use((req, res) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;