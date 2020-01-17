const acDb = require('../helpers/actionModel');

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
    res.status(400).json({ message: "Please enter notes or a description!" });
  } else {
    next();
  }
}

module.exports = {
  validateActionId,
  validateAction
};