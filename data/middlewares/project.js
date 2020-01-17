const pjDb = require('../helpers/projectModel');

async function validateProjectId(req, res, next) {
  const { id } = req.params;

  // Use get(id)
  const project = await pjDb.get(id);
  // Does project with Id exist? No - Return 400, Yes - save to req.project
  if (project) {
    req.project = project;
    next();
  } else { // Else 400
    res.status(404).json({ message: "Project with Id doesn't exist!" });
  }
}

function validateProject(req, res, next) {
  const projectToPost = req.body;

  if (Object.keys(projectToPost).length === 0) {
    res.status(400).json({ message: "Missing project data!" });
  } else if (!projectToPost.name || !projectToPost.description) {
    res.status(400).json({ message: "Please enter a name or a description!" });
  } else {
    next();
  }
}

module.exports = {
  validateProjectId,
  validateProject
}