const express = require('express');

const pjDb = require('../helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
  pjDb.get()
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project)
});

router.post('/', (req, res) => {
  res.status(200).json({ message: "Projects are live!" })
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: "Projects are live!" })
});

router.delete('/', (req, res) => {
  res.status(200).json({ message: "Projects are live!" })
});

async function validateProjectId(req, res, next) {
  const { id } = req.params;

  // Use get(id)
  const project = await pjDb.get(id);
  // Does project with Id exist? No - Return 400, Yes - save to req.project
  if(project) {
    req.project = project;
    next();
  } else { // Else 400
    res.status(400).json({ message: "Project with Id doesn't exist!"});
  }
}

module.exports = router;