var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/api/orgaos/new", function(req,res){
	sess = req.session;

	if(sess.email){

		res.render("orgao/create");

	}else{
		res.redirect("../login");
	}
});

router.post("/orgaos",function(req,res){
	
	var nome = req.body.nome;
	var descricao = req.body.descricao;

	knex('org_orgao').insert({
		org_nome: nome,
		org_descricao: descricao
	}).then(function(){
		res.redirect("../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("/new");
	});

})

router.post("/orgaos/delete", function(req,res){

	var id_orgao = req.body.id_orgao;
	
	knex('org_orgao')
	.where('org_idorgao', id_orgao)
	.del().then(function(){
		res.redirect("/orgaos");
	})
})

router.get("/api/orgaos/:id/edit", function(req,res){
	sess =req.session;

	if(sess.email){
		var id = req.params.id;
		var orgaos;

		knex('org_orgao').where({org_idorgao : id}).select().then(function(found){
			res.json({orgao : found[0]})
		});
	}else{
		res.redirect("../../login");
	}
	// res.render("desordem_edit");
})

router.get("/api/orgaos", function(req,res){
	sess =req.session;

	if(sess.email){

		knex.select().from("org_orgao").then(function(orgaos){
			res.json({orgaos : orgaos});
		})
	}else{
		res.redirect("../../login");
	}
})

router.get("/api/orgaos/:id/show", function(req,res){
	sess =req.session;
	var id = req.params.id;
	
	if(sess.email){

		knex('org_orgao').where({org_idorgao : id}).select().then(function(found){
			res.json({orgao : found[0]})
		});
	}else{
		res.redirect("../../login");
	}
})

router.put("/orgaos/:id",function(req,res){

	knex('org_orgao')
	.where('org_idorgao',req.params.id)
	.update({
	  org_nome: req.body.nome,
	  org_descricao: req.body.descricao
	}).then(function(){
		res.redirect("../../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("/orgaos/"+ req.params.id + "/edit");
	})
})

module.exports = router;