const express =require('express');
const app =express();
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
var cors = require('cors');
// serve files in static' folder at root URL '/'
app.use('/', express.static("."));
//var fetch = require('node-fetch');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cors());
  var mongoDB = 'mongodb://localhost/Library';
  mongoose.connect(mongoDB, { useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  
app.get("/available-items", (req, res) => {debugger
    db.collection('itemsAvailable').find({}).toArray(function(err, result) {debugger
      if (err)
        res.status(500).send({"statusMessage" : "Error retrieving available items from DB"});
      else {
        res.status(200).send({"statusMessage" : "Successfully retrieved available items from DB", "result" : result});
      }
    })
  });
      
app.get("/due-date", (req, res) => {debugger
  db.collection('dueDatesObj').find({}).toArray(function(err, result) {debugger
    if (err)
      res.status(500).send({"statusMessage" : "Error retrieving available items from DB"});
    else {
      res.status(200).send({"statusMessage" : "Successfully retrieved available items from DB", "result" : result});
    }
  });
  });

  app.post("/libraryitem", (req, res) => {debugger
    db.collection('itemsAvailable').insert(req.body, function(err, result) {
        if(err) {
          console.log(err);
          res.status(500).send({"statusMessage" : "Error"});
        }
        else
          res.status(200).send({"statusMessage" : "Success" , "result" : result});
      });
  });
  app.delete("/nolibraryitem/:itemid", (req, res) => {debugger
    console.log(req);
    db.collection('itemsAvailable').remove({'item_name' : req.params.itemid}, function(err, result) {
        if(err) {
          console.log(err);
          res.status(500).send({"statusMessage" : "Error"});
        }
        else
          res.status(200).send({"statusMessage" : "Success" , "result" : result});
      });
  });
  app.put("/update_duedate", (req, res) => {debugger
    var dueDateInput = {};
    dueDateInput[req.body.dueItemCategory] = req.body.dueDate ;
    db.collection('dueDatesObj').updateOne({}, { $set:dueDateInput}, function(err, result) {
        if(err) {
          console.log(err);
          res.status(500).send({"statusMessage" : "Error"});
        }
        else
          res.status(200).send({"statusMessage" : "Success" , "result" : result});
      });
  });
  
  

  app.listen(8081, () => {
    console.log("Server running on port 8081");
   });
