const express = require('express');

const acDb = require('../helpers/actionModel');
const { validateActionId, validateAction } = require('../middlewares/action');

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

module.exports = router;
