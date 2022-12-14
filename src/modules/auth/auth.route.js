const router = require("express").Router();
const authService = require("./auth.services");
const authMiddleware = require("../../middleware/auth.middleware");

router.post("/login", authService.actionLogin);
router.post("/register", authService.actionRegister);
router.post(
  "/change-password",
  authMiddleware,
  authService.actionChangePassword
);
router.get("/profile", authMiddleware, authService.actionProfile);

module.exports = router;
