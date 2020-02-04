const mongoose = require('mongoose');
const hash = require('password-hash');


mongoose.set('useFindAndModify', false);
const mongoUrl = 'mongodb://admin:admin@cluster0-shard-00-00-ryrmi.mongodb.net:27017,cluster0-shard-00-01-ryrmi.mongodb.net:27017,cluster0-shard-00-02-ryrmi.mongodb.net:27017/archimydes?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
const opts = { useNewUrlParser: true};
const Schema = mongoose.Schema;

createConnection();

async function createConnection() {
    await mongoose.connect(mongoUrl, opts)
        .then(res => console.log("Connected to Database"))
        .catch(function (reason) {
        	console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
}

const deptschema = new Schema({
    id: Number,
    name: String
});

const userschema = new Schema({
    id: Number,
    name: String,
    email: String,
    departmentId: Number,
    departmentName: String,
    password: String
});

const countschema = new Schema({
    name: String,
    counter: Number
});

const requestschema = new Schema({
    id: Number,
    status: Number,             //  -1: rejected, 1: accepted, 0: pending
    summary: String,
    description: String,
    type: String,
    complexity: String,
    time: String,
    cost: Number,
    uid: Number,
    uname: String,
    uemail: String
});

const deptModel = mongoose.model('departments', deptschema);
const userModel = mongoose.model('users', userschema);
const counterModel = mongoose.model('counters', countschema);
const requestModel = mongoose.model('requests', requestschema);

module.exports = function(app){
	// API calls
    app.get('/isLoggedIn', (request, response) => {
        //console.log(request.session);
        var data = {code: -111};
        if (request.session && request.session.__id && request.session.__email && request.session.__name && request.session.__departmentName && request.session.__departmentId) {
            if(request.session.__departmentId == 1){
                data.code = 111;
            }
            else if(request.session.__departmentId == 2){
                data.code = 222;
            }
        }
        response.end(JSON.stringify(data));
    });

	app.get('/getDepartment', (request, response) => {
		var data = {code: -111};
        deptModel.find({}, function (err, docs) {
            if(!err){
                data.code = 555;
                data.aData = docs;
            }
            response.send(JSON.stringify(data));
        });
	});

	app.post('/signup', (request, response) => {
        var data = {code: -111};
        var instance = new userModel();
        instance.name = request.body.name;
        instance.email = request.body.email;
        instance.departmentId = request.body.departmentId;
        instance.departmentName = request.body.departmentName;
        instance.password = hash.generate(request.body.password);
            
        counterModel.findOneAndUpdate({name: 'users'}, {$inc:{counter:1}}, (err, docscount) => {
                
            instance.id = docscount.counter;
            instance.save(function (err) {
                if (err) response.redirect('http://localhost:3000/signup');
                request.session.__id = instance.id;
                request.session.__email = instance.email;
                request.session.__name = instance.name;
                request.session.__departmentId = instance.departmentId;
                request.session.__departmentName = instance.departmentName;

                request.session.save(function (err) {
                	if(!err){
                		data.code = 555;
                		data.aData = request.session;
            		}
            		response.send(JSON.stringify(data));
                });
            });
        });
    });

	app.post('/login', (request, response) => {
		var data = {code: -111};
        userModel.find({email: request.body.email}, (err, docs) => {
            //if (err) throw err;
            if(docs.length == 0){
            	data.code = 222;
                response.send(JSON.stringify(data));   //user does not exist
            }
            else{
                for(var i = 0 ; i < docs.length ; i++){
                    if(hash.verify(request.body.password, docs[i].password)){
                        //password matches
                        request.session.__id = docs[i].id;
                        request.session.__email = docs[i].email;
                        request.session.__name = docs[i].name;
                        request.session.__departmentId = docs[i].departmentId;
                        request.session.__departmentName = docs[i].departmentName;

                        request.session.save(function (err) {
                            if(!err){
                				data.code = 555;
                				data.aData = request.session;
            				}
                            response.end(JSON.stringify(data));
                        });
                        break;
                    }
                    if(i == docs.length - 1){
                        data.code = 222;
                		response.send(JSON.stringify(data));   //incorrect password
                    }
                }
            }
        });
    });

    app.get('/logout', (request, response) => {
        var data = {code: -111};
        if(request.session){
            request.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    data.code = 555;
                }
                response.send(JSON.stringify(data));
            });
        }
    });

    app.post('/createStory', (request, response) => {
        var data = {code: -111};
        counterModel.findOneAndUpdate({name: 'requests'}, {$inc:{counter:1}}, function (err, docscount) {

            var req_instance = new requestModel();
            req_instance.id = docscount.counter;
            req_instance.summary = request.body.summary;
            req_instance.description = request.body.description;
            req_instance.type = request.body.type;
            req_instance.complexity = request.body.complexity;
            req_instance.time = request.body.time;
            req_instance.cost = request.body.cost;
            req_instance.uid = request.body.user.__id;
            req_instance.uname = request.body.user.__name;
            req_instance.uemail = request.body.user.__email;
            req_instance.status = 0;

            req_instance.save(function (err) {
                if(!err){
                    data.code = 555;
                }
                response.end(JSON.stringify(data));
            });
        });
    });

    app.get('/getStories/:uid', (request, response) => {
        var data = {code: -111};
        var opts = {};
        switch(request.params.uid){
            case 'admin':
            break;
            default:
                opts.uid = request.params.uid;
            break;
        }
        requestModel.find(opts, function (err, docs) {
            if(!err){
                data.code = 555;
                data.aData = docs;
            }
            response.send(JSON.stringify(data));
        });
    });

    app.get('/accept', (request, response) => {
        var resdata = {code: -111};
        requestModel.findOneAndUpdate({id: request.query.id}, {$set:{status: 1 }} , function (err, docs) {
            if(!err){
                resdata.code = 555;
                resdata.id = request.query.id;
            }
            response.end(JSON.stringify(resdata));
        });
    });

    app.get('/reject', (request, response) => {
        var resdata = {code: -111};
        requestModel.findOneAndUpdate({id: request.query.id}, {$set:{status: -1 }} , function (err, docs) {
            if(!err){
                resdata.code = 555;
                resdata.id = request.query.id;
            }
            response.end(JSON.stringify(resdata));
        });
    });

};