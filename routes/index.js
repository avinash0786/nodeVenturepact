var express = require("express");
var router = express.Router();
const fs = require("fs");
var path = require("path");
var MainController = require("../controllers/mainContr");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./temp/fileUploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/fileup", MainController.fileUpGet);
router.post(
  "/storeFile",
  upload.single("fileUploaded"),
  MainController.saveFilePost
);

router.get("/getFile/:fileName", (req, res) => {
  res.download("./temp/fileUploads/" + req.params.fileName);
});

router.get("/listFiles", MainController.listUploadedFiles);

router.get("/generatePdf", (req, res) => {
  res.render("pdfGenForm", { title: "Express" });
});

router.post("/savePdfData", MainController.savePdfData);

router.get("/listPdf", MainController.listPdf);

router.get("/getPdf/:fileName", (req, res) => {
  res.download("./temp/pdfFiles/" + req.params.fileName);
});

router.get("/sendEmail", (req, res) => {
  res.render("sendEmail", { title: "Express" });
});

router.post("/deliverEmail", MainController.deliverEmail);

router.get("/listEmails", MainController.listEmails);

router.get("/setHeader", (req, res) => {
  console.log("Setting auth header");
  res.cookie("mySecretToken", "xxx-ssaa-sa1sa-as");
  res.set("Authorization", "my auth key");
  res.send("Set header success");
});
router.get("/getHeader", (req, res) => {
  console.log("Getting auth header");
  console.log("Cookies: ", req.cookies);
  res.send(req.cookies);
});
module.exports = router;
//openid profile email
// https://developers.google.com/oauthplayground
