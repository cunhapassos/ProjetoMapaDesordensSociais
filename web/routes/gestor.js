var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/gestor", function(req,res){
    sess = req.session;
    // var orgaos = getOrgaos();

    if(sess.email){
        knex("denuncia").join("desordem", "denuncia.den_iddesordem",
        "=", "desordem.des_iddesordem").join("usuario", "denuncia.den_idusuario",
        "=", "usuario.usu_idusuario")
        .select("denuncia.*", "desordem.des_descricao", "usuario.usu_login")
        .then(function(denunciaResult){

            knex("org_orgao").join("desordem", "org_orgao.org_idorgao",
            "=", "desordem.org_idorgao").leftJoin("denuncia", "denuncia.den_iddesordem", 
            "=", "desordem.des_iddesordem")
            .select("org_orgao.*")
            .select(knex.raw('COUNT(denuncia.den_iddenuncia) as count_den'))
            .groupBy('org_orgao.org_idorgao')
            .then(function(orgaoResult){
                knex("denuncia")
                .select("denuncia.den_datahora_registro")
                .orderBy("den_datahora_registro", "asc")
                .then(function(denunciasPorHoraResult){

                    knex.select().from('desordem').then(function(desordemResult){
                     
                        var desordens = getDesordens();
                        
                        res.render("gestor/index", {
                            denuncias : denunciaResult, 
                            orgaos : orgaoResult, 
                            desordens : desordemResult,
                            denunciasPorHora: denunciasPorHoraResult
                        });
                    })
                })	
            })
        })
    }else{
        res.redirect("../../login");
    }
})

function getDesordens(){
    
    knex.select().from('desordem').then(function(result){
        console.log(result);
        return result;
    })	
}

module.exports = router;