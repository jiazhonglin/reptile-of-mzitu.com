var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var superagent = require('superagent')
/* GET home page. */
router.get('/:num', function (req, res, next) {
  //先获取总共有多少页
  //分页爬取链接并下载
  var num = req.params.num
  var childNums = []
  var imgUrls = []
  var dir = path.join(__dirname, '../', '/public/images')
  superagent.get('http://www.mzitu.com/' + num)
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36')
    .set('Connection', 'keep-alive')
    .end(function (err, data) {
      if (err) { console.log(err) }
      console.log('hehe' + JSON.stringify(data))
      var $ = cheerio.load(data.text)
      var dirName = $('.main-title').text()
      var maxNum = $('.pagenavi a').eq(4).text()
      console.log('文件名' + dirName)
      console.log('最大数量' + maxNum)
      maxNum = Number(maxNum)
      for (var i = 1; i <= maxNum; i++) {
        childNums.push(i)
      }
      console.log(childNums)
      mkdirp(dir + '/' + dirName, function (err) {
        if (err) {
          console.log(err);
        }
        else console.log(dir + '文件夹创建成功!');
        async.mapLimit(childNums, 20, function (childNum, cb) {
          superagent.get('http://www.mzitu.com/' + num + '/' + childNum)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36')
            .set('Connection', 'keep-alive')
            .end(function (err, data) {
              var $ = cheerio.load(data.text)
              var url = $('.main-image img').attr('src')
              console.log('图片链接' + url)
              var filename = childNum + '.jpg'
              request({ uri: url, encoding: 'binary' }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  if (!body) console.log("(╥╯^╰╥)哎呀没有内容。。。")
                  fs.writeFile(dir + '/' + dirName + '/' + filename, body, 'binary', function (err) {
                    if (err) { console.log(err); }
                    console.log('o(*￣▽￣*)o偷偷下载' + dir + '/' + filename + ' done');
                    cb(null, null)
                  });
                }
              });
            })
        }, function (err) {
          console.log(err)
          console.log('爬完了')
        })
      });
    })
});

module.exports = router;



