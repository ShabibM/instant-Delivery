// This is the router for all authentication requests (login, logout, signup, etc.) for both the user and the admin
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser"); //will be used to get the entered value from the user
const passport = require("passport"); // Will be used for authinitication
const flash = require("connect-flash"); //Will be uesd to display error messages when sign in or sign up fails

//importing the User and Admin models
const User = require("../db-schema/User");

//importing helper methods
const {
  isValidNewUser,
  isValidUser,
  isValidAdmin,
} = require("../helpers/input-checker");

router.use(flash());

//----------------------User Authentication---------------------------

//----------------------User Sign-Up--
router.post("/user/sign-up", (req, res) => {
  // This is the user object that will be used to create a new user
  const newUser = {
    username: req.body.username.toLowerCase(),
    password: req.body.password,
    name: req.body.name,
    date_of_birth: req.body.date_of_birth,
    role: "user",
  };

  // This is to check if the user input is valid
  const validNewUser = isValidNewUser(newUser);

  // If the user input is not valid, then we will redirect the user to the sign up page and display an error message
  if (!validNewUser) {
    res.redirect("/user/failed-sign-up");
  } else {
    //This is a passport function that will create a new user in the database (Don't touch it)
    User.register(
      { username: newUser.username },
      newUser.password,
      function (err, user) {
        if (err) {
          res.redirect("/user/failed-sign-up"); //Error in sign up, might be already registered
        } else {
          User.updateOne(
            // Registered Successfully
            {
              username: newUser.username,
            },
            {
              // Update user info based on his inputs
              name: newUser.name,
              date_of_birth: newUser.date_of_birth,
              role: newUser.role,
            },
            function (err1, result) {
              if (err1) {
                console.log("Error in updating fields");
                res
                  .status(500)
                  .send("Error in updating fieldes, Please Try Again");
              } else {
                passport.authenticate("local")(req, res, function () {
                  req.session.save(function () {
                    res.redirect("/home");
                  });
                });
              }
            }
          );
        }
      }
    );
  }
});

//----------------------User and Admin Sign-In-----------------------
router.post("/sign-in", (req, res) => {
  // This is the user object that will be used to sign in
  const user = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password,
  });

  const validUser = isValidUser(user);

  if (!validUser) {
    res.redirect("/failed-sign-in");
  } else {
    // This is a passport function that will authenticate the user (Don't touch it)
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect("/failed-Sign-in");
      } else {
        passport.authenticate("local", { failureRedirect: "/failed-Sign-in" })(
          req,
          res,
          function (err) {
            if (req.isAuthenticated()) {
              req.session.save(function () {
                res.redirect("/home");
              });
            } else {
              console.log(err);
              res.redirect("/failed-Sign-in");
            }
          }
        );
      }
    });
  }
});

//----------------------Log-out Route for all---------------------------
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//----------------------Failure Routes-----------------------------------

router.get("/failed-Sign-in", function (req, res) {
  // This is to display an error message when the user sign up fails
  req.flash("authState", "sign-in-error");
  res.redirect("/");
});

// ----------------

router.get("/user/failed-Sign-up", function (req, res) {
  // This is to display an error message when the user sign up fails
  req.flash("authState", "user-sign-up-error");
  res.redirect("/");
});

// ADMIN SIGN IN
// username: 'admin@admin.com',
// password: 'adminadmin',
// name: 'admin',
// role: 'admin'

module.exports = router;
