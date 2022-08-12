const authMiddleware = require("../../middleware/auth.middleware");
const {
  actionAddContact,
  actionGetContacts,
  actionUpdateContact,
  actionDeleteContact,
} = require("./contact.service");

const router = require("express").Router();

router.get("/", authMiddleware, actionGetContacts);
router.post("/", authMiddleware, actionAddContact);
router.delete("/:id", authMiddleware, actionDeleteContact);
router.patch("/:id", authMiddleware, actionUpdateContact);

module.exports = router;
