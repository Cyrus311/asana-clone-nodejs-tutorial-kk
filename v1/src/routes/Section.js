const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const schemas = require("../validations/Sections");
const express = require("express");
const Section = require("../controllers/Section");
const router = express.Router();

router.route("/:projectId").get(authenticate, Section.index);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), Section.create);
router
  .route("/:id")
  .patch(authenticate, validate(schemas.updateValidation), Section.update);
router.route("/:id").delete(authenticate, Section.deleteSection);

module.exports = router;
