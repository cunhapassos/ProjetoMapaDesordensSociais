var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);


router.get("/desordem/new", function(req,res){
	sess = req.session;

	if(sess.email){
		var orgaos_result;

		knex.select().from('org_orgao').then(function(result){
			//orgaos_result = result;
			res.render("desordem/create", {orgaos : result });
		})		
	}else{
		res.redirect("../login");
	}
});

router.post("/desordem/create",function(req,res){
	
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

// router.get("/desordem/delete", function(req,res){
// 	sess = req.session;

// 	if (sess.email) {
// 		knex.select().from('desordem').then(function(desordens){
// 			res.render("delete_desordem", {desordens : desordens});
// 		});
// 	}
// 	else{
// 		res.redirect("../login");
// 	}
// })

router.post("/desordem/delete", function(req,res){

	var id_desordem = req.body.id_desordem;
	
	knex('desordem')
	.where('des_iddesordem', id_desordem)
	.del().then(function(){
		res.redirect("/desordens");
	})
})

router.get("/desordens/:id/edit", function(req,res){
	sess =req.session;

	if(sess.email){
		var id = req.params.id;
		var orgaos;

		knex.select().from('org_orgao').then(function(found){
			orgaos = found;
		})

		knex('desordem').where({des_iddesordem : id}).select().then(function(found){
			res.render("desordem/update", {desordem : found[0], orgaos : orgaos})
		});
	}else{
		res.redirect("../../login");
	}
	// res.render("desordem_edit");
})

router.get("/desordens", function(req,res){
	sess =req.session;
	if(sess.email){

		knex.select().from("desordem").then(function(desordens){
			res.render("desordem/index", {desordens : desordens});
		})
	}else{
		res.redirect("../../login");
	}
})

router.put("/desordens/:id",function(req,res){

	knex('desordem')
	.where('des_iddesordem',req.params.id)
	.update({
	  des_tipo: req.body.tipo,
	  des_natureza: req.body.natureza,
	  des_descricao : req.body.descricao,
	  org_idorgao : req.body.orgao 
	}).then(function(){
		res.redirect("../../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("/desordens/"+ req.params.id);
	})
})

module.exports = router;