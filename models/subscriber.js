const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter An Email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please Enter A Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter A Password"],
    minlength: [5, `minimum Password Length is 5 character`],
  },
});

// Function before Saving
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Function After Data been Saved
userSchema.post("save", function (doc, next) {
  console.log("has been saved", doc);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Wrong Password");
  }
  throw Error("Email Not Registered");
};

const credential = mongoose.model("userCredentials", userSchema);

module.exports = credential;
