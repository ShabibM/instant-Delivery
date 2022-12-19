// require express server for running app
const express = require("express");

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { body } = require("express-validator");
const bodyParser = require("body-parser"); //Body Parser is used to get the front-end inputs from the user
const logger = require("morgan"); //morgan is used to log the requests in the console in a nice format

// --Import routers
// const router = require("./routes/pages");
// const auth_router = require("./routes/auth_router");
// const test_router = require("./routes/test_router");

// save express method function in app
const app = express();

// url localhost:3000
const port = 4000;

// app.use(express.static(__dirname + "/public"));

//Setting up the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// setting up  Morgan logger
app.use(logger("dev"));

//-----------------------------------

// Setting up the body parser, public folder, and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// use path for joining other directories folder files
app.use(express.static(path.join(__dirname, "public")));

//---------------- Setting Sessions-------------------

// app.use(
//   session({
//     name: "sessionId",
//     // secret:PROCESS.ENV.secret,
//     secret: "xx", //Retreave Secret from .env File
//     saveUninitialized: true, // don't create sessions for not logged in users
//     resave: false, //don't save session if unmodified
//     // -- Cookie --
//     // Storing session data
//     cookie: {
//       secure: false, //https
//       httpOnly: false, // if true, will disallow JavaScript from reading cookie data
//       expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour;
//     },
//   })
// );

// app.use(cookieParser());

//-----------------------------------

// #### middleware connecting the router
// app.use(router);
// app.use(auth_router);
// app.use(test_router);

//-----------------------------------

// #### Database Connection
const getDbConnection = new sqlite3.Database(
  path.resolve(__dirname, "../Delivery database.db"),

  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected");
  }
);

//-----------------------------------

// app.get("/home", (req, res) => {
//   console.log("XZ", req.session.id);
//   res.render("home");
// });

//-----------------------------------

//###### HOME page
app.post(
  "/home",
  // body is used for front-end validation
  body("email", "Please check the enterd email").isEmail(),
  (req, res) => {
    const opType = req.body.opType;
    const username = req.body.username.toLowerCase();
    const email = req.body.email;
    const password = req.body.password;
    let currentDate = new Date().toJSON().slice(0, 10);

    //-----------------------------------
    // if (username) {
    //   req.session.user = username;
    // }
    // console.log("XX", req.session.id);

    // res.cookie("user", req.session.user);
    //-----------------------------------

    if (opType == "signup") {
      sql = `select username, email from user where
     username == '${username}'`;

      getDbConnection.all(sql, (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("DONE");
        console.log(rows.length);
        // ##CHECK username
        if (rows.length == 0) {
          sql = `select username, email from user where
          email == '${email}'`;

          getDbConnection.all(sql, (err, row) => {
            if (err) {
              return console.error(err.message);
            }
            // ##Check email
            else if (row.length == 0) {
              //   Successful

              sql = `insert into user (username, email, password, date_created)
            values ('${username}', '${email}', '${password}', '${currentDate}');
           `;
              getDbConnection.get(sql, (err, rows) => {
                if (err) {
                  return console.error(err.message);
                }
              });
              res.render("welcome", {
                username: username,
                problem: "ACCOUNT HAS BEEN CREATED",
              });
            }
            // Email is used
            else {
              res.render("welcome", {
                username: username,
                problem: "Email is used",
              });
            }
          });
        }
        // User name is used
        else {
          res.render("welcome", {
            username: username,
            problem: "Please try again",
          });
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
          console.log("X2X", rows.length);

          res.render("welcome", { problem: "Please try again" });
          // res.redirect("/");
        } else {
          // Success
          console.log("XX", rows.length);
          res.render("home-user", { username: username, password: password });
        }
      });
    }
    // Admin
    else {
      res.render("home", { username: "ADMIN" });
    }

    //   console.log(req.query.opType);
  }
);

//----------------------Testing page---------------------------------

app.get("/test", (req, res) => {
  const id = req.query.id;
  const type = req.query.type;
  const username = req.query.username;
  const temp = req.query.temp;
  const new_email = req.query.newEmail;
  const new_pass = req.query.newPass;
  const email = req.query.email;
  const card = req.query.card;
  const category = req.query.category;
  const city = req.query.city;
  const date = { start: req.query.datestart, end: req.query.dateend };
  const delivery_type = req.query.delivery_type;

  const change_para = {
    package_id: req.query.package_id,
    new_value: req.query.new_value,
    toChange: req.query.toChange,
  };
  const add_para = {
    weight: req.query.weight,
    dimensions: req.query.dim,
    destination: req.query.destination,
    delivery_date: req.query.delivery_date,
    value: req.query.value,
    barcode_id: req.query.barcode_id,
    category: req.query.category,
    receiver_id: req.query.receiver_id,
    status: req.query.status,
    retail_id: req.query.retail_id,
    sender_username: req.query.sender,
    source: req.query.source,
  };

  //   ====REMOVE [DONE] ====
  if (type === "remove") {
    sql = `delete from package where id == ${id};`;
  }
  if (type === "change") {
    sql = `update package set ${
      change_para.toChange
    } == '${change_para.new_value.toLowerCase()}' where  id == '${
      change_para.package_id
    }';`;
  }
  if (type == "select") {
    sql = `SELECT * FROM package where id == '${id}'
    and sender_username == '${username}' `;

    if (username == "ADMIN") {
      sql = `SELECT * FROM package where id == '${id}' `;
    }
    if (username == "all") {
      sql = `SELECT * FROM package `;
    }
  }
  //   ##### REMOVE-USER [DONE]
  if (type == "remove-user") {
    sql = `Delete from user where username == '${username}'`;
  }

  //   ##### EMAIL [DONE]
  if (type == "email") {
    sql = `Select username, email from user where username == '${username}';`;
    // sql = `SELECT * FROM recipes `;
  }

  //   ====SELECT [DONE] ====
  if (type == "trace") {
    // sql = `SELECT * FROM package where sender_username == '${username}'`;
    // sql = `select status from package p join user u on p.sender_username ==u.username WHERE u.username == ${username}`;

    // sql = `SELECT * FROM package `;
    sql = `SELECT * FROM user `;
    // sql = `select * from user where username == 'ss'`;
  }

  //   ##### ADD-PACKAGE [DONE]
  if (type == "add") {
    // ### Adding in the location table first ###

    // ##### Getting the new pkg_id
    sql = `SELECT MAX(id) FROM package LIMIT 1;
    `;

    getDbConnection.get(sql, [], (err, rows_id) => {
      if (err) {
        console.log(err);
      }

      sql = `insert into location
      (location_name, pkg_id, type, sequence_num)
       VALUES('${add_para.source.toLowerCase()}', '${
        rows_id["MAX(id)"] + 1
      }', '${delivery_type}', 1);`;

      getDbConnection.get(sql, (err, rows) => {
        if (err) {
          console.log(err);
        }
      });
    });

    // #### ID will be auto incremneted
    sql = `Insert into package ( weight, dimensions,
      destination, source,
         delivery_date,
         value,
         barcode_id,
         category,
         receiver_id,
         status,
         retail_id,
         sender_username,
         card_num)values( '${add_para.weight}', '${
      add_para.dimensions
    }', '${add_para.destination.toLowerCase()}',
    '${add_para.source.toLowerCase()}',
    '${add_para.delivery_date}', '${add_para.weight * 0.7}', '${
      add_para.barcode_id
    }', '${add_para.category.toLowerCase()}', '${add_para.receiver_id}', '${
      add_para.status
    }', '${add_para.retail_id}', '${add_para.sender_username}', 'X');
     select * from package;`;
  }

  //   ##### UPDATE TRACK [DONE]
  if (type == "update-track") {
    sql = `select type from location where pkg_id == '${change_para.package_id}'`;

    getDbConnection.all(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.log(rows.length, "XX");

      if (rows.length == 0) {
        sql = "";
      } else {
        console.log(rows[0].type, "XX");

        sql = `insert into location (location_name, pkg_id,
           type, sequence_num)
      VALUES('${add_para.source.toLowerCase()}', '${change_para.package_id}',
       '${rows[0].type}', '${rows.length + 1}');`;

        getDbConnection.get(sql, (err, rows) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
    sql = "";
  }

  //   ##### SHOW-USER PACKAGES [DONE]
  if (type == "show-user") {
    console.log(username);
    sql = `select *
        from PACKAGE where sender_username == '${username}';
    `;
  }

  //   ##### SHOW-USER RECIEVED [DONE]
  if (type == "coming-pkgs") {
    console.log(username);
    sql = `select id, weight,
       destination, delivery_date,
        category, receiver_id,
         status, retail_id, sender_username, source
          from PACKAGE where receiver_id == '12345';
      `;
  }

  //   ##### update-pass [DONE]
  if (type == "update-pass") {
    console.log(new_pass);
    sql = `update user set password= ${new_pass}
       where username == '${username}';
      `;
  }

  //   ##### update-email [DONE]
  if (type == "update-email") {
    sql = `update user set email= '${new_email}'
           where username == '${temp}';
          `;
  }
  //----------------------Search---------------------------------

  //   ##### SEARCH CATEGORY [DONE]
  if (type == "search-category") {
    console.log("XX", username);
    sql = `SELECT * from  package where category  == "${category}" and sender_username == '${username}';`;

    if (username == "ADMIN") {
      sql = `SELECT * from  package where category  == "${category}";`;
    }
  }

  //   ##### SEARCH CITY [DONE]
  if (type == "search-city") {
    sql = `SELECT * from  package where destination  == "${city.toLowerCase()}" and sender_username == '${username}';`;

    if (username == "ADMIN") {
      sql = `SELECT * from  package where destination  == "${city.toLowerCase()}";`;
    }
  }

  //   ##### SEARCH DATE [DONE]
  if (type == "search-date") {
    sql = `select * from package where delivery_date >= '${date.start}' 
    and delivery_date <= '${date.end}'
    and sender_username == '${username}'
      ;`;
    if (username == "ADMIN") {
      sql = `select * from package where delivery_date >= '${date.start}' 
      and delivery_date <= '${date.end}'
      ;`;
    }
  }

  //   ##### SEARCH many-USER [DONE]
  if (type == "search-many") {
    sql = `select * from package where sender_username == '${username}'
    and destination == '${city.toLowerCase()}'
    and delivery_date >= '${date.start}' and delivery_date <= '${date.end}'
    and category == '${category.toLowerCase()}'`;
  }

  //   ##### SEARCH many-ADMIN [DONE]
  if (type == "search-many-admin") {
    sql = `select * from package where destination == '${city.toLowerCase()}'
    and status == '${add_para.status}'
    and category == '${category.toLowerCase()}'`;
  }

  //   ##### SEARCH STATUS & DATE [DONE]
  if (type == "search-date-status") {
    sql = `select * from package where status == '${add_para.status}'
    and delivery_date >= '${date.start}' and delivery_date <= '${date.end}'`;
  }

  //   ##### SEARCH STATUS & CATEGORY [DONE]
  if (type == "search-date-cate") {
    sql = `select count(*) as 'total' , category from PACKAGE  where  delivery_date >= '${date.start}' and delivery_date <= '${date.end}' GROUP by category`;
  }

  //   ##### SEARCH CUSTOMER [DONE]
  if (type == "search-customer") {
    sql = `select * from package where sender_username == '${temp}' 
    ;`;
  }

  //   ##### SEARCH CUSTOMER [DONE]
  if (type == "edit-email") {
    sql = `update user set email == '${email}' where username == '${temp}' 
    ;`;
  }

  //   ##### SEARCH PAYMENT [COMPLETE]
  if (type == "search-payment") {
    console.log(date.start);
    sql = `select * from package where card_num not in ('X') 
    ;`;
  }

  //   ##### CONFIRM PAYMENT [COMPLETE]
  if (type == "confirm-payment") {
    sql = `update package set card_num = '${card}' where id == '${change_para.package_id}' `;
    getDbConnection.get(sql, (err, rows) => {});
    sql = `select * from package where sender_username == '${username}'`;
  }

  //   ##### TRACKING [DONE]
  if (type == "search-track") {
    console.log(date.start);
    sql = `select * from location where pkg_id == '${change_para.package_id}'
    ;`;
  }

  getDbConnection.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    if (type == "changex") {
      res.redirect("/home");
    } else if (type == "update-passx") {
      res.render("home");
      // res.redirect("/home");
    }
    res.render("test", {
      rows: rows,
      type: type,
      email: email,
      username: username,
    });
    console.log(rows);
    // console.log("XX", res.cookie.user);
  });
});

//----------------------Confirm Payment---------------------------------
// app.post("/test/:id/:username", (req, res) => {
//   const package_id = req.params.id;
//   const username = req.params.username;
//   const card = req.body.card;

//   sql = `update package set card_num = '${card}' where id == '${package_id}' `;
//   getDbConnection.get(sql, (err, rows) => {
//     sql = `select * from package where sender_username == '${username}'`;

//     getDbConnection.all(sql, [], (err, rows) => {
//       if (err) {
//         return console.error(err.message);
//       }

//       console.log("XX", package_id);
//       // console.log("XX", req.query.username);

//       res.render("test", { type: "show-user", rows: rows, username: username });
//       // res.redirect("");
//     });
//   });
// });

//----------------------Home Page Index---------------------------------

app.get("/", (req, res) => {
  res.render("welcome", { problem: "" });
});

app.get("/refresh", (req, res) => {});

// listening after compilation
app.listen(port, () => {
  const location = `http://localhost:${port}/`;
  console.log(`Open on this port ${location} to use the API :P !`);
});
