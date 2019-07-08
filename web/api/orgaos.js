var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

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

router.get("/orgaos/:id", function(req,res){

	var id = req.params.id;
	var orgaos;

	knex('org_orgao').where({org_idorgao : id}).select().then(function(found){
		res.json({orgao : found[0]})
	});

})

router.get("/orgaos", function(req,res){

	knex.select().from("org_orgao").then(function(orgaos){
		res.json({orgaos : orgaos});
	})

})

router.get("/orgaos/:id/show", function(req,res){
	var id = req.params.id;

	knex('org_orgao').where({org_idorgao : id}).select().then(function(found){
		res.json({orgao : found[0]})
	});
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