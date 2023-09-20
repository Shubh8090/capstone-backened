const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const markdownRoutes = require('./routes/mark');
const authRoutes = require('./routes/auth'); 
const { db } = require('./db/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

db();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/markdown', markdownRoutes);
app.use('/api/auth', authRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});