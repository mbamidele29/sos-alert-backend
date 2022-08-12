const Contact = require("../../models/contact.model");
const { successResponse } = require("../../utils/response");

const actionAddContact = async (req, res, next) => {
  try {
    const {
      firstName,
      emailAddress,
      phoneNumber,
      isPrimary = false,
    } = req.body;
    const contact = Contact({
      firstName,
      emailAddress,
      phoneNumber,
      isPrimary,
      userId: req.user._id,
    });

    const exists = await Contact.findOne({
      emailAddress,
      userId: req.user._id,
    });
    if (exists) throw new Error("contact information already exists");

    await contact.save();
    res.send(successResponse("contact information added", contact));
  } catch (error) {
    next(error);
  }
};

const actionUpdateContact = async (req, res, next) => {
  try {
    const {
      firstName,
      emailAddress,
      phoneNumber,
      isPrimary = false,
    } = req.body;

    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!contact) throw new Error("contact does not exist");

    const exists = await Contact.findOne({
      emailAddress,
      userId: req.user._id,
    });
    if (exists) throw new Error("contact information already exists");

    contact.firstName = firstName ?? contact.firstName;
    contact.isPrimary = isPrimary ?? contact.isPrimary;
    contact.phoneNumber = phoneNumber ?? contact.phoneNumber;
    contact.emailAddress = emailAddress ?? contact.emailAddress;

    await contact.save({ isNew: false });
    res.send(successResponse("contact record updated", contact));
  } catch (error) {
    next(error);
  }
};

const actionGetContacts = async (req, res, next) => {
  try {
    res.send(
      successResponse(
        "contacted fetch successfully",
        await Contact.find({ userId: req.user.id })
      )
    );
  } catch (error) {
    next(error);
  }
};

const actionDeleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!contact) throw new Error("contact does not exist");
    await contact.remove();
    res.send(successResponse("contact record deleted", contact));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  actionAddContact,
  actionGetContacts,
  actionUpdateContact,
  actionDeleteContact,
};
