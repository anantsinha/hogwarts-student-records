const express = require('express');
const server = express();
server.use(express.json());
var MongoClient = require('mongodb').MongoClient;
const port = process.env.port || 5000;
const bodyParser = require("body-parser");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
const db_uri = "mongodb+srv://anant:<password>@cluster0-wded1.mongodb.net/test?retryWrites=true"; //my db
let client;
let db;

const connectToDb = async () => {
  if (client == undefined){
    try{
      client = await MongoClient.connect(db_uri, { useNewUrlParser: true });
      db = client.db('hogwarts');
    } catch(err){
      console.log('Error while connecting to database\n', err);
    }
  }
}

connectToDb();

const isValidStudent  = (student) => {
  let name = student.name;
  let house = student.house;
  let year = student.year;
  let gender = student.gender;
  let title = student.title;
  if (name==undefined||house==undefined||year==undefined||gender==undefined)
    return false;
  else
    return true;
}



/**************************** ROUTES *********************/
server.get ('/', (req,res) => {
	res.send ('Welcome to Hogwarts School of Witchcraft and wizardry Student Data records.'+
  'The muggles have made it easy for us to keep track of our students');
	});

server.get('/students', async (req,res) => {
      let studentList = [];
        const students = db.collection('students');
        try{
          if (req.body.s_id == undefined){
            studentList = await students.find().toArray();
          } else {
            studentList = await students.find({s_id: req.body.s_id}).toArray();
          }
        } catch(err){
            console.log('Error while accessing all students\n',err);
            res.status(400);
          } finally {
            res.send(studentList);
          }
  });

  server.post('/students/update', async (req,res) => {
    student = {};
    const students = db.collection('students');
      try{
        student = await students.findOne({s_id: req.body.s_id});
        //find details that differ
        //change those details
        students.updateOne(
          {s_id: student.s_id},
          {
            $set: req.body
          }
        );

      } catch(err){
        console.log('Error while updating student\n', err);
        res.status(400);
      } finally {
        res.send('Updated')
      }

  });

server.post('/students/newstudent', async (req,res) => {
  if (isValidStudent(req.body)){
      db.collection('students').insertOne(req.body);
      res.status(200);
      res.send('object added');
}
  else{
    res.status(400);
    res.send("missing required properties");
  }
});

server.post('/students/delete', async (req,res) => {
  let toDelete = req.body;
  let deleted = {};
  let status;
    try{
      let exists = await db.collection('students').find({s_id: req.body.s_id}).toArray();
      if (exists.length==0){
        status = 404;
        console.log('Attempt to delete non-existent student\n\n',req.body);
      }
      await db.collection('students').deleteOne(req.body);
    } catch(err){
      console.log('Error while deleting student\n',err);
      status = 404;
    } finally {
      if (status==undefined){
        status = 204;
      }
      res.status(status);
      res.send('Deleted');
    }
  });


//send 404 for invalid routes
  server.use((req, res) => {
     res.sendStatus(404);
  });

server.listen(port, () => {
  console.log(`\nServer listening on port: ${port}\n`);
});
