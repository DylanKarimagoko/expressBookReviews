const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let userName = req.body.userName;
  let password = req.body.password

  if(!userName || !password){
    return res.send("Please provide your credentials")
  }
  else {
    if(!users.includes({"username":userName, "password": password})){
        users.push({"username":userName, "password": password})
        console.log(users);
        return res.send({
            "result": "user " + userName + " has been registered"
          });
    }
    else {
        return res.send({
            "result": "user already exists"
        })
    }
  }
  
});

// Get the book list available in the shop
public_users.get('/',function async(req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
 
  if(book){
    return res.send(books[isbn]);
  }
  else {
    return res.send("No books found");
  }
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bks = [];
  for(let value of Object.values(books)){
    if(value['author'] === author){
        bks.push(value)
    }
  }
  if(bks.length === 0){
    return res.send("No books found")
  }
  else {
    return res.send(JSON.stringify(bks))
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let ttls = [];
  for(let value of Object.values(books)){
    if(value['title'] === title){
        ttls.push(value)
    }
  }
  if(ttls.length === 0){
    return res.send("No books found")
  }
  else {
    return res.send(JSON.stringify(ttls))
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let reviews = books[isbn]
  if(reviews){
    let size = Object.keys(reviews['reviews']).length;
    return res.send({
        "Number of reviews": size,
        "reviews": reviews['reviews']
    })
  }
  else {
    res.send("Book not found")
  }
});

module.exports.general = public_users;
