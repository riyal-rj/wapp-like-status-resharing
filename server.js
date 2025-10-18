const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./src/config/constants');
const statusRoutes = require('./src/routes/statusRoutes');

const app = express();

app.use(bodyParser.json());

// Serve static frontend files from src/public at /public
app.use('/public', express.static(__dirname + '/src/public'));

// Serve index.html at site root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/public/index.html');
});

// API routes (keep existing behavior)
app.use('/', statusRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});