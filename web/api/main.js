var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/api/", function(req,res){
	sess = req.session;
	
	if(sess.email){
		redirect("admin");
	}
	else{
		// res.render('login', {failed : 0});
	}
	
});


router.get("/api/admin", function(req,res){
	sess = req.session;
	
	var desordens_result;
	var polygons_result;
	
	knex.select().from("desordem").then(function(result){
		desordens_result = result;
	});
	
	knex.select('reg_regiao_alerta').from('regiao_alerta').then(function(result){
		polygons_result = result;
	})


	if (sess.email) {
		
		knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_iddenuncia from denuncia').then(function(result){
			sess = req.session;
			res.json({pontos : result.rows, desordens : desordens_result, polygons : polygons_result, sess : sess, query : req.query});
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

module.exports = router;