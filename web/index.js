var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //"app" criado para se usar o express
var pg = require('knex')({client: 'pg'});
var knexPostgis = require('knex-postgis');
var session = require('express-session');
var md5 = require('md5');
var consign = require('consign');
var methodOverride = require('method-override');
var expressSanitizer = require("express-sanitizer");

var desordemRouter = require("./routes/desordem.js");
var orgaoRouter = require("./routes/orgaos.js");
var usuarioRouter = require("./routes/usuarios.js");

var sess;
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use(session({
	secret : "shss",
	proxy: true,
    resave: true,
    saveUninitialized: true
}));

//CONEXÃO COM O BANCO
var knex = require('knex')({
  client: 'pg',
  version: '10.3',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : 'postgres',
    database : 'projetoMDS'
  }
});

const st = knexPostgis(knex);

// var result = knex("denuncia").select(st.x('den_local_desordem'), st.y('den_local_desordem')).then(function(result){
// 	console.log(result[0].den_local_desordem);
// });


// consign().include('routes').then();

app.get("/", function(req,res){
	sess = req.session;

	if(sess.email){
		redirect("admin");
	}
	else{
		res.render('login', {failed : 0});
	}
	
});


app.get("/login", function(req,res){
	sess = req.session;

	if(!sess.email){
		res.render('login', {failed : 0});
	}
	else{
		res.redirect('admin');
	}

});
	
// console.log(aux);

app.post("/login", function(req,res){
	sess = req.session;

	var senha = req.body.password;
	var email = req.body.email;

	senha = md5(senha);

	var name = 0;

	knex('usuario').where({
		usu_email : email,
		usu_senha : senha
	}).select().then(function(usuario){
		if(usuario.length <= 0){
			res.render("login", {failed : 1});
		}
		else{
			sess.email = email;
			res.redirect("admin");
		}
	});
});

app.get("/admin", function(req,res){
	sess = req.session;


	if (sess.email) {
		
		knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status from denuncia').then(function(result){

			res.render('admin', {pontos : result.rows});
		});

	}
	else{
		res.render("login", {failed : 0});
	}
});

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

app.use(orgaoRouter);
app.use(desordemRouter);
app.use(usuarioRouter);

app.listen('3000', () => { //abrindo a aplicação na porta 3000
	console.log("Server started");
});