//importing modules
var express = require ('express');
var mongoose = require ('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var ejs = require('ejs');
var app = express();


const route = require('./routes/route.js');

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/test');

//on connection
mongoose.connection.on('connected',()=>{
    console.log('connected to database mongodb @ 27017');
});
//if error
mongoose.connection.on('error',(err)=>{
    if(err){
    console.log('error connecting to database mongodb' +err);}
     console.log('connected to database mongodb @ 27017');
});    

const port = 3000;
//adding middleware - cors
app.use(cors());
//body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
extended: true}));
//static files

//setting view engine
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname + 'public'));
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.set("view options", {layout: false});


//routes
app.use('/api',route);


//testing Server
app.get('/',(req,res)=>{
    res.send('foobar');
})

app.listen(port,()=>{
    console.log('Server started at port: '+ port);
})