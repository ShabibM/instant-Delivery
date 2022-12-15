// require express server for running app
const express = require("express");

// set up DT
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// --Import routers
// const router = require("./routes/pages");
// const auth_router = require("./routes/auth_router");
// const test_router = require("./routes/test_router");

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

// app.use("/home", (req, res, next) => {
//   console.log("XX");
//   next();
// });

// #### middleware connecting the router
// app.use(router);
// app.use(auth_router);
// app.use(test_router);

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

//###### HOME page
app.get("/home", (req, res) => {
  const opType = req.query.opType;
  const username = req.query.username;
  const email = req.query.email;
  const password = req.query.password;
  let currentDate = new Date().toJSON().slice(0, 10);

  if (opType == "signup") {
    sql = `select username, email from user where
     username == '${username}' and email == '${email}'`;

    getDbConnection.all(sql, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      if (rows.length == 0) {
        //   Successful
        sql = `insert into user (username, email, password, date_created)
         values ('${username}', '${email}', '${password}', '${currentDate}');
        `;
        getDbConnection.get(sql, (err, row) => {
          if (err) {
            res.render("welcome");
            return console.error(err.message);
          }
        });
        res.render("welcome", { username: username, problem: "NO PRO" });
        // console.log(rows);
        // console.log("DONE");
        // console.log(err);
      } else if (rows[0].email == email) {
        // EMAIL is used
        res.render("welcome", { username: username, problem: "EMAIL" });
        console.log("EMAIL USED");
      } else {
        // username is used
        // Back to welcomepage
        res.render("welcome", { username: username, problem: "USER" });
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
        res.redirect("/");
      }

      //   ###refresh to update the status
      // sql = `update package set status= 'lost' where delivery_date <= '${currentDate}'`;
      // HAVE ACCOUNT
      // res.redirect("/refresh");
      // res.render("home-user", { username: username, password: password });
      console.log(rows);
      res.render("home-user", { username: username, password: password });
    });
  }
  // Admin
  else {
    res.render("home", { username: "ADMIN" });
  }

  //   console.log(req.query.opType);
});

//############## Testing page ##############

app.get("/test", (req, res) => {
  const id = req.query.id;
  const type = req.query.type;
  const username = req.query.username;
  const new_email = req.query.newEmail;
  const new_pass = req.query.newPass;
  const email = req.query.email;
  const category = req.query.category;
  const city = req.query.city;
  const date = { start: req.query.datestart, end: req.query.dateend };

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
    sql = `SELECT * FROM package `;
    // sql = `SELECT * FROM package where id == '${id}' `;
    // sql = `select comment, r.id from comments c join recipes r on r.id == c.recipe_id`;
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
    // #### ID will be auto incremneted
    sql = `Insert into package ( weight, dimensions, destination,
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
    }', '${add_para.destination.toLowerCase()}', '${
      add_para.delivery_date
    }', '${add_para.weight * 0.7}', '${
      add_para.barcode_id
    }', '${add_para.category.toLowerCase()}', '${add_para.receiver_id}', '${
      add_para.status
    }', '${add_para.retail_id}', '${add_para.sender_username}', 'X');
      select * from package;`;

    console.log("XX");
  }
  //   ##### SHOW-USER PACKAGES [DONE]
  if (type == "show-user") {
    console.log(username);
    sql = `select id, weight,
       destination, delivery_date,
        value, category, receiver_id,
         status, retail_id, sender_username
          from PACKAGE where sender_username == '${username}';
      `;
  }

  //   ##### SHOW-USER RECIEVED [DONE]
  if (type == "coming-pkgs") {
    console.log(username);
    sql = `select id, weight,
       destination, delivery_date,
        category, receiver_id,
         status, retail_id, sender_username
          from PACKAGE where receiver_id == '${username}';
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
           where username == '${username}';
          `;
  }

  //   ##### SEARCH CATEGORY [DONE]
  if (type == "search-category") {
    console.log(category);
    sql = `SELECT * from  package where category  == "${category}";`;
  }

  //   ##### SEARCH CITY [DONE]
  if (type == "search-city") {
    console.log(city.toLowerCase());
    sql = `SELECT * from  package where destination  == "${city}";`;
  }

  //   ##### SEARCH DATE [DONE]
  if (type == "search-date") {
    console.log(date.start);
    sql = `select * from package where delivery_date >= '${date.start}' and delivery_date <= '${date.end}'
      ;`;
  }

  getDbConnection.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    if (type == "add" || type == "change") {
      res.redirect("/home");
    } else if (type == "update-pass") {
      res.render("home");
    }
    res.render("test", {
      rows: rows,
      type: type,
      email: email,
      username: username,
    });
    console.log(rows);
    console.log(rows.length);
  });
});

//###### Confirm payment
app.get("/test/:id/:username", (req, res) => {
  const package_id = req.params.id;
  const username = req.params.username;

  console.log("XX", package_id);
  // console.log("XX", req.query.username);

  res.redirect("/test");
});

//######  Home Page Index
app.get("/", (req, res) => {
  res.render("welcome", { problem: "xx" });
});

app.get("/refresh", (req, res) => {});

// listening after compilation
app.listen(port, () => {
  const location = `http://localhost:${port}/`;
  console.log(`Open on this port ${location} to use the API :P !`);
});
