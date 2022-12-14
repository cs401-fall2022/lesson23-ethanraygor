var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()
const { numberOnly } = require('../public/javascripts/helpers.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_txt, blog_date from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL,
                     blog_date date);`,
              () => {
                db.all(` select blog_id, blog_txt from blog`, (err, rows) => {
                  res.render('index', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.blog);
      //This seems safe to insert because all of it will be included in the one string as a blog post
      db.exec(`insert into blog ( blog_txt, blog_date)
                values ('${req.body.blog}', CURRENT_DATE);`)
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/edit', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("sanitizing " + req.body.blognum);
      var str = numberOnly(req.body.blognum);
      db.exec(`UPDATE blog
                SET blog_txt = '${req.body.blog}'
                WHERE blog_id = ${str}`);     
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("sanitizing " + req.body.blog);
      var str = numberOnly(req.body.blog);
      console.log("editing " + str);
      db.exec(`delete from blog where blog_id='${str}';`);     
      res.redirect('/');
    }
  );
})

router.post('/admin', (req, res, next) => {
  console.log("running admin task (managing database)")
  var db = new sqlite3.Database('mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if(err){
      console.log("Getting error " + err);
      exit(1);
    }
    console.log("running" + req.body.blog);
    db.exec(`${req.body.blog}`);
    res.redirect('/');
  }
  );
})

module.exports = router;