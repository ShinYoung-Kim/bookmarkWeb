const signUpButtonGhost = document.getElementById('signUp');
const signInButtonGhost = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButtonGhost.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButtonGhost.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


/*
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
	var databaseUrl = `mongodb://localhost:27017/bookmarkWeb`;
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;

		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		database = db;
	});
}

var authUser = function(database, id, password, callback) {
	var users = databse.collection('users');
	users.find({"id" : id, "password" : password}).toArray(function(err, docs) {
		if (err) {
			callback(err, null);
			return;
		}

		if (docs.length > 0) {
			console.log('아이디, 비밀번호 일치하는 사용자 찾음');
			callback(null, docs);
		} else {
			console.log("일치하는 사용자 찾지 못함");
			callback(null, null);
		}
	});
}


const signUpButton = document.getElementById('sign-up-button');
const signInButton = document.getElementById('sign-in-button');

signUpButton.addEventListener('click', () => {
	connectDB();
});
*/