const Project = require("../models/Projects");

const insert = (data) => {
  const projects = new Project(data);
  return projects.save();
};

const modify = (data, id) => {
  // return Project.findById(id).then((project) => {
  //   project.name = data?.name;
  //   return project.save();
  // });
  return Project.findByIdAndUpdate(id, data, { new: true });
};
const remove = (id) => {
  return Project.findByIdAndDelete(id);
};

const list = (where) => {
  return Project.find(where || {}).populate({
    path: "user_id",
    select: "full_name email profile_image"
  });
};

module.exports = {
  insert,
  modify,
  remove,
  list
};
