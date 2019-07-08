var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/tipos", function(req,res){
	sess = req.session;
    var tipos;

    if(sess.email){

        knex.select().from("tipo_desordem").then(function(result){
            tipos = result;
            res.render("tipo/index", {tipos : tipos});
        })

    }else{
        res.redirect("login");
    }

});

router.get("/tipos/new", function(req,res){
    sess = req.session;
    
    if(sess.email){
        res.render("tipo/create");
    }
    else{
        res.redirect("../login");
    }
})

router.post("/tipos", function(req,res){
    sess = req.session;

    knex('tipo_desordem').insert({
		tde_nome : req.body.nome,
		tde_descricao : req.body.descricao
	}).then(function(){
		res.redirect("../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("new");
	});
})

router.post("/tipos/delete", function(req,res){
    var id_tipo = req.body.id_tipo;
    console.log("ID_TIPO  " + id_tipo);
    knex('tipo_desordem')
	.where('tde_idtipo_desordem', id_tipo)
	.del().then(function(){
		res.redirect("/tipos");
	})
})

router.get("/tipos/:id/edit", function(req,res){
	sess =req.session;

	if(sess.email){
		var id = req.params.id;
		var orgaos;

		knex('tipo_desordem').where({tde_idtipo_desordem : id}).select().then(function(found){
			res.render("tipo/update", {tipo : found[0]})
		});
	}else{
		res.redirect("../../login");
	}
	// res.render("desordem_edit");
})

router.put("/tipos/:id",function(req,res){

	knex('tipo_desordem')
	.where('tde_idtipo_desordem',req.params.id)
	.update({
	  tde_nome: req.body.nome,
	  tde_descricao: req.body.descricao
	}).then(function(){
		res.redirect("../../tipos");
	}).catch(function(error){
		console.log(error);
		res.redirect("/tipos/"+ req.params.id + "/edit");
	})
})

module.exports = router;