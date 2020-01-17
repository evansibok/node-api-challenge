const express = require('express');

const pjDb = require('../helpers/projectModel');
const acDb = require('../helpers/actionModel');
const { validateProject, validateProjectId } = require('../middlewares/project');
const { validateAction } = require('../middlewares/action');

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

// Add Actions to a project
router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
  // do your magic!
  const projectId = req.project.id;
  const newAction = req.body;

  const actionData = { ...newAction, project_id: projectId };
  acDb.insert(actionData)
    .then(action => {
      res.status(201).json(action)
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "The action couldn't be added to the database",
        stack: error.stack
      })
    });
});

// Modify a project
router.put('/:id', validateProjectId, validateProject, (req, res) => {
  const id = req.project.id;
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
  const id = req.project.id;

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

module.exports = router;
