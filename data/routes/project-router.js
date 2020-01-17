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

router.post('/', validateProject, (req, res) => {
  const newProject = req.body;

  pjDb.insert(newProject)
    .then(project => {
      res.status(201).json(project)
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The project couldn't be added to the database",
        stack: error.stack
      })
    });
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  const { id } = req.params;
  const updatedContent = req.body;

  // update(projectId, updatedContent)
  pjDb.update(id, updatedContent)
    .then(updated => {
      res.status(201).json(updated);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      })
    })
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

function validateProject(req, res, next) {
  const projectToPost = req.body;

  if(Object.keys(projectToPost).length === 0){
    res.status(400).json({ message: "Missing project data!" });
  } else if(!projectToPost.name || !projectToPost.description){
    res.status(400).json({ message: "Please enter a name or a description!" });
  } else {
    next();
  }
}

module.exports = router;