var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/denuncias/:id/show", function(req, res){

    knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_iddenuncia, den_iddesordem, den_idusuario,den_datahora_registro, den_datahora_ocorreu, den_datahora_solucao, den_status, den_nivel_confiabilidade, den_descricao, den_anonimato, usu_nome from denuncia inner join usuario on usu_idusuario = den_idusuario where den_iddenuncia = ' + req.params.id).then(function(result){
        console.log(result.rows[0]);
        res.render("denuncia_show", {denuncia : result.rows[0]});
    
    });
    
})

module.exports = router;