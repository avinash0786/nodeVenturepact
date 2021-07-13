var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a user resource');
});

router.get('/about',((req, res) => {
  res.send('request for user/about recieved')
}))

router.get('/id/:userID/name/:myName',((req, res) => {
  res.send("Recieved data User ID: "+req.params.userID+" name: "+req.params.myName);
}))

module.exports = router;
