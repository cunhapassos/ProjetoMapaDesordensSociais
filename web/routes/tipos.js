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



module.exports = router;