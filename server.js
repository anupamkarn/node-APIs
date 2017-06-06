var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var User = require('../first_api/models/user.js');
var jwt = require('jsonwebtoken'); 
var superSecret = 'iamlearningmeandevelopment';


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connenting database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/data/test');

app.use(function(req, res, next) //CORs request handle, coss origin resourse sharing
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested=With, content-type, \ Authorisation');

	next();
});

app.use(morgan('dev'));  // log all the requests in console

// going to setup route for the pages
//home page
app.get('/', function(req,res)
{
	res.send('voila! welcome to homepage');
});


//creating instance for express router

var apiRouter = express.Router();

//routes for authenticating user

apiRouter.post('/authenticate', function(req,res){
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err,user){
		if(err) throw err;
		if(!user){
			res.json({
				success: false,
				message: 'Authentication failed. User not found!'
			});
		}   else if (user) {

			//checking for password match
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword) {
				res.json({
					success: false,
					message: 'Authentication fail, password not matched!'
				});
			} else {

				//proceedig if user is found and password is passord is correct
				//creating token

				var token = jwt.sign({
					name: user.name,
					username: user.username,
				}, superSecret,{
					expiresIn: 60*60*24 // will expire in 24hr
				});

				//returning the information inclding token as json
				res.json({
					success:true,
					message: 'you got your token',
					token: token
				});

			}
		}
	});
});

//testing subroutes

apiRouter.use(function( req,res,next)
{

	console.log('user came to site!');

    // place of authentication of user

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if(token){ //decoding token
             
    	jwt.verify(token, superSecret, function(err, decoded){
    		if(err) {
    			return res.status(403).send({
    				success:false,
    				message: 'Failed to authenticate token.'
    			});
    		} else {

    			req.decoded = decoded;  //if everything is good, save to request for use in other routes

    			next();
    		}
       	});
	} else {

		//if there is no token
		// retrun an HTTP response of 403 (access forbidden) and an erro messge
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});

	}
});

apiRouter.get('/', function(req, res)
{
	res.json({ message: 'okay this is the much awiated api!'});
});

//routes that end in /users

apiRouter.route('/users')

//creating a user
.post(function(req,res){

	var user = new User(); // creating new instance of User model

	//set the user information which cam from the request
	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;

	//saving the user and checking for errors
	user.save(function(err){
		if (err) {
			//duplicate entry
			if(err.code == 11000)
				return res.json({success: false, message: 'A user with username already exist!'});
			else
				return res.send(err);

		}

		res.json({message: 'A user is created!'});
	});

})

.get(function(req,res){      //returning all the users in json format
		User.find(function(err, users){
			if (err) res.send(err);

			res.json(users);
	});
});

apiRouter.route('/users/:user_id')  //new route added to fing user by specifc id

.get(function(req,res){
	    User.findById(req.params.user_id, function(err, user){
	    	if(err) res.send(err);

	    	res.json(user);
	    })
})

//updating user details
.put(function(req,res){
		User.findById(req.params.user_id, function(err, user){  //using our user module to find our user
			if(err) res. send(err);

			//updating the user info only if its new
			if(req.body.name) user.name = req.body.name;
			if(req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;

			user.save(function(err){
				if(err) res.send(err);

				res.json({message: 'user updated'});
			});
		});
})

.delete(function(req,res){
		User.remove({
			_id: req.params.user_id
		}, function(err,user){
			if(err) return res.send(err);

			res.json({message: 'user is deleted!'});
		});
		
});

//api endpoint to get use information

apiRouter.get('/me',function(req,res){

	res.send(req.decoded);
});

//setting default ulr
app.use('/api',apiRouter);

//listening port

app.listen(port);
console.log('here is the port no! ' + port);