var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('等静态文件打包好了再部署上来');
});

module.exports = router;
