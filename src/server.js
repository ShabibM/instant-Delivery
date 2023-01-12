// require express server for running app
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser"); //Body Parser is used to get the front-end inputs from the user
const logger = require("morgan"); //morgan is used to log the requests in the console in a nice format

// ---------- Import routers ----------
const router = require("./routes/pages");
// const auth_router = require("./routes/authRouter");
const test_router = require("./routes/test_router");

// ---------- save express method function in app ----------
const app = express();
const port = 4000;

// ---------- Setting up the view engine ----------
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// setting up  Morgan logger
app.use(logger("dev"));

//-----------------------------------

// ---------- Setting up the body parser, public folder, and JSON ----------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// use path for joining other directories folder files
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname + "/public"));

//---------------- Setting Sessions -------------------

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

// ---------- middleware connecting the router ----------

app.use(router);
// app.get(auth_router);
app.use(test_router);

//-----------------------------------

// app.get("/home", (req, res) => {
//   console.log("XZ", req.session.id);
//   res.render("home");
// });

//---------------------- Server Listening---------------------------------

// listening after compilation
app.listen(port, () => {
  const location = `http://localhost:${port}/`;
  console.log(`Open on this port ${location} to use the API :P !`);
});
