const SOS = require("../../models/sos.model");
const Contact = require("../../models/contact.model");
const { successResponse } = require("../../utils/response");

const actionAddSOS = async (req, res, next) => {
  try {
    const { title, description, attachments, priority, resolved } = req.body;

    const sos = SOS({
      title,
      description,
      attachments,
      priority,
      resolved,
      userId: req.user._id,
    });
    await sos.save();
    if (!sos.resolved) {
      // TODO order by priority
      const contact = await Contact.findOne({ userId: req.user._id });

      if (contact) {
        sos.contacted.push({
          contact: contact._id,
        });
        sos.save();
        // TODO call/send email/send texts to user
        // TODO create websocket to make periodic checks and either update acknowledge
        // TODO if contact is reachable or contact the next person
      }
    }
    res.send(
      successResponse("Alert created, contacting your emergency contacts", sos)
    );
  } catch (error) {
    next(error);
  }
};

const actionUpdateSOS = async (req, res, next) => {
  try {
    const { title, description, attachments, resolved } = req.body;
    const sos = await SOS.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sos) throw new Error("SOS does not exist");

    sos.title = title ?? sos.title;
    sos.description = description ?? sos.description;
    sos.attachments = attachments ?? sos.attachments;
    sos.resolved = resolved ?? sos.resolved;

    await sos.save();
    res.send(successResponse("SOS updated successfully", sos));
  } catch (error) {
    next(error);
  }
};

const actionDeleteSOS = async (req, res, next) => {
  try {
    const sos = await SOS.findOne({ _id: req.params.id, userId: req.user.id });
    if (!sos) throw new Error("SOS does not exist");

    await sos.remove();
    res.send(successResponse("SOS deleted successfully", sos));
  } catch (error) {
    next(error);
  }
};

const actionGetSOS = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.params.id) filter["_id"] = req.params.id;

    res.send(successResponse("success", await SOS.find(filter)));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  actionAddSOS,
  actionGetSOS,
  actionUpdateSOS,
  actionDeleteSOS,
};
