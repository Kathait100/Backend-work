const credential = require("../models/subscriber");
const jwt = require("jsonwebtoken");
// const window = require("window");
// Handel Errors
const handelError = (err) => {
  console.log(err.message, err.code);
  const errors = { email: "", password: "" };

  // Duplicate Entry
  if (err.code === 11000) {
    return (err.message = "Duplicate Entry!Please Check And Try Again!");
  }
  // incorect email
  if (err.message === "Email Not Registered") {
    errors.email = "Email Not Registered";
  }
  // incorect Password
  if (err.message === "Wrong Password") {
    errors.password = "Wrong Password";
  }

  //validation Error
  if (err.message.includes("userCredentials validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Jwt
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "vikash", {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  const userCredential = new credential({
    email: email,
    password: password,
  });
  try {
    const newCredential = await userCredential.save();
    const token = createToken(userCredential._id);
    res.status(201).json(newCredential);
  } catch (err) {
    const error = handelError(err);
    res.status(400).json({ error });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await credential.login(email, password);
    if (user) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 5000 * 60 * 60 * 24 });
      // window.document.cookie = "jwt1 = id";
      res.status(200).json({ user: user._id });
    }
  } catch (err) {
    const error = handelError(err);
    res.status(400).json({ error });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
