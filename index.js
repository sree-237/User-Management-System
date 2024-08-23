const { faker, en } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
 app.use(methodOverride("_method"));
 app.use(express.urlencoded({extended : true}));
 app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, 'public')));

const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'new_app',
  password : 'Sreekar@75'
});
let getRandomUser = ()=>{
  return [
     faker.string.uuid(),
     faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
   
  ];
}


// let q = "insert into user(id,username,email,password) values ?";
// let data = [];
// for (let i=1;i<=100;i++){
//   data.push((getRandomUser()));
// }
// try{
//   connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   })
// } catch(err){
//   console.log(err);
// }
// connection.end();

//home route
app.get("/", (req, res) => {
  const { search} = req.query;

  let countQuery = 'SELECT COUNT(*) AS count FROM user';
  let searchQuery = 'SELECT * FROM user WHERE username = ? OR email = ?';

  try {
    // Execute the count query first
    connection.query(countQuery, (err, countResult) => {
      if (err) throw err;

      let count = countResult[0].count;

      // If search parameters are provided, execute the search query
      if (search) {
        connection.query(searchQuery, [search,search], (err, users) => {
          if (err) throw err;

          // Render the view with both count and search results
          res.render("home.ejs", { count, users: users || [], search: true });
        });
      } else {
        // If no search parameters, just render with the count
        res.render("home.ejs", { count, users: [], search: false });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in the database");
  }
});

//show route
app.get("/user",(req,res)=>{
  let q = 'select * from user';
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
    
    res.render("users.ejs",{users});
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }
  
});
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `select * from user where id = '${id}' `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs",{user});
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }
  
});
//update route
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formPass, username: NewUsername} = req.body;
  let q = `select * from user where id = '${id}' `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("WRONG password");
      }
      else{
        let q2 = `update user set username="${NewUsername}" where id ="${id}"`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }
  
});
//add route
app.post("/user",(req,res)=>{
  const id = faker.string.uuid();
  const{username,email,password} = req.body;
  let q3 = `insert into user(id,username,email,password) values (?,?,?,?)`;

  try{
    connection.query(q3,[id,username,email,password],(err,result)=>{
      if(err) throw err;
      
      res.redirect("/user");
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }

});
//delete route 
app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let q = `select * from user where id = '${id}' `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("delete.ejs",{user});
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }
  
})
app.delete("/user/:id",(req,res)=>{
  const{password,email} = req.body;
  let q4 = `delete from user where password = "${password}" and email = "${email}"`;
  try{
    connection.query(q4,(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
    });
  } catch(err){
    console.log(err);
    res.send("some error in database");
  }
  
});
app.get('/test', (req, res) => {
  res.send('<link rel="stylesheet" href="/styles.css">Test Page');
});


app.listen("8080",()=>{
  
  console.log("server is listening to port 8080");
});




 