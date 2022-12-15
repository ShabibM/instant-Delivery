const express = require("express");
const router = express.Router();
const { getDbConnection } = require("./auth_router");

//############## Testing page ##############

router.get("/test", (req, res) => {
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
  //   ###REMOVE-USER [DONE]
  if (type == "remove-user") {
    sql = `Delete from user where username == '${username}'`;
  }

  //   ###EMAIL [DONE]
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

  //   ###ADD-PACKAGE [DONE]
  if (type == "add") {
    // ##ID will be auto incremneted
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
  //   ###SHOW-USER PACKAGES [DONE]
  if (type == "show-user") {
    console.log(username);
    sql = `select id, weight,
       destination, delivery_date,
        value, category, receiver_id,
         status, retail_id, sender_username
          from PACKAGE where sender_username == '${username}';
      `;
  }

  //   ###SHOW-USER RECIEVED [DONE]
  if (type == "coming-pkgs") {
    console.log(username);
    sql = `select id, weight,
       destination, delivery_date,
        category, receiver_id,
         status, retail_id, sender_username
          from PACKAGE where receiver_id == '${username}';
      `;
  }

  //   ###update-pass [DONE]
  if (type == "update-pass") {
    console.log(new_pass);
    sql = `update user set password= ${new_pass}
       where username == '${username}';
      `;
  }

  //   ###update-email [DONE]
  if (type == "update-email") {
    console.log(new_pass);
    sql = `update user set email= '${new_email}'
           where username == '${username}';
          `;
  }

  //   ###SEARCH CATEGORY [DONE]
  if (type == "search-category") {
    console.log(category);
    sql = `SELECT * from  package where category  == "${category}";`;
  }

  //   ###SEARCH CITY [DONE]
  if (type == "search-city") {
    console.log(city.toLowerCase());
    sql = `SELECT * from  package where destination  == "${city}";`;
  }

  //   ###SEARCH DATE [DONE]
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
    }
    res.render("test", { rows: rows, type: type, email: email });
    console.log(rows);
    console.log(rows.length);
  });
});

module.exports = router;
