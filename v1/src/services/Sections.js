const Section = require("../models/Sections");

const insert = (data) => {
  return new Section(data).save();
};

const modify = (data, id) => {
  return Section.findByIdAndUpdate(id, data, { new: true });
};
const remove = (id) => {
  return Section.findByIdAndDelete(id);
};

const list = (where) => {
  return Section.find(where || {})
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
  list
};
