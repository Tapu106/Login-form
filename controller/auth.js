const User = require("../model/user");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  return res.render("auth/login", {
    errorMessage: null,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.pass;
  console.log(email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: pass,
        confirmPassword: req.body.confirmPass,
      },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(pass, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.send("hi");
      console.log("Done!");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.pass;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(422).render("auth/login", {
          errorMessage: "Invalid email or password.",
          validationErrors: errors.array(),
        });
      }
      bcrypt
        .compare(password, userDoc.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = userDoc;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/success");
            });
          }
          return res.status(422).render("auth/login", {
            errorMessage: "Invalid email or password.",
            validationErrors: errors.array(),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    errorMessage: null,
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
