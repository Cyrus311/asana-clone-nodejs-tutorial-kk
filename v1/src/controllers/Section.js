const httpStatus = require("http-status");
const SectionService = require("../services/Section");

class Section {
  index(req, res) {
    console.log(req.params);
    if (!req?.params?.projectId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "ProjectID not found" });
    }
    SectionService.list({ project_id: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  create(req, res) {
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  update(req, res) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    SectionService.update(req.params?.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }

  deleteSection(req, res) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    SectionService.delete(req.params?.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
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

module.exports = new Section();
