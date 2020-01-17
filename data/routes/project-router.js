const express = require('express');

const pjDb = require('../helpers/projectModel');

const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
  pjDb.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      });
    });
});

// Get single project
router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project)
});

// Retrieve list of all actions that belong a single project
router.get('/:id/actions', validateProjectId, (req, res) => {
  const { id } = req.params;
  // /api/projects/:id - returns project object = req.project
  // req.project.actions = []

  pjDb.getProjectActions(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      });
    });
})

// Create a new project
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

// Modify a project
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

// Delete a project
router.delete('/:id', validateProjectId, (req, res) => {
  const id = req.action.id;

  pjDb.remove(id)
    .then(() => {
      res.status(202).json({
        message: "Project deleted!"
      });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      })
    });
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
    res.status(404).json({ message: "Project with Id doesn't exist!"});
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