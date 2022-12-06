var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var cors = require('cors');
const { fork } = require('child_process');

var database;

function connectDB() {
    console.log('connectDB()');

    var mongoURL = 'mongodb://localhost:27017/local';

    mongoClient.connect(mongoURL, (err, db) => {
        if (err) {
            console.log('Error Occured');
            return;
        }

        console.log('DB 할당 성공');
        database = db.db('bookmarkWeb');
    });
}

var authUser = (db, email, password, callback) => {
    console.log('AuthUser()');

    var users = db.collection('users');

    users.find({
        email: email,
        password: password
    }).toArray((err, docs) => {

        if (err) {
            console.log('authuser error');
            callback(err, null);
        }

        if (docs.length > 0) {
            console.log('일치하는 유저 존재');
            callback(null, docs);
        }
        else {
            console.log('일치하는 유저 X');
            callback(null, null);
        }
    });
}

var addUser = function (db, email, password, name, callback) {
    console.log('addUser() : ' + email + ", " + password + ', ' + name);

    var users = db.collection('users');

    var directories = db.collection('directories');

    directories.insertMany([{
        title: name,
        location: ".",
        date: new Date()
    }], (err, result) => {
        console.log('파일 추가');
        console.log(result);
    });

    users.insertMany([{
        email: email,
        password: password,
        name: name,
        image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        fileTree: [{ "type": "directory", "name": name, "contents": [] }]
    }], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('회원가입 성공');
        console.log(result);
        callback(null, result);
    });
}

var getUser = (db, email, callback) => {

    console.log('Get user()');

    var users = db.collection('users');

    users.find({ email: email }).toArray((err, docs) => {
        if (err) {
            callback(err, null);
        }

        if (docs.length > 0) {
            callback(null, docs);
        }
        else {
            callback(null, null);
        }
    });
}

var updateUser = (db, name, email, pw) => {

    db.collection('users').updateOne(
        {
            email: email
        },
        {
            $set: {
                name: name,
                email: email,
                password: pw
            }
        });
}

var deleteUser = function (db, email, callback) {

    db.collection('users').deleteOne(
        {
            email: email
        },
        (err, obj) => {
            if (err) {
                callback(err, null);
            }

            if (obj.result.n > 0) {
                callback(null, obj);
                console.log(obj.result.n + ' document deleted!');
            }
            else {
                callback(null, null);
                console.log('0 document deleted!');
            }


        }
    );
}

var app = express();
var router = express.Router();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: 'My key',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

app.get("/main", (req, res) => {
    var name;
    getUser(database, email, (err, docs) => {
        if (docs) {
            name = docs[0].name
        }
    });
    var content = { userName: name };
    res.render('/views/main', content);
    //res.sendFile(__dirname + "/views/main.html")
}

);

app.get("/login", (req, res) =>
    res.sendFile(__dirname + "/public/login.html")
);

app.get("/", (req, res) =>
    res.sendFile(__dirname + "/public/login.html")
);

app.get("/directory", (req, res) => {
    if (database) {
        name = req.session.name;
        email = req.session.email;
        getUser(database, email, (err, docs) => {
            if (docs) {
                console.log(docs[0].fileTree);
                //res.render('directory.ejs', {filetree: docs[0].fileTree});
                res.render('directory.ejs', { browserLink: "https://wikidocs.net/", browserFrame: "https://wikidocs.net/", content: docs[0].fileTree });
            }
        });
    }

}
);

app.get("/addDirectory", (req, res) => {

    getUser(database, email, (err, docs) => {
        if (docs) {
            res.render('addDirectory.ejs', { content: docs[0].fileTree });
        }
    });

})

app.get("/addFile", (req, res) => {
    res.render('addFile.ejs')
})

app.get("/collection", (req, res) =>{

    var fileArray = [];
    var directoryArray = [];

    var users = database.collection('users');
    var files = database.collection('files');
    var directories = database.collection('directories');

    files.find({}).toArray((err, docs) => {
        for (i = 0; i < docs.length; i++) {
            if (directoryArray.indexOf(docs[i].location) == -1) {

            } else {
                <div class="file image file-11">
                                    <div class="file__img" src="docs[i].image"></div>
                                    <div class="file__info">
                                        <h2 class="file__title">
                                            docs[i].title
                                        </h2>
                                        <p class="card-text">docs[i].memo</p>
                                        <div class="card-body">
                                            <a href="#" class="btn btn-dark">수정하기</a>
                                            <a href="#" class="btn btn-dark">바로가기</a>
                                        </div>
                                        <span class="file__date">docs[i].date</span>
                                    </div>
                                </div>
            }
        }
    });
}

    res.render('collection.ejs')
}
    
);

router.post('/addFile', (request, response) => {
    console.log('# POST /addFile');

    var email = request.session.email;
    console.log("email : " + email);

    var body = request.body;
    console.log(body);
    var title = body.title;
    var link = body.link;
    var location = body.location;
    var image = body.image;
    var memo = body.memo;
    var date = new Date();

    //if (title == null)

    if (database) {
        var users = database.collection('users');
        var files = database.collection('files');


        files.insertMany([{
            title: title,
            link: link,
            location: location,
            image: image,
            memo: memo,
            date: date
        }], (err, result) => {
            console.log('파일 추가');
            console.log(result);
        });

        app.get("/click/" + title, (req, res) => {
            getUser(database, email, (err, docs) => {
                if (docs) {
                    res.render('directory.ejs', { browserLink: link, browserFrame: link, content: docs[0].fileTree });
                }
            });
        }
        
        
        );

        var dir = { "type": "file", "name": location + "/" + title };

        var arr = location.split("/");
        getUser(database, email, (err, docs) => {
            if (docs) {
                console.log("suspicious");
                console.log(docs[0].fileTree);
                var loc = docs[0].fileTree;

                console.log("loc");
                console.log(loc);


                for (i = 0; i < arr.length; i++) {
                    for (j = 0; j < loc.length; j++) {

                        if (loc[j].name == location) {
                            loc[j].contents.push(dir);

                        } else if (loc[j].name == arr[i]) {

                            loc = loc[j].contents;
                            console.log("docs[0].fileTree");
                            console.log(docs[0].fileTree);

                            //loc = docs[0].fileTree.concat(loc);
                            //loc = merged.filter((item, pos) => merged.indexOf(item) === pos);

                        }
                    }
                }


                /*
                                loc.forEach(o => {
                                    if (o.name == location) {
                                        o.contents.push(dir);
                                        console.log("들어옴");
                                    }
                                });
                                */








                console.log("final loc");
                console.log(loc);


                users.updateOne({ email: email }, { $set: { fileTree: docs[0].fileTree } });

                response.render('addFile.ejs', { browserLink: link, browserFrame: link });
            }
        });





        /*
        if (location == request.session.name) {
            content = [];
            content.push([{ "type": "directory", "name": title, "contents":[]}]);
            database.users.update({email: email}, {$set: {fileTree: content}});
        } else {
            var dir = [{ "type": "directory", "name": title, "contents":[]}];
            
            database.users.update({email: email}, {$set: {fileTree: content}});
        }
        */

    }


});

router.post('/addDirectory', (request, response) => {
    console.log('# POST /addDirectory');

    var email = request.session.email;
    console.log("email : " + email);

    var body = request.body;
    console.log(body);
    var title = body.title;
    var location = body.location;
    var date = new Date();

    //if (title == null)

    if (database) {
        var users = database.collection('users');
        var files = database.collection('files');
        var directories = database.collection('directories');

        directories.insertMany([{
            title: title,
            location: location,
            date: date
        }], (err, result) => {
            console.log('파일 추가');
            console.log(result);
        });

        var dir = { "type": "directory", "name": location + "/" + title, "contents": [] };

        var arr = location.split("/");
        getUser(database, email, (err, docs) => {
            if (docs) {
                console.log("suspicious");
                console.log(docs[0].fileTree);
                var loc = docs[0].fileTree;

                console.log("loc");
                console.log(loc);


                for (i = 0; i < arr.length; i++) {
                    for (j = 0; j < loc.length; j++) {

                        if (loc[j].name == location) {
                            loc[j].contents.push(dir);

                        } else if (loc[j].name == arr[i]) {

                            loc = loc[j].contents;
                            console.log("docs[0].fileTree");
                            console.log(docs[0].fileTree);

                        }
                    }
                }

                console.log("final loc");
                console.log(loc);


                users.updateOne({ email: email }, { $set: { fileTree: docs[0].fileTree } });

                response.render('addDirectory.ejs', { content: docs[0].fileTree });
            }
        });





        /*
        if (location == request.session.name) {
            content = [];
            content.push([{ "type": "directory", "name": title, "contents":[]}]);
            database.users.update({email: email}, {$set: {fileTree: content}});
        } else {
            var dir = [{ "type": "directory", "name": title, "contents":[]}];
            
            database.users.update({email: email}, {$set: {fileTree: content}});
        }
        */

    }


});

var storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'upload');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 5,
        fileSize: 1024 * 1024 * 10
    }
});

/* /signup 라우팅 */
router.get('/signup', (request, response) => {
    console.log('# GET /signup');

    fs.readFile('/public/login.html', (err, data) => {
        if (err) throw err;

        response.write(data);
        response.end();
    });
});

router.post('/signup', (request, response) => {

    var body = request.body;
    var email = body.email;
    var pw = body.pw;
    var name = body.name;

    console.log(email + ', ' + pw + ', ' + name);

    if (database) {
        addUser(database, email, pw, name, (err, result) => {
            if (err) {
                console.log('회원가입 중 오류 발생');
                response.send('<h1>회원가입 중 오류 발생</h1>');
            }

            if (result) {
                console.log('회원가입 성공');
                /*
                                var directories = database.collection('directories');
                
                        directories.insertMany([{
                            title: name,
                            location: ".",
                            date: new Date()
                        }], (err, result) => {
                            console.log('파일 추가');
                            console.log(result);
                        });
                        */

                response.redirect('/public/login');
            }
        });
    }
    else {
        console.log('데이터베이스 연결 안됨.');
        response.send('<h1>Database unconnected</h1>');
    }
});

router.route('/login').get((request, response) => {
    console.log('# GET /login');

    fs.readFile('/public/login.html', 'utf8', (err, data) => {
        if (err) throw err;

        response.write(data);
        response.end();
    });
});

router.post('/login', (request, response) => {
    console.log('# POST /login');

    var body = request.body;
    console.log(body);
    var email = body.email;
    const pw = body.pw;

    console.log(email + ", " + pw);

    if (database) {
        authUser(database, email, pw, (err, docs) => {
            if (err) {
                console.log('에러발생');
                response.end();
            };

            if (docs) {
                console.log(docs);
                console.log('로그인 성공');
                /*
                request.session.user = {
                    email: email,
                    pw: pw,
                    authoirze:true
                }
                */
                /*
                request.session.save(function(){
                    response.redirect('/views/main.ejs');
                })
                */

                getUser(database, email, (err, docs) => {
                    if (docs) {
                        request.session.name = docs[0].name;
                        request.session.email = docs[0].email;
                        request.session.fileTree = docs[0].fileTree;
                        response.render('main.ejs', { userName: docs[0].name });
                    }
                });

            }
            else {
                console.log('로그인 실패');
                response.redirect('/public/login');
            }
        });
    }
});

/* modify Routing */
router.get('/modify', (request, response) => {
    console.log('# GET /modify');

    var email = request.session.user.email;

    if (email) {
        console.log('로그인 된 email : ' + email);

        getUser(database, email, (err, docs) => {
            if (err) {
                console.log('데이터 검색 중 오류 발생');
                return;
            }

            if (docs) {
                var html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h1>회원정보 수정</h1>
                    <form action="/modify" method="post">
                        <div>
                            <label for="">Name</label>
                            <input type="text" name="name" value="${docs[0].name}">
                        </div>
                        <div>
                            <label for="">email</label>
                            <input type="text" name="email" value="${docs[0].email}">
                        </div>
                        <div>
                            <label for="">Password</label>
                            <input type="password" name="pw" value="${docs[0].password}">
                        </div>
                        <button>Submit</button>
                    </form>

                    <form action="/drop" method="post">
                        <input type="hidden" value="${docs[0].email}" name="email">
                        <button>회원탈퇴</button>
                    </form>
                </body>
                </html>
                `;

                response.write(html);
                response.end();
            }
        });
    }
    else {
        response.send('<h1>로그인이 되어있지 않습니다.</h1><a href="/login">로그인</a>');
    }
});
router.post('/modify', (request, response) => {

    console.log('# POST /modify');

    var body = request.body;
    var name = body.name;
    var email = body.email;
    var pw = body.pw;

    if (database) {
        console.log('회원 정보 수정');
        updateUser(database, name, email, pw);
    }
});

router.post('/drop', (request, response) => {

    var email = request.body.email;

    console.log('회원탈퇴할 email : ' + email);

    if (database) {
        deleteUser(database, email, (err, obj) => {

            if (err) {
                console.log('회원 탈퇴 도중 에러 발생');
                response.redirect('/modify');
            }

            if (obj) {

                console.log('회원 탈퇴 완료');
                request.session.destroy((err) => {
                    if (err) throw err;

                    console.log('로그아웃 완료');
                });

                response.redirect('/public/login');
            }
        });
    }
});

app.use('/', router);

/*
app.all('*', (request, response) => {
    response.status(404).write(fs.readFileSync('html/404.html', 'utf8'));
    response.end();
});
*/

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
    connectDB();
});