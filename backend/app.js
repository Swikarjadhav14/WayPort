const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

module.exports = app;
