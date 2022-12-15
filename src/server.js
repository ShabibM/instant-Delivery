// require express server for running app
const express = require("express");

// set up DT
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// --Import routers
const router = require("./routes/pages");
const auth_router = require("./routes/auth_router");
const test_router = require("./routes/test_router");

// --Database Connection
// const getDbConnection = new sqlite3.Database(
//   path.resolve(__dirname, "../Delivery database.db"),

//   (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log("Connected");
//   }
// );

// save express method function in app
const app = express();

// url localhost:3000
const port = 4000;

// use path for joining other directories folder files
app.use(express.static(path.join(__dirname, "public"))); // app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname + "/public"));

//Setting up the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//Setting up the body parser, public folder, and JSON
const parser = require("body-parser");
app.use(parser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/home", (req, res, next) => {
  console.log("XX");
  next();
});

// #### middleware connecting the router
app.use(router);
// app.use(auth_router);
app.use(test_router);

// #### Database Connection
const getDbConnection = new sqlite3.Database(
  path.resolve(__dirname, "../../Delivery database.db"),

  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected");
  }
);

//###### HOME page
router.get("/home", (req, res) => {
  const opType = req.query.opType;
  const username = req.query.username;
  const email = req.query.email;
  const password = req.query.password;
  let currentDate = new Date().toJSON().slice(0, 10);

  if (opType == "signup") {
    sql = `select username, email from user where username == '${username}' and email == '${email}'`;

    getDbConnection.all(sql, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      if (rows.length == 0) {
        //   Successful
        sql = `insert into user (username, email, password, date_created) values ('${username}', '${email}', '${password}', '${currentDate}');
        `;
        getDbConnection.get(sql, (err, row) => {
          if (err) {
            res.render("welcome");
            return console.error(err.message);
          }
        });
        res.render("welcome", { username: username });
        // console.log(rows);
        // console.log("DONE");
        // console.log(err);
      } else if (rows[0].email == email) {
        // EMAIL is used
        res.redirect("/");
        console.log("EMAIL USED");
      } else {
        // username is used
        // Back to welcomepage
        res.redirect("/");
        console.log("ACCOUNT EXISTS");
      }
    });

    // ### Sign-IN
  } else if (opType == "signin") {
    sql = `select username from user where username == '${username}' and password == '${password}'`;
    getDbConnection.all(sql, [], (err, rows) => {
      if (err) {
        res.render("welcome");
        return console.error(err.message);
      }
      //   NO ACCOUNT
      if (rows.length == 0) {
        console.log("CREATE ACCOUNT");
        res.redirect("/");
      }

      //   ###refresh to update the status
      // sql = `update package set status= 'lost' where delivery_date <= '${currentDate}'`;
      // res.render("home-user", { username: username, password: password });
    });
    // HAVE ACCOUNT
    // res.redirect("/refresh");
    res.render("home-user", { username: username, password: password });
    console.log("LOGGED IN");
  }
  // Admin
  else {
    res.render("home", { username: "ADMIN" });
  }

  //   console.log(req.query.opType);
});
// listening after compilation
app.listen(port, () => {
  const location = `http://localhost:${port}/`;
  console.log(`Open on this port ${location} to use the API :P !`);
});