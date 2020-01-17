const express = require('express');

const acDb = require('../helpers/actionModel');

const router = express.Router();

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

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.post('/:id', (req, res) => {
  // ProjectId
  // Description
  // Notes


});

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

router.delete('/', (req, res) => {
  
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