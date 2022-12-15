// This is the router for all requests from the Admin
const express = require("express");
const router = express.Router();
// const { getDbConnection } = require("../server");
const sqlite3 = require("sqlite3").verbose();

//######  Home Page Index
router.get("/", (req, res) => {
  res.render("welcome", { problem: "xx" });
});

router.get("/refresh", (req, res) => {});





module.exports = router;
