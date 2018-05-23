var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/usuarios/new", function(req,res){
	
	sess = req.session;
	if(sess.email){
		res.render("new_usuario");
	}else{
		res.redirect("../login");
	}

});

router.post("/usuarios",function(req,res){
	
	var login = req.body.login;
	var senha = req.body.senha;
	var email = req.body.email;
	var nascimento = req.body.nascimento;
	var cpf = req.body.cpf.replace(/[^\d]+/g,''); //remove todos caracteres que nao sao digitos
	var nome = req.body.nome;
	var confia = req.body.confia;
	var tipo = req.body.tipo;
	var telefone = req.body.telefone.replace(/[^\d]+/g,''); //remove todos caracteres que nao sao digitos

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 
	var today = dd+'/'+mm+'/'+yyyy;

	knex('usuario').insert({
		usu_login : login,
		usu_senha : senha,
		usu_email : email,
		usu_nascimento : nascimento,
		usu_cpf : cpf,
		usu_nome : nome,
		usu_confiabilidade : confia,
		usu_tipo : tipo,
		usu_telefone : telefone,
		usu_data_cadastro : today
	}).then(function(){
		res.redirect("../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("new");
	});

})

router.post("/usuarios/delete", function(req,res){

	var id_usuario = req.body.id_usuario;
	
	knex('usuario')
	.where('usu_idusuario', id_usuario)
	.del().then(function(){
		res.redirect("/usuarios");
	})
})

router.get("/usuarios/:id/edit", function(req,res){
	sess =req.session;

	if(sess.email){
		var id = req.params.id;
		var usuarios;

		knex('usuario').where({usu_idusuario : id}).select().then(function(found){
			res.render("usuario_update", {usuario : found[0]})
		});
	}else{
		res.redirect("../../login");
	}
})

router.get("/usuarios/:id/show", function(req,res){
	sess =req.session;

	if(sess.email){
		var id = req.params.id;
		var usuarios;

		knex('usuario').where({usu_idusuario : id}).select().then(function(found){
			var cpf = found[0].usu_cpf;
			var telefone = found[0].usu_telefone;
			var new_cpf;
			new_cpf = cpf.substr(0, 3) + "." + cpf.substr(3,3) + "." + cpf.substr(6,3) + "-" + cpf.substr(9,2);
			telefone = "(" + telefone.substr(0,2) + ") " + telefone.substr(2,5) + "-" + telefone.substr(7,4);
			
			res.render("usuario_show", {usuario : found[0], cpf : new_cpf, telefone : telefone})
		});
	}else{
		res.redirect("../../login");
	}
})

router.get("/usuarios", function(req,res){
	sess =req.session;

	if(sess.email){

		knex.select().from("usuario").then(function(usuarios){
			res.render("usuarios", {usuarios : usuarios});
		})
	}else{
		res.redirect("../../login");
	}
})

router.put("/usuarios/:id",function(req,res){

	knex('usuario')
	.where('id_usuario',req.params.id)
	.update({
		usu_login : login,
		usu_senha : senha,
		usu_nascimento : nascimento,
		usu_cpf : cpf,
		usu_nome : nome,
		usu_confiabilidade : confia,
		usu_tipo : tipo,
		usu_telefone : telefone,
		usu_data_cadastro : dcadastro
	}).then(function(){
		res.redirect("../../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("/usuarios/"+ req.params.id + "/edit");
	})
})

module.exports = router;