const express = require("express");
const { authUser } = require("../basicAuth");
const router = express.Router();
const { projects } = require("../data");
const {
  canViewProject,
  canDeleteProject,
  scopedProjects,
} = require("../permissions/project");

router.get("/", authUser, (req, res) => {
  res.json(scopedProjects(req.user, projects));
});

router.get("/:projectId", setProject, authUser, authGetProject, (req, res) => {
  //added a layer of authentication
  res.json(req.project);
});

router.delete(
  "/:projectId",
  setProject,
  authUser,
  authDeleteProject,
  (req, res) => {
    res.send("Deleted Project");
  }
);

function setProject(req, res, next) {
  //authenticating if there is a project or not
  const projectId = parseInt(req.params.projectId);
  req.project = projects.find((project) => project.id === projectId);

  if (req.project == null) {
    res.status(404);
    return res.send("Project not found");
  }
  next();
}

//giving permissions to view project
function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}

module.exports = router;
