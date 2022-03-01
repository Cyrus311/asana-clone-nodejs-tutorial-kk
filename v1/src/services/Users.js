const User = require("../models/Users");

const insert = (data) => {
  const user = new User(data);
  return user.save();
};

const list = () => {
  return User.find({});
};

const loginUser = (loginData) => {
  return User.findOne(loginData);
};

const modify = (where, data) => {
  // Gelen data üzerinden filtrelemek için, ama joi bu işlemi bizim için yaptı ondan
  // öğrenme amaçlı koyduk
  //   const updateData =
  //   Object.keys(data).reduce((obj2, key) => {
  //     if(key !== "email") obj2[key] = data[key]
  //     return obj2;
  // },{})
  return User.findByIdAndUpdate(where, data, { new: true });
};
const remove = (id) => {
  return Project.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove
};
