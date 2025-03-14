const express = require("express");
const router = express.Router();

const userController = require("../Controllers/UserController");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");
const {
  validationLogin,
  validationSignup,
} = require("../validations/validationValue");

router.post("/sign-up", validationSignup, userController.createUser);
router.post("/sign-in", validationLogin, userController.loginUser);


router.use(authMiddleware);
router.post("/log-out", userController.logoutUser);
router.patch("/update-user/:id", userController.updateUser);
router.get("/get-detail/:id",userController.getDetailsUser);
router.post("/refresh-token/:id",userController.refreshToken);
//  router role admin
router.delete("/delete-user", authMiddleware, userController.deleteUser);
router.get("/get-all", authMiddleware, userController.getAllUser);
router.post("/delete-many", authMiddleware, userController.deleteMany);

module.exports = router;
