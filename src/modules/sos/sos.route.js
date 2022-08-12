const router = require("express").Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  actionAddSOS,
  actionGetSOS,
  actionUpdateSOS,
  actionDeleteSOS,
} = require("./sos.service");

router.get("/", authMiddleware, actionGetSOS);
router.post("/", authMiddleware, actionAddSOS);
router.get("/:id", authMiddleware, actionGetSOS);
router.patch("/:id", authMiddleware, actionUpdateSOS);
router.delete("/:id", authMiddleware, actionDeleteSOS);

module.exports = router;
