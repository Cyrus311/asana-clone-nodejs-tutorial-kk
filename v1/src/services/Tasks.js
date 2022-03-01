const Task = require("../models/Tasks");

const findOne = (where, expand) => {
  if (!expand) return Task.findOne(where);
  return Task.findOne(where)
    .populate({
      path: "user_id",
      select: "full_name email profile_image"
    })
    .populate({
      path: "project_id",
      select: "name"
    })
    .populate({
      path: "comments",
      populate: {
        path: "user_id",
        select: "full_name email profile_image"
      }
    })
    .populate({
      path: "sub_task",
      select: "title description isCompleted sub_tasks"
    });
};

const insert = (data) => {
  return new Task(data).save();
};

const modify = (data, id) => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};
const remove = (id) => {
  return Task.findByIdAndDelete(id);
};

const list = (where) => {
  return Task.find(where || {})
    .populate({
      path: "user_id",
      select: "full_name email profile_image"
    })
    .populate({
      path: "project_id",
      select: "name"
    });
};

module.exports = {
  insert,
  modify,
  remove,
  list,
  findOne
};
