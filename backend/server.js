const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));