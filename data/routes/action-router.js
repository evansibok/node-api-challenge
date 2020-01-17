const express = require('express');

const acDb = require('../helpers/actionModel');

const router = express.Router();

// Get a list of all actions
router.get('/', (req, res) => {
  acDb.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      });
    });
});

// Get a single action
router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

// Add an action
router.post('/:id', (req, res) => {
  // ProjectId
  // Description
  // Notes


});

// Modify an action
router.put('/:id', validateActionId, validateAction, (req, res) => {
  const id = req.action.id;
  const updatedAction = req.body;

  acDb.update(id, updatedAction)
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

// Delete an action
router.delete('/:id', validateActionId, (req, res) => {
  const id = req.action.id;

  acDb.remove(id)
    .then(() => {
      res.status(202).json({
        message: "Action deleted!"
      });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      })
    });
});

async function validateActionId(req, res, next) {
  const { id } = req.params;

  // Use get(id)
  const action = await acDb.get(id);
  // Does action with Id exist? No - Return 400, Yes - save to req.action
  if (action) {
    req.action = action;
    next();
  } else { // Else 400
    res.status(404).json({ message: "Action with Id doesn't exist!" });
  }
}

function validateAction(req, res, next) {
  const actionToPost = req.body;

  if (Object.keys(actionToPost).length === 0) {
    res.status(400).json({ message: "Missing action data!" });
  } else if (!actionToPost.description || !actionToPost.notes) {
    res.status(400).json({ message: "Please enter a name or a description!" });
  } else {
    next();
  }
}

module.exports = router;