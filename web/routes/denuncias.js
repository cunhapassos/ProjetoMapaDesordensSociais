var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/denuncias/:id/show", function(req, res){
    sess = req.session;

    knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_iddenuncia, den_iddesordem, den_idusuario,den_datahora_registro, den_datahora_ocorreu, den_datahora_solucao, den_status, den_nivel_confiabilidade, den_descricao, den_anonimato, usu_nome, des_descricao from denuncia inner join usuario on usu_idusuario = den_idusuario inner join desordem on des_iddesordem = den_iddesordem where den_iddenuncia = ' + req.params.id).then(function(result){

        registro = formatDate(result.rows[0].den_datahora_registro);
        ocorreu = formatDate(result.rows[0].den_datahora_ocorreu);
        solucao = formatDate(result.rows[0].den_datahora_solucao);
        
        res.render("denuncia/show", {denuncia : result.rows[0], registro : registro, ocorreu : ocorreu, solucao : solucao});
    
    });
    
})

router.get("/denuncias", function(req, res){
    sess = req.session;

    if(sess.email){
        knex.select().from("denuncia").then(function(result){
            knex.select().from("tipo_desordem").then(function(tipos){
                knex.select().from("desordem").then(function(desordens){
                    // console.log("Desordens " + desordens[2].des_iddesordem);
                    res.render("denuncia/index", {denuncias : result, filtro : req.query, tipos : tipos, desordens : desordens});            
                })
            })
        })
    }else{
        res.redirect("login");
    }
})

router.post("/denuncias", function(req, res){
    sess =req.session;

    datahoraregistro = new Date();

    var dataocorreu = req.body.dataocorreu;
    dataocorreu = dataocorreu.replace(/\//g, "-");

    datahoraocorreu = dataocorreu + " " + req.body.horaocorreu;
   
    //var datasolucao = req.body.datasolucao;
    //datasolucao = datasolucao.replace(/\//g, "-");

    //datahorasolucao = datasolucao + " " + req.body.horasolucao;

    var desordem = req.body.desordem;
    desordem = parseInt(desordem);
	var status = "Pendente";
	var confiabilidade = 1;
	var descricao = req.body.descricao;
    var anonimato = req.body.anonimato;
    
    console.log("LATITUDE E LONGITUDE   " + req.body.latitude + " " + req.body.longitude);

    knex('denuncia').insert({
        den_iddesordem : desordem,
        den_idusuario : sess.usuario_id,
        den_datahora_registro : datahoraregistro,
        den_datahora_ocorreu : datahoraocorreu,
        den_status : status,
        den_nivel_confiabilidade : confiabilidade,
        den_local_desordem : "POINT(" + req.body.latitude + " " + req.body.longitude +")",
        den_descricao : descricao,
        den_anonimato : anonimato
	}).then(function(){
		res.redirect("../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("admin");
    });
    
})

function formatDate(date){

    hora = date.getHours();
    minutos = date.getMinutes();
    segundos = date.getSeconds();

    if(hora <= 9){
        hora = "0" + hora;
    }

    if(minutos <= 9){
        minutos = "0" + minutos;
    }

    if(segundos <= 9){
        segundos = "0" + segundos;
    }

    horario = hora + ":" + minutos + ":" + segundos;

    date = date.toLocaleDateString();
			
	ano = date.substr(0, 4);
	mes = date.substr(5,1);
    dia = date.substr(7,2);
    
    if(dia <= 9){
        dia = "0" + dia;
    }
    
    if(date.substr(6,1) != '-'){
        mes = date.substr(5,2);
        dia = date.substr(8,2);
    }
	
	if (mes <= 9){
		mes = "0" + mes;
    }

	date = (dia + "/" + mes + "/" + ano);


    if(horario != "00:00:00"){
        date = date + ", Hora: " + horario;
    }

	return date;
}

module.exports = router;