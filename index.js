var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", function (request, response) {
response.render("home");
  });

app.get("/login", function (request, response) {
    response.sendFile(__dirname+"/login.html");
  });
  
app.get("/signup", function (request, response) {
    response.render("signup");
  });

//signup
app.post("/save", function (request, response) {

    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "students",
    });
  
    var username = request.body.username;
    var password = request.body.password;
    var fname = request.body.fname;
    var gender = request.body.gender;
    var pno = request.body.pno;
    
    connection.connect(function (errror) {
        connection.query("select * from g22", function (errror, result) {
          var obj=false;
          result.find((o, i) => {
            if (o.username === username) {
              obj=true;
              return true;
            }
          });
          if(obj==true){
            console.log("found");
          }
          else{
            console.log("not found");
            var sql ="insert into g22(username,password,fname,gender,pno) values('"+username+"','"+password+"','"+fname+"','"+gender+"','"+pno+"')";
            connection.query(sql,function(errror){
            response.redirect("/")
            })
          }
        });
      });
});

//login
app.post("/signin",function(request,response){

    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "students",
      });
    var username = request.body.username;
    var password = request.body.password;

    connection.connect(function (errror) {
        connection.query("select * from g22", function (errror, result) {
          var obj=false;
          var name;
          result.find((o, i) => {
            if (o.username === username && o.password===password) {
              obj=true;
              name=o.fname;
              return true;
            }
          });
          if(obj==true){
            connection.query("select * from g22 where username='"+username+"'",function(errror,results){
                response.render("profile",{results:results});
            })
          }
          else{
            response.redirect("/")
          }
        });       
      }); 
})

app.get('/reset',function(request,response){
    var connection=mysql.createConnection({host:"localhost",user:"root",password:"",database:"students"})
    connection.connect(function(errror)
    {
        connection.query("select * from g22 where id=?",[request.query.id],function(errror,result)
        {
            response.render("update",{result:result})
        })
    })
})
app.post("/reset_data",function(request,response){
    var connection=mysql.createConnection({host:"localhost",user:"root",password:"",database:"students"})

    connection.connect(function(errror)
    {
        var password= request.body.password;
        var new_password= request.body.new_password;
        var username=request.body.username;

        connection.query("select * from g22", function (errror, result) {
            var obj=false;
            var name;
            result.find((o, i) => {
              if (o.username === username && o.password===password) {
                obj=true;
                name=o.fname;
                return true;
              }
            });
            if(obj==true){
              
              var sql="update g22 set password=?  where username=?"
              connection.query(sql,[new_password,username],function(errror,result)
              {
              response.render("home")
            })
            }
            else{
              console.log("invalid password");
              
            }
          }); 
    })
})
app.listen(3000);


