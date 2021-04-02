const { ROLE } = require("../data");

function canViewProject(user, project) {
  //admin can check all, basics can check individual
  return user.role === ROLE.ADMIN || project.userId === user.id;
}

function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects;
  return projects.filter((project) => project.userId === user.id);
}

function canDeleteProject(user, project) {
  //only the creator can delete
  return project.userId === user.id;
}

module.exports = {
  canViewProject,
  scopedProjects,
  canDeleteProject,
};
