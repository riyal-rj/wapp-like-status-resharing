const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./src/config/constants');
const statusRoutes = require('./src/routes/statusRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/', statusRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});