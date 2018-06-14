var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    // user_name:{
    //     type:String,
    //     required:true
    // },
    // address:{
    //     type:String,
    //     required: true
    // },
    // phone:{
    //     type:String,
    //     required:true
    // },
    // email:{
    //     type:String,
    //     required:true
    // }
        id:{
            type:String
        },
        deptno:{
            type:Number
        },
        dname:{
            type:String
        },
        loc:{
            type:String
        }
},{
    collection:'dept'
})

//exporting the schema
module.exports = mongoose.model('course',UserSchema);