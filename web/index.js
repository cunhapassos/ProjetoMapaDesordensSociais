var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //"app" criado para se usar o express
var pg = require('knex')({client: 'pg'});
var session = require('express-session');
var md5 = require('md5');

var sess;

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

// knex.select().from('org_orgao').then(function(result){
// 	console.log(result[0].org_nome);
// });

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.get("/", function(req,res){
	sess = req.session;

	if(sess.email){
		redirect("admin");
	}
	else{
		res.render('login', {failed : 0});
	}
	
});

app.get("/desordem/new", function(req,res){
	sess = req.session;

	if(sess.email){
		var orgaos_result;

		knex.select().from('org_orgao').then(function(result){
			//orgaos_result = result;
			res.render("new_desordem", {orgaos : result });
		})		
	}else{
		res.redirect("../login");
	}
});

app.get("/login", function(req,res){
	sess = req.session;

	if(!sess.email){
		res.render('login', {failed : 0});
	}
	else{
		res.render('admin', {failed : 0});
	}

});

app.post("/desordem/create",function(req,res){
	
	var id = req.body.id;
	var tipo = req.body.tipo;
	var descricao = req.body.descricao;
	var natureza = req.body.natureza;
	var orgao = req.body.orgao;
	orgao = parseInt(orgao);

	knex('desordem').insert({
		des_iddesordem: id,
		des_tipo: tipo,
		des_natureza: natureza,
		des_descricao: descricao,
		org_idorgao: orgao
	}).then(function(){
		res.redirect("../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("new");
	});

})
			
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
		res.render('admin');
	}
	else{
		res.render("login", {failed : 0});
	}
});

app.listen('3000', () => { //abrindo a aplicação na porta 3000
	console.log("Server started");
});