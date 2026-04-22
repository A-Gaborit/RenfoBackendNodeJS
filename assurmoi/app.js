const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const initRoutes = require('./routes');

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

initRoutes(app);

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
})

module.exports = app;