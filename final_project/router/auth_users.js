const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    console.log(users)
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.userName;
  let password = req.body.password;

  if(!username || !password){
    return res.send("Please provide your credentials")
  }

  if(isValid(username) === false){
    return res.send("Please provide a valid username")

  }

  if(authenticatedUser(username,password)){

    /// sign in user using json web token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 120 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.send({
    "result": "User successfully logged in"
  });
  } else {
    return res.send(
        {
            "result": "Invalid credentials"
        }
    );
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let review = req.body.review;
  let isbn = req.params.isbn;
  if(review){
    books[isbn]['reviews'][username] = {
        "username": username,
        "review": review
    };
    console.log(books)
   

    return res.send({
        "result": "review added",
        "book": books[isbn]
    })
  }
  return res.send({
    "result": "please add a review"
})
  
});


regd_users.delete("/auth/review/:isbn", (req,res) => {
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;
    delete books[isbn]['reviews'][username]

    return res.send({
        "result": "review deleted"
    })
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
