//user model to connect database with server end for creating user

var mongoose = require('mongoose');  //grabbing packages that is needed for user model
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema

var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true}},
	password: { type: String, required: true, select: false} 
});

//hashing the password before the user id is saved

UserSchema.pre('save', function(next){
	var user = this;

//hashing the password if the user is new or changing the password

	if (!user.isModified('password')) return next();

//generating the hash

bcrypt.hash(user.password,null, null, function(err, hash){
	if(err) return next(err);

	//changing the password to hash version
	user.password = hash;
	next();
});
});

//method to compare the password to given hash

UserSchema.methods.comparePassword = function(password){
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

//returning the model

module.exports = mongoose.model('User', UserSchema)