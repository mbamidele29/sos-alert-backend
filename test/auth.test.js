const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../src/models/user.model");

const user1 = {
  _id: new mongoose.Types.ObjectId(),
  firstName: "Mike",
  phoneNumber: "08112121210",
  password: "12345678",
  emailAddress: "mike@sos-alert.co",
};

var token;

beforeEach(async () => {
  await User.deleteMany({});
  await new User(user1).save();

  token = jwt.sign({ _id: user1._id }, process.env.JWT_KEY);
});

test("should signup a new user", async () => {
  await request(app)
    .post("/auth/register")
    .send({
      firstName: "Michael",
      phoneNumber: "08112121212",
      password: "12345678",
      emailAddress: "michael@sos-alert.co",
    })
    .expect(200);
});

test("should login existing user", async () => {
  await request(app)
    .post("/auth/login")
    .send({
      emailAddress: user1.emailAddress,
      password: user1.password,
    })
    .expect(200);
});

test("should not login user because of bad credentials", async () => {
  await request(app)
    .post("/auth/login")
    .send({
      emailAddress: "mike@sos-alert.co",
      password: "wrong-password",
    })
    .expect(400);
});

test("should not get profile for unauthenticated user", async () => {
  await request(app).get("/auth/profile").expect(400);
});

test("should get user profile", async () => {
  await request(app)
    .get("/auth/profile")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});
