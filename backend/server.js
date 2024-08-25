require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dictionaryApi = require('./routes/dictionary.routes');

const server = express();
const port = process.env.PORT || 5000;

// Middleware
server.use(cors());
server.use(bodyParser.json());

// Main route
server.post('/', (req, res) => {
    console.log('Received POST request');
    res.json("Hello, what do you want?");
});

// API routes
server.use('/api', dictionaryApi);

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
