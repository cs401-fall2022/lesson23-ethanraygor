const sqlite3 = require('sqlite3').verbose()
const { numberOnly } = require('../public/javascripts/helpers.js');
const db = new sqlite3.Database('../mydb.sqlite3');

window.addEventListener("DOMContentLoaded", domLoaded);

function getHomePage(){
   db.each("SELECT blog_id, blog_txt FROM blog",
   (err, row) => {
        document.writeln("<p>"+row.blog_id+" - "+row.blog_txt+"</p>");
   });
}

function post(blogPost){
    var db = new sqlite3.Database('mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if(err){
            console.log("Getting error "+err);
            exit(1);
        }
        console.log("inserting "+blogPost);
        db.exec(`insert into blog ( blog_txt) values ('${blogPost}');`)
    });
}

function domLoaded(){
    getHomePage();

    var postClick = document.getElementById("post");
    var blogPost = document.getElementById("blog").getAttribute("value");

    postClick.addEventListener("click", function () {
        post(blogPost);
    });
}