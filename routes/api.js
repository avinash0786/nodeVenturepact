var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();

//verify token
function verifyToken(req, res, next) {
  console.log("Verifying request");
  const bearer = req.headers["authorization"];
  if (typeof bearer !== "undefined") {
    req.token = bearer.split(" ")[1];
    next();
  } else {
    res.sendStatus(403);
  }
}

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Root API route");
});

router.get("/main", (req, res) => {
  res.send("request for Main API route");
});

router.get("/login", (req, res) => {
  let user = {
    id: 23,
    name: "Avinash",
    age: 20,
  };
  //to create a authenticated user we first authenticate the user and then generate the tocken and use the token for all next requests
  jwt.sign({ user }, "mysecretKey", (err, token) => {
    res.json({ token });
  });
});

router.post("/secure", verifyToken, (req, res) => {
  console.log("Api secure request rec");
  jwt.verify(req.token, "mysecretKey", (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      res.json({
        message: "Secure access",
        data: authData,
      });
    }
  });
});

router.get("/setSession", (req, res) => {
  console.log("Setting session");
  req.session.newSessAPIVAl = "new sess val set from the API route";
  res.json(req.session);
});

router.get("/clearSession", (req, res) => {
  req.session.destroy();
  res.send("session delete");
});

router.get("/getSession", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.json(req.session);
});
module.exports = router;
