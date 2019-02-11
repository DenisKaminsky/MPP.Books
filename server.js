var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));

app.get("/api/books", function(req, res){
      
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
    res.send(books);
});

//get book by id
app.get("/api/books/:id", function(req, res){
      
    var id = req.params.id; //get id
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
    var book = null;

    //searsch book by id
    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            book = books[i];
            break;
        }
    }

    //send book
    if(book){
        res.send(book);
    }
    else{ 
        res.status(404).send();
    }
});

//add book
app.post("/api/books", jsonParser, function (req, res) {
     
    if(!req.body) 
        return res.sendStatus(400);
     
    var book = {title: req.body.title, author: req.body.author, release: req.body.release};
     
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
     
    //search max id
    var id = Math.max.apply(Math,books.map(function(o){return o.id;}))
    //inc it
    book.id = id+1;
    //add book
    books.push(book);
    var data = JSON.stringify(books);
    //rewrite file
    fs.writeFileSync("books.json", data);
    res.send(book);
});

//delete by id
app.delete("/api/books/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var index = -1;

    //search book index
    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            index=i;
            break;
        }
    }

    if(index > -1){
        //delete book 
        var book = books.splice(index, 1)[0];//deleted element
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        //send deleted book
        res.send(book);
    }
    else{
        res.status(404).send();
    }
});

//modify book
app.put("/api/books", jsonParser, function(req, res){
      
    if(!req.body) 
        return res.sendStatus(400);
     
    var bookId = req.body.id;     
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var book;

    for(var i=0; i<books.length; i++){
        if(books[i].id==bookId){
            book = books[i];
            break;
        }
    }
    //modify data
    if(book){
        book.title = req.body.title;
        book.author = req.body.author;
        book.release = req.body.release;
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        res.send(book);
    }
    else{
        res.status(404).send(book);
    }
});
  
app.listen(3000, function(){
    console.log("Server started...");
});