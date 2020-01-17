const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import Routers
const projectRouter = require('./routes/project-router');
const actionRouter = require('./routes/action-router');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRouter);
app.use('/api/actions', actionRouter);

module.exports = app;
