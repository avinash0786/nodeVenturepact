var express = require("express");
var router = express.Router();
var secureController = require("../controllers/secureNg");

router.get("/", (req, res) => {
  console.log("Req for main secure");
  res.json({
    response: "This is my data",
    success: true,
  });
});

router.post("/register", secureController.registerUser);
router.post("/login", secureController.loginUser);
router.get("/checkUserId/:uid", secureController.checkUserName);
router.get("/profile", secureController.profile);
router.post("/update", secureController.updateProfile);

router.get("/logout", (req, res) => {
  console.log("cookies deleted");
  res.clearCookie("auth");
  console.log(req["cookies"]);
  res.status(200).json({
    logout: true,
  });
});

router.get("/isAuth", (req, res) => {
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
router.get("/setCookie/:key", (req, res) => {
  res.cookie("value", req.params.key);
  res.send(req.cookies);
});

router.get("/getCookie", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

module.exports = router;
