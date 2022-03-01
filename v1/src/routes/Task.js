const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const schemas = require("../validations/Tasks");
const express = require("express");
const Task = require("../controllers/Task");
const router = express.Router();

router.route("/").get(authenticate, Task.index);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation, true), Task.create);
router
  .route("/:id")
  .patch(authenticate, validate(schemas.updateValidation, true), Task.update);
router
  .route("/:id/add-comment")
  .post(
    authenticate,
    validate(schemas.commentValidation, true),
    Task.addComment
  );
router
  .route("/:id/add-sub-task")
  .post(
    authenticate,
    validate(schemas.createValidation, true),
    Task.addSubTask
  );
router.route("/:id").get(authenticate, Task.fetchTask);
router.route("/:id/:commentId").delete(authenticate, Task.deleteComment);
router.route("/:id").delete(authenticate, Task.deleteTask);

module.exports = router;
