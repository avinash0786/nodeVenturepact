require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var fs = require("fs");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expHbs = require("express-handlebars");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var oAuthRoute = require("./routes/oAuth");
var secureRoute = require("./routes/secure");
const MongoStore = require("connect-mongo");
var compression = require("compression");
require("./services/databaseConn");
require("./services/passport");
var multer = require("multer");
var MemoryStore = session.MemoryStore;
var passport = require("passport");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./temp/fileUploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

var app = express();

// view engine setup
let hbs = expHbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
});
let accessLogStream = fs.createWriteStream(
  path.join(__dirname, "request.log"),
  { flags: "a" }
);

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(cookieParser());
app.use(compression());
app.use(logger("dev", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, authentication"
  );
  next();
});

// app.use(
//   session({
//     name: "Node-vent",
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     store: new MemoryStore(),
//   })
// );

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      mongoOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      collectionName: "app-session",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/oauth", oAuthRoute);
app.use("/secure", secureRoute);

app.get("/setSession", (req, res) => {
  console.log("Setting session in root");
  req.session.rootVal = "Session val from root route";
  console.log(req.session);
  res.json(req.session);
});

app.get("/getSession", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.json(req.session);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

/*  Security and auth in nodeJS
 1. Authorization with express middleware
 2. Token-based authentication
 3. Session-based authentication
 4. Using email and password
 5. Node.JS oAuth
 */
