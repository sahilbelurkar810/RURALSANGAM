const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes.js');
const schoolRoutes = require('./routes/schoolRoutes.js');
const requestRoutes = require('./routes/requestRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const connectDB = require('./config/db');


dotenv.config();

const app = express();

connectDB();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
    console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});