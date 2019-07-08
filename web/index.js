//CHAMANDO PACOTES
var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //"app" criado para se usar o express
var pg = require('knex')({client: 'pg'});
var knexPostgis = require('knex-postgis');
var methodOverride = require('method-override');
var cors = require('cors');
var io = require('socket.io')();
var http = require('http');
var expressSanitizer = require("express-sanitizer");


//CONFIGURAÇÕES GERAIS
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);
app.io = io;


const pgconf = require('pg')
pgconf.defaults.ssl = true


// CONEXÃO COM O BANCO
 var knex = require('knex')({
   client: 'pg',
   connection: 'postgres://jwxsimyoqvdxew:5b045716d82e36a180af30cd8bbfd5ad6d2a3fecc2a6ae8db7f3e49f9242222c@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d40ba6n3knjjq'

 });

// var knex = require('knex')({
// 	client: 'pg',
// 	version: '10.3',
// 	connection: {
// 		host : 'localhost',
// 		user : 'postgres',
// 		password : 'postgres',
// 		database : 'ProjetoMDS'
// 	}
// });

const st = knexPostgis(knex);

app.use("/api", require('./api/api-routes'));

app.use("", require('./routes/web-routes.js'));

app.use(cors());

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

var server = http.createServer(app);
app.io.attach(server);

//inserido em 05/08/18 Paulo Passos
var port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log("server started");
})

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log("teste " + data.my);
	});
});
	   


// app.listen('3000', () => { //abrindo a aplicação na porta 3000
// 	console.log("Server started");
// });
