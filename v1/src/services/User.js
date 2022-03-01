const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");

class User extends BaseService {
  constructor() {
    super(BaseModel);
  }

  loginUser(loginData) {
    return BaseModel.findOne(loginData);
  }
  // Gelen data üzerinden filtrelemek için, ama joi bu işlemi bizim için yaptı ondan
  // öğrenme amaçlı koyduk
  //   const updateData =
  //   Object.keys(data).reduce((obj2, key) => {
  //     if(key !== "email") obj2[key] = data[key]
  //     return obj2;
  // },{})
}

module.exports = new User();
