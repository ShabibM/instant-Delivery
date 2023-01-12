// const express = require("express");
// const router = express.Router();
// const sqlite3 = require("sqlite3").verbose();
// const path = require("path");
// const { body } = require("express-validator");

// // --Database Connection
// const getDbConnection = new sqlite3.Database(
//   path.resolve(__dirname, "../../Delivery database.db"),

//   (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//   }
// );

// //###### HOME page
// router.post(
//   "/home",
//   // body is used for front-end validation
//   body("email", "Please check the enterd email")
//     .isEmail()
//     .withMessage("Check again"),
//   (req, res) => {
//     console.log("XXX");
//     const opType = req.body.opType;
//     const username = req.body.username.toLowerCase();
//     const email = req.body.email;
//     const password = req.body.password;
//     let currentDate = new Date().toJSON().slice(0, 10);

//     //-----------------------------------
//     // if (username) {
//     //   req.session.user = username;
//     // }
//     // console.log("XX", req.session.id);

//     // res.cookie("user", req.session.user);
//     //-----------------------------------

//     if (opType == "signup") {
//       sql = `select username, email from user where
//        username == '${username}'`;

//       getDbConnection.all(sql, (err, rows) => {
//         if (err) {
//           return console.error(err.message);
//         }
//         console.log("DONE");
//         console.log(rows.length);
//         // ##CHECK username
//         if (rows.length == 0) {
//           sql = `select username, email from user where
//             email == '${email}'`;

//           getDbConnection.all(sql, (err, row) => {
//             if (err) {
//               return console.error(err.message);
//             }
//             // ##Check email
//             else if (row.length == 0) {
//               //   Successful

//               sql = `insert into user (username, email, password, date_created)
//               values ('${username}', '${email}', '${password}', '${currentDate}');
//              `;
//               getDbConnection.get(sql, (err, rows) => {
//                 if (err) {
//                   return console.error(err.message);
//                 }
//               });
//               res.render("welcome", {
//                 username: username,
//                 problem: "ACCOUNT HAS BEEN CREATED",
//               });
//             }
//             // Email is used
//             else {
//               res.render("welcome", {
//                 username: username,
//                 problem: "Email is used",
//               });
//             }
//           });
//         }
//         // User name is used
//         else {
//           res.render("welcome", {
//             username: username,
//             problem: "Please try again",
//           });
//           console.log("ACCOUNT EXISTS");
//         }
//       });

//       // ### Sign-IN
//     } else if (opType == "signin") {
//       sql = `select username from user where username == '${username}' and password == '${password}'`;
//       getDbConnection.all(sql, [], (err, rows) => {
//         if (err) {
//           res.render("welcome");
//           return console.error(err.message);
//         }
//         //   NO ACCOUNT
//         if (rows.length == 0) {
//           console.log("X2X", rows.length);

//           res.render("welcome", { problem: "Please try again" });
//           // res.redirect("/");
//         } else {
//           // Success
//           console.log("XX", rows.length);
//           res.render("home-user", { username: username, password: password });
//         }
//       });
//     }
//     // Admin
//     else {
//       res.render("home", { username: "ADMIN" });
//     }

//     //   console.log(req.query.opType);
//   }
// );

// module.exports = { router, getDbConnection };
