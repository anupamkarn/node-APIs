var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test_node',
	connectionLimit: 100
})

connection.connect(function(err){
	if(!!err){
		console.log('Error');
	}
	else{
		console.log('Connected');
		app.listen(8080);
	}
});
// app.use(bodyParser.urlencoded({extented:true}));
app.use(bodyParser.json())

app.post('/', function(req,res){
	
	console.log(req.body);

	//var jsonResponse = req.body[0];
	var values = [];

	//console.log(jsonResponse[0].emailAddress);

	values.push([req.body[0].distance, req.body[0].emailAddress, req.body[0].firstName,
			    req.body[0].id, req.body[0].industry, req.body[0].lastName, req.body[0].location,
			    req.body[0].numConnections, req.body[0].pictureUrl, req.body[0].positions, req.body[0].summary]);

	console.log(values);

	connection.query("INSERT INTO node_test (distance,emailAddress,firstName,id,industry,lastName,location,numConnections,pictureUrl,position,summary) VALUES ?", [values],  
					 function(err,result){
					 	if(!!err)
					 		res.send('Error');
					 	else
					 		res.send('inserted');
					 });
});