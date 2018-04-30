var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //"app" criado para se usar o express

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.get("/", function(req,res){
	res.render('welcome');
});

app.get("/login", function(req,res){
	res.render('login');
});

app.get("/admin", function(req,res){
	res.render('admin');
});

app.listen('3000', () => { //abrindo a aplicação na porta 3000
	console.log("Server started");
});