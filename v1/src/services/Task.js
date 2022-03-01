const BaseService = require("./BaseService");
const BaseModel = require("../models/Tasks");

class Task extends BaseService {
  constructor() {
    super(BaseModel);
  }

  list(where) {
    return BaseModel.find(where || {}).populate([
      {
        path: "user_id",
        select: "full_name email profile_image"
      },
      {
        path: "project_id",
        select: "name"
      },
      {
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image"
        }
      },
      {
        path: "sub_tasks",
        select: "title description isCompleted sub_tasks"
      }
    ]);
  }

  findOne(where, expand) {
    if (!expand) return BaseModel.findOne(where);
    return BaseModel.findOne(where).populate([
      {
        path: "user_id",
        select: "full_name email profile_image"
      },
      {
        path: "project_id",
        select: "name"
      },
      {
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image"
        }
      },
      {
        path: "sub_task",
        select: "title description isCompleted sub_tasks"
      }
    ]);
  }
}

module.exports = new Task();
