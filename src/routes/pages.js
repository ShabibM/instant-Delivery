// This is the router for all requests from the Admin
const express = require("express");
const router = express.Router();
const { getDbConnection } = require("../server");

//######  Home Page Index
router.get("/", (req, res) => {
  res.render("welcome");
});

//###### Testing page
router.get("/test", (req, res) => {
  res.render("test");
});

router.get("/refresh", (req, res) => {
  getDbConnection.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    sql = `update package set status= 'lost' where delivery_date <= '${currentDate}'`;
    res.render("home-user", { username: username, password: password });
  });
});

module.exports = router;
