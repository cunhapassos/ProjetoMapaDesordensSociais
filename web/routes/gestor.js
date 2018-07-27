var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

var knex = require('knex')(db);

router.get("/gestor", function(req,res){
    sess = req.session;

    if(sess.email){
        knex("denuncia").join("desordem", "denuncia.den_iddesordem",
        "=", "desordem.des_iddesordem").join("usuario", "denuncia.den_idusuario", "=", "usuario.usu_idusuario")
        .select("denuncia.*", "desordem.des_descricao", "usuario.usu_login").then(function(result){
            res.render("gestor/index", {denuncias : result});
        })
    }else{
        res.redirect("../../login");
    }
})

module.exports = router;