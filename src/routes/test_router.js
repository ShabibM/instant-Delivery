const express = require("express");
const router = express.Router();
// const { getDbConnection } = require("../server");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

//-----------------------------------

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

//-----------------------------------

//----------------------Testing page---------------------------------

router.get("/test", (req, res) => {
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
    if (username == "shabib3") {
      sql = `select id, weight,
       destination, delivery_date,
        category, receiver_id,
         status, retail_id, sender_username, source
          from PACKAGE where receiver_id == '321456';
      `;
    }
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
    sql = `select * from location where pkg_id == '${change_para.package_id}'
    ;`;
    if (username != "ADMIN") {
      sql = `select * from location l join package p on p.id == l.pkg_id
     where pkg_id == '${change_para.package_id}' and sender_username == '${username}'`;
    }
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

module.exports = router;
