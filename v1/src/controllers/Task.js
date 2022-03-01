// const { insert, modify, list, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");
const TaskService = require("../services/Task");

class Task {
  index(req, res) {
    TaskService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  create(req, res) {
    req.body.user_id = req.user;
    TaskService.create(req.body)
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
    TaskService.update(req.params?.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }

  deleteTask(req, res) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    TaskService.delete(req.params?.id)
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

  addComment(req, res) {
    if (!req.params.id)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Id is required" });
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res.status(httpStatus.NOT_FOUND).send({ error: "Not Found" });
        }
        const comment = {
          ...req.body,
          commented_at: new Date(),
          user_id: req.user
        };
        mainTask.comments.push(comment);
        mainTask
          .save()
          .then((updatedDoc) => {
            res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch((err) =>
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ error: "Wrong" })
          );
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }

  deleteComment(req, res) {
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          res.status(httpStatus.NOT_FOUND).send({ error: "Not Found" });
        }
        mainTask.comments = mainTask.comments.filter(
          (c) => c._id?.toString() !== req.params.commentId
        );
        mainTask
          .save()
          .then((updatedDoc) => {
            res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch((err) =>
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ error: "Wrong" })
          );
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }

  addSubTask(req, res) {
    if (!req.params.id)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Id is required" });
    //! Get mainTask
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res.status(httpStatus.NOT_FOUND).send({ error: "Not Found" });
        }
        //! Create subTask
        TaskService.create({ ...req.body, user_id: req.user })
          .then((subTask) => {
            mainTask.sub_tasks.push(subTask);
            mainTask
              .save()
              .then((updatedDoc) => {
                return res.status(httpStatus.OK).send(updatedDoc);
              })
              .catch((err) =>
                res
                  .status(httpStatus.INTERNAL_SERVER_ERROR)
                  .send({ error: "Wrong" })
              );
          })
          .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
          });
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }

  fetchTask(req, res) {
    if (!req.params.id)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Id is required" });
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          res.status(httpStatus.NOT_FOUND).send({ error: "Not Found" });
        }
        res.status(httpStatus.OK).send(mainTask);
      })
      .catch((err) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Wrong" })
      );
  }
}

module.exports = new Task();
