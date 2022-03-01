const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken
} = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const UserService = require("../services/User");
const ProjectService = require("../services/Project");

class User {
  index(req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        if (!user) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Wrong User" });
        }

        user = {
          ...user.toObject(),
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: generateRefreshToken(user)
          }
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
  }

  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  projectList(req, res) {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch((err) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected Error" });
      });
  }

  resetPassword(req, res) {
    const new_password =
      uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    UserService.updateWhere(
      { email: req.body.email },
      { password: passwordToHash(new_password) }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ error: "User Not Found" });
        }
        eventEmitter.emit("send_email", {
          to: updatedUser.email,
          subject: "Password Reset",
          html: `Password reset, password <b>${new_password}</b>`
        });
        res.status(httpStatus.OK).send({
          message: "Check your email please..."
        });
      })
      .catch((err) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected error" });
      });
  }

  update(req, res) {
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected Error" })
      );
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected Error" })
      );
  }

  deleteUser(req, res) {
    if (!req.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "İd required" });
    }
    UserService.delete(req.params?.id)
      .then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Not found!" });
        }
        res
          .status(httpStatus.OK)
          .send({ message: "item deleted!", deletedItem });
      })
      .catch((err) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Unexpected Error" })
      );
  }

  updateProfileImage(req, res) {
    console.log(req.files);

    if (!req?.files?.profile_image) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Unexpected Error" });
    }
    const extension = path.extname(req.files.profile_image.name);
    const fileName = req?.user._id + extension;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
      if (err) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: err });
      }
      UserService.update(req.user._id, { profile_image: fileName })
        .then((updated) => {
          res.status(httpStatus.OK).send(updated);
        })
        .catch((e) => {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "Unexpected Error" });
        });
    });
  }
}

module.exports = new User();
