require("dotenv").config();
const path = require("path");
const express = require("express");

require("./src/config/mongoose.db");

const authRouter = require("./src/modules/auth/auth.route");
const contactRoute=require('./src/modules/contact/contact.route');
const { errorResponse } = require("./src/utils/response");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/contacts", contactRoute);

app.use((error, req, res, next) => {
  res
    .status(error.statusCode ?? 400)
    .send(errorResponse(error.message, error.data ?? {}));
});

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
