let chai = require('chai');
let chaiHttp = require('chai-http');
let qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
chai.use(chaiHttp);
const expect = chai.expect;

const db_uri = "mongodb+srv://anant:<password>@cluster0-wded1.mongodb.net/test?retryWrites=true"; //my db
let client;
let db;
let students;


describe('Students', async () => {
	before ( async () => {
		//connect to database
		if (client == undefined){
			try{
				client = await MongoClient.connect(db_uri, { useNewUrlParser: true });
				db = client.db('hogwarts');
				students = db.collection('students');
			} catch(err){
				console.log('Error while connecting to database\n', err);
			}
		}
	});

	describe('/POST /students/update', async () => {
		it ("Should change name when correct id is passed", async () => {
			let res;
			try{
				res = await chai.request('http://localhost:5000').post('/students/update').set('content-type', 'application/x-www-form-urlencoded')
				.send(qs.stringify({ s_id: '3', name: 'Ron'}));
			} catch (err) {
				throw err;
			} finally{
					expect(res.status).to.equal(200);
			}
		});

		it ("Should not change name when incorrect id is passed", async () => {
			let res;
			try{
				res = await chai.request('http://localhost:5000').post('/students/update').set('content-type', 'application/x-www-form-urlencoded')
				.send(qs.stringify({ s_id: '23', name: 'Ron'}));
			} catch (err) {
				throw err;
			} finally{
					expect(res.status).to.equal(400);
			}
		});
	});


	describe('/POST /students/delete', async () => {
			it ("Should delete existing student", async () => {
							try{
								await populateDatabase();
							} catch(err){
								throw err;
							}
							finally {
								try{
									res = await chai.request('http://localhost:5000').post('/students/delete').set('content-type', 'application/x-www-form-urlencoded')
									.send(qs.stringify({ s_id: '3', name: 'Ronald'}));
								} catch (err){
									throw err;
								}
								finally {
									expect(res.status).to.equal(204);
								}
							}
			});


		it ("Should fail to delete non-existing student", async () => {
			let res;
			try{
				res = await chai.request('http://localhost:5000').post('/students/delete').set('content-type', 'application/x-www-form-urlencoded')
				.send(qs.stringify({ s_id: '23', name: 'Ron'}));
			} catch (err) {
				throw err;
			} finally{
					expect(res.status).to.equal(404);
			}
		});
	});

	describe('/POST /students/newstudent', async () => {
		it ("Should add a new student when all details are given", async () => {
			let res;
			try{
				res = await chai.request('http://localhost:5000').post('/students/newstudent').set('content-type', 'application/x-www-form-urlencoded')
				.send(qs.stringify({ 	s_id: '3',
  														name: 'Cho',
  														gender: 'Witch',
  														title: 'Prefect',
  														house: 'Ravenclaw',
  														year: '4'}));
			} catch (err) {
				throw err;
			} finally{
					expect(res.status).to.equal(200);
			}
		});


		it ("Should not add a new student when required details are not given", async () => {
			let res;
			try{
				res = await chai.request('http://localhost:5000').post('/students/newstudent').set('content-type', 'application/x-www-form-urlencoded')
				.send(qs.stringify({ 	s_id: '3',
  														gender: 'Witch',
  														title: 'Prefect',
  														house: 'Ravenclaw',
  														year: '4'}));
			} catch (err) {
				throw err;
			} finally{
					expect(res.status).to.equal(400);
			}
		});

	});

  describe('/GET students', () => {
    it('should GET all the students', async ()  => {
			try{
				await students.deleteMany({});
				await populateDatabase();
			} catch (err) {
				throw err;
			}
			let res;
			try{
      	res = await chai.request('http://localhost:5000').get('/students');
			} catch (err) {
				throw err;
			}
			let expected = [
				    {
				        "s_id": "1",
				        "name": "Harry Potter",
				        "gender": "Wizard",
				        "title": "Quiddich Captain",
				        "house": "Gryffindor",
				        "year": "5"
				    },
				    {
				        "s_id": "2",
				        "name": "Hermoine Granger",
				        "gender": "Witch",
				        "title": "Prefect",
				        "house": "Gryffindor",
				        "year": "5"
				    },
				    {
				        "s_id": "3",
				        "name": "Ronald Weasley",
				        "gender": "Wizard",
				        "title": "Prefect",
				        "house": "Gryffindor",
				        "year": "5"
				    },
				    {
				        "s_id": "4",
				        "name": "Ginerva Molly Weasley",
				        "gender": "Witch",
				        "title": "",
				        "house": "Gryffindor",
				        "year": "4"
				    },
				    {
				        "s_id": "5",
				        "name": "Draco Malfoy",
				        "gender": "Wizard",
				        "title": "Prefect",
				        "house": "Slytherin",
				        "year": "4"
				    }
				];
			//_id is automatically added by mongo each time a new student is added
			//it must be removed before checking equality
 			for (let i in res.body){
	 			delete res.body[i]._id;
 			}
	   expect(res.body).to.eql(expected);
    });
  });
});


const populateDatabase = () => {
	let harry = {
			"s_id": "1",
			"name": "Harry Potter",
			"gender": "Wizard",
			"title": "Quiddich Captain",
			"house": "Gryffindor",
			"year": "5"
	};

	let hermoine = {
			"s_id": "2",
			"name": "Hermoine Granger",
			"gender": "Witch",
			"title": "Prefect",
			"house": "Gryffindor",
			"year": "5"
	};

	let ron = {
			"s_id": "3",
			"name": "Ronald Weasley",
			"gender": "Wizard",
			"title": "Prefect",
			"house": "Gryffindor",
			"year": "5"
	};

	let ginny = {
			"s_id": "4",
			"name": "Ginerva Molly Weasley",
			"gender": "Witch",
			"title": "",
			"house": "Gryffindor",
			"year": "4"
	};

	let draco = {
			"s_id": "5",
			"name": "Draco Malfoy",
			"gender": "Wizard",
			"title": "Prefect",
			"house": "Slytherin",
			"year": "4"
	};
	students.insertMany([harry, hermoine, ron, ginny, draco]);
}

describe('/GET invalidpath', () => {
	it ('Should return 404 for non existent path', async () =>{
		try{
			res = await chai.request('http://localhost:5000').get('/invalid');
		} catch (err) {
			throw err;
		} finally{
			expect(res.status).to.equal(404);
		}
	});
});
