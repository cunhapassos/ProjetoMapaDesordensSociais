var express = require('express');
var url = require('url');
var cors = require('cors');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);
router.use(cors());

router.get("/desordem/new", function(req,res){

	var orgaos_result;

	knex.select().from('org_orgao').then(function(result){
		knex.select().from('tipo_desordem').then(function(tipos){
			res.json({
				orgaos : result, 
				tipos : tipos
			})
		})
	})		
	
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
		des_descricao: descricao,
		org_idorgao: orgao
	}).then(function(){
		res.redirect("../desordens");
	}).catch(function(error){
		console.log(error);
		res.redirect("new");
	});

})

router.post("/desordem/delete", function(req,res){

	var id_desordem = req.body.id_desordem;
	
	knex('desordem')
	.where('des_iddesordem', id_desordem)
	.del().then(function(){
		res.redirect("/desordens");
	}).catch(function(err){
		res.redirect(url.format({
		pathname:"../desordens",
		query: {
			"failed": 1,
			"id_desordem" : id_desordem
			}
		}));
	})
})

router.get("/desordens/:id/edit", function(req,res){
	var id = req.params.id;
	var orgaos;

	knex.select().from('org_orgao').then(function(found){
		orgaos = found;
	})

	knex('desordem').where({des_iddesordem : id}).select().then(function(found){
		res.json({
			desordem : found[0], 
			orgaos : orgaos
		})
	});

	// res.render("desordem_edit");
})

router.get("/desordens", function(req,res){
	var tipos;
	var orgaos;
	
		
	knex.select().from("tipo_desordem").then(function(found){
		tipos = found;
		knex.select().from("desordem").orderBy("des_descricao").then(function(desordens){
				knex.select().from("org_orgao").then(function(orgaos){
					res.json({
						desordens : desordens, 
						tipos : tipos, 
						orgaos : orgaos, 
						failed : req.query.failed, 
						id_desordem : req.query.id_desordem
					})
				})
		})
	})


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

router.post("/tipodedesordem", function(req, res){


    knex.select().from("desordem").orderBy("des_descricao").then(function(tipos){
                
        res.send(tipos);            
    })

});

router.post("/inserir/tipodedesordem", function(req, res){

    var tipo = req.body.tipo;
    var orgao = req.body.orgao;
    var descricao = req.body.descricao;

    console.log(tipo);
    console.log(orgao);
    console.log(descricao);

    knex('desordem').insert({
        des_tipo: tipo,
        des_descricao: descricao,
        org_idorgao: orgao
    }).then(function(){
        res.send({sucesso: 'true'});
    }).catch(function(error){
        res.send({sucesso: 'ERRO'});
    });
});

module.exports = router;