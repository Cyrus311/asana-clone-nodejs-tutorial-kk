const httpStatus = require("http-status");
const ProjectService = require("../services/Project");
const ApiError = require("../errors/ApiError");

class Project {
  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  update(req, res, next) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    ProjectService.update(req.params?.id, req.body)
      .then((updatedProject) => {
        if (!updatedProject) return next(new ApiError("bulunmamaktadır", 404));
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((err) => next(new ApiError(err?.message)));
  }

  deleteProject(req, res) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    ProjectService.delete(req.params?.id)
      .then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Not found!" });
        }
        res
          .status(httpStatus.OK)
          .send({ message: "Item deleted!", deletedItem });
      })
      .catch((err) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected Error" })
      );
  }
}

module.exports = new Project();
