# Hogwarts Student Records

Hogwarts student records is a RESTful API that allows performing CRUD operations for young witches and wizards. 
Uses MongoDb as persistence layer.

###Installation
```sh
$ git clone https://github.com/anantsinha/hogwarts_students.git
$ npm install
$ npm start
```

# Tests

  - Start the server by writing ` npm start`
  - Then `npm run test` from the project directory to run the automated test suite.
  - Please allow the test suite to complete execution. If you terminate the execution before the process ends, restart the server to avoid unexpected results.
### Endpoints


| Rest Verb | Path | Value returned |
| ------ | ------ | --------|
| GET | /| An intro/welcome message|
| GET | /students | If body is empty, returns list of all students. Else returns students that match the criteria|
| POST | students/update | Updates a student's information.|
| POST | /students/newstudent | Creates a new student record (document)|
| POST | /students/delete | Delets the record (document) of a student|

