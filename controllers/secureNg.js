let ngUser = require("../models/ngData");
let bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.registerUser = function (req, res) {
  console.log("Registering User");
  console.log(req.body);

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.pswd, salt, function (err, hash) {
      console.log("pswd hashed");
      if (err) {
        console.log(err);
        res.status(400).end();
      } else {
        console.log("Running hash OK");

        let nayaNgUser = new ngUser({
          fname: req.body.fname,
          lname: req.body.lname,
          userName: req.body.userName,
          email: req.body.email,
          pswd: hash, //we store the hashed and salted password for security
        });
        nayaNgUser
          .save()
          .then((resData) => {
            console.log(resData);
            res.status(202).json({
              saved: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).end();
          });
      }
    });
  });
};

exports.loginUser = function (req, res) {
  console.log("logging in  User");
  console.log(req.body); //username and password
  console.log("Cookies: ");
  console.log(req.cookies);
  console.log(req["cookies"]["auth"]);

  ngUser
    .findOne({ userName: req.body.userName })
    .lean()
    .then((data) => {
      console.log(data);
      if (data == null) {
        return res.status(404).json({
          status: false,
          info: "User NOT found ! ERROR",
        });
      }
      //match the provided user password and provide the auth tocken
      bcrypt.compare(req.body.pswd, data.pswd, (err, ans) => {
        if (ans === true) {
          console.log("User password matched successs");
          //now we will sign the jwt tocken with the userName
          jwt.sign(
            { userId: req.body.userName },
            "mysecretKey",
            (err, token) => {
              res.cookie("auth", token, {
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: false,
              });

              res.status(200).json({
                jwt: token,
                info: "Jwt signed and sent to client",
                status: true,
              });
            }
          );
        }
        //password not match
        else {
          return res.status(401).json({
            status: false,
            info: "Authentication failed !",
          });
        }
        if (err) {
          return res.status(404).json({
            status: false,
            info: "Error in verifying Password !",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        status: false,
        info: "User found ERROR",
      });
    });
};

exports.checkUserName = function (req, res) {
  let userId = req.params.uid;
  console.log(userId);
  ngUser
    .findOne({ userName: userId })
    .lean()
    .then((data) => {
      console.log(data);
      if (data == null) {
        return res.status(200).json({
          userFound: false,
          availableUser: true,
          status: false,
          info: "User NOT FOUND ",
        });
      }
      //if user is available we cant use the user Name
      res.status(200).json({
        userFound: true,
        availableUser: false,
      });
    })
    .catch((Err) => {
      console.log(Err);
      res.status(404).json({
        status: false,
        info: "User FOUND ERROR",
      });
    });
};

exports.profile = function (req, res) {
  console.log(req["cookies"]["auth"]);
  console.log("Api secure request rec");
  console.log(req["cookies"]["sasa"]);
  if (req["cookies"]["auth"] === undefined) {
    return res.status(401).json({
      redirect: true,
      location: "login",
      message: "Auth token not found",
    });
  }

  jwt.verify(req["cookies"]["auth"], "mysecretKey", (err, authData) => {
    console.log("Inside jwt");
    console.log(authData.userId);
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      ngUser
        .findOne({ userName: authData.userId })
        .lean()
        .then((data) => {
          console.log(data);
          if (data == null) {
            return res.status(404).json({
              userFound: false,
              status: false,
              info: "User NOT FOUND ",
            });
          }
          //if user is available we cant use the user Name
          res.status(200).json({
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            userName: data.userName,
            userFound: true,
            availableUser: false,
          });
        })
        .catch((Err) => {
          console.log(Err);
          res.status(404).json({
            status: false,
            info: "User FOUND ERROR",
          });
        });
    }
  });
};

exports.updateProfile = function (req, res) {
  console.log(req.body);
  if (req["cookies"]["auth"] === undefined) {
    return res.status(404).json({
      status: false,
      message: "Auth token not available",
    });
  }

  jwt.verify(req["cookies"]["auth"], "mysecretKey", (err, authData) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        status: false,
        message: "Auth token not available",
      });
    } else {
      console.log(authData);
      console.log(String(authData.userId));
      //hashing the password
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.pswd, salt, function (err, hash) {
          console.log("pswd hashed");
          if (err) {
            console.log(err);
            res.status(400).end();
          } else {
            console.log("Running hash OK");
            ngUser
              .updateOne(
                { userName: authData.userId },
                {
                  fname: req.body.fname,
                  lname: req.body.lname,
                  userName: req.body.userName,
                  email: req.body.email,
                  pswd: hash,
                },
                { new: true }
              )
              .then((dta) => {
                console.log(dta);
                //now we need to set new cookie and new auth key, bcoz user name is changed
                jwt.sign(
                  { userId: req.body.userName },
                  "mysecretKey",
                  (err, token) => {
                    res.cookie("auth", token, {
                      maxAge: 24 * 60 * 60 * 1000,
                      secure: true,
                      httpOnly: false,
                    });

                    res.status(200).json({
                      jwt: token,
                      info: "Jwt signed and sent to client",
                      status: true,
                    });
                  }
                );
              })
              .catch((error) => {
                res.status(404).json({
                  status: false,
                  message: "Error updating user",
                  err: error,
                });
              });
          }
        });
      });
    }
  });
};
