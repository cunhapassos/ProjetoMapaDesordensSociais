var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');

var config = require("../config/db.js");
db = config.database;
var knex = require('knex')(db);


//DEFININDO SESSION
var sess;
router.use(session({
	secret : "shss",
	proxy: true,
    resave: true,
    saveUninitialized: true
}));



//ROTAS
var desordemRouter = require("./desordem.js");
var orgaoRouter = require("./orgaos.js");
var usuarioRouter = require("./usuarios.js");
var tipoRouter = require("./tipos.js");
var denunciaRouter = require("./denuncias.js");
var gestorRouter = require("./gestor.js");
var areaRouter = require("./areas.js");

//Rota inicial
router.get("/", function(req,res){
	sess = req.session;
	// Caso o usuário já esteja logado, acessar "admin"
	if(sess.email){
		res.redirect("admin");
	// Caso contrário, acessar "mapa"
	}else{
		res.redirect("mapa");
	}
});

//Tela de login
router.get("/login", function(req,res){
	sess = req.session;
	// Caso o usuário não esteja logado
	if(!sess.email){
		res.render('web/login', {failed : 0});
	}
	// Caso contrário, acessar "admin"
	else{
		res.redirect('admin');
	}

});

//Tela inicial do mapa, sem login realizado
router.get("/mapa", function(req,res){
	sess = req.session;
	
	var desordens_result;
	var polygons_result;
	
	knex.select().from("desordem").then(function(result){
		desordens_result = result;
	});
	
	knex.select('reg_regiao_alerta').from('regiao_alerta').then(function(result){
		polygons_result = result;
	})

	knex.select().from('regioes_administrativas').then(function(result){
		regioes = result;
	})

	knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_anonimato, den_iddenuncia, des_descricao, den_nivel_confiabilidade, CAST(den_datahora_ocorreu AS DATE) as data_ocorreu, CAST(den_datahora_ocorreu AS TIME) as hora_ocorreu, CAST(den_datahora_solucao AS DATE) as data_solucao, CAST(den_datahora_solucao AS TIME) as hora_solucao, usu_nome, usu_idusuario from denuncia inner join desordem on desordem.des_iddesordem = denuncia.den_iddesordem inner join usuario on usuario.usu_idusuario = denuncia.den_idusuario').then(function(result){
		sess = req.session;
		res.render('web/mapa', {pontos : result.rows, desordens : desordens_result, polygons : polygons_result, sess : sess, query : req.query, regioes : regioes});
	});
})

//Logout
router.get("/logout", function(req,res){
	req.session.destroy(function(err) {
		if(err) {
		   console.log(err);
		 } else {
		   res.redirect('/');
		 }
   })
})

//Realização de login
router.post("/login", function(req,res){
	sess = req.session;

	var senha = req.body.password;
	var email = req.body.email;
	
	console.log(email);
	senha = md5(senha);

	var name = 0;

	//Busca usuario no banco
	knex('usuario').where({
		usu_email : email,
		usu_senha : senha
	}).select().then(function(usuario){
		//Caso usuario não seja encontrado
		if(usuario.length <= 0){
			res.render("web/login", {failed : 1});
		}else if(usuario[0].usu_tipo == 3){
			res.render("web/login", {failed : 2});
		}
		//Caso usuario e senha sejam encontrados
		else{
			sess = req.session;
			sess.email = email;
			sess.login = usuario[0].usu_login;
			sess.tipo = usuario[0].usu_tipo;
			sess.usuario_id = usuario[0].usu_idusuario;
			res.redirect("admin");
		}
	});
});

//Tela de mapa pós-login
router.get("/admin", function(req,res){
	sess = req.session;
	
	if(sess.email){
		var desordens_result;
		var polygons_result;
		
		knex.select().from("desordem").then(function(result){
			desordens_result = result;
		});
		
		knex.select('reg_regiao_alerta').from('regiao_alerta').then(function(result){
			polygons_result = result;
		})

		knex.select('reg_idregiao_alerta').from('regiao_alerta').then(function(result){
			polygons_ids = result;
		})

		knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_anonimato, den_iddenuncia, des_descricao, den_nivel_confiabilidade, CAST(den_datahora_ocorreu AS DATE) as data_ocorreu, CAST(den_datahora_ocorreu AS TIME) as hora_ocorreu, CAST(den_datahora_solucao AS DATE) as data_solucao, CAST(den_datahora_solucao AS TIME) as hora_solucao, usu_nome, usu_idusuario from denuncia inner join desordem on desordem.des_iddesordem = denuncia.den_iddesordem inner join usuario on usuario.usu_idusuario = denuncia.den_idusuario').then(function(result){
			sess = req.session;
			res.render('web/admin', {pontos : result.rows, desordens : desordens_result, polygons : polygons_result, polygons_ids : polygons_ids, sess : sess, query : req.query});
		});
	}else{
		res.redirect("/");
	}


});

router.use(denunciaRouter);
router.use(orgaoRouter);	
router.use(desordemRouter);
router.use(usuarioRouter);
router.use(tipoRouter);
router.use(gestorRouter);
router.use(areaRouter);

module.exports = router;