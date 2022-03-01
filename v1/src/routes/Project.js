const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");
const schemas = require("../validations/Projects");
const express = require("express");
const Project = require("../controllers/Project");
const router = express.Router();

router.route("/").get(authenticate, Project.index);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), Project.create);
router
  .route("/:id")
  .patch(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    Project.update
  );
router.route("/:id").delete(idChecker(), authenticate, Project.deleteProject);

module.exports = router;
