var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;
const fs = require('fs')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/denuncia' })

var knex = require('knex')(db);

router.get("/denuncias/:id/show", function(req, res){

    knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, den_iddenuncia, den_iddesordem, den_idusuario,den_datahora_registro, den_datahora_ocorreu, den_datahora_solucao, den_status, den_nivel_confiabilidade, den_descricao, den_anonimato, usu_nome, des_descricao from denuncia inner join usuario on usu_idusuario = den_idusuario inner join desordem on des_iddesordem = den_iddesordem where den_iddenuncia = ' + req.params.id).then(function(result){

        registro = formatDate(result.rows[0].den_datahora_registro);
        ocorreu = formatDate(result.rows[0].den_datahora_ocorreu);
        solucao = formatDate(result.rows[0].den_datahora_solucao);

        res.json({
            denuncia : result.rows[0], 
            registro : registro, 
            ocorreu : ocorreu, 
            solucao : solucao
        });
    
    });
    
})

router.post("/denuncia/inserir", function(req, res){
  
    var usuario = req.body.usuario;
    var status = req.body.den_status;
    var descricao = req.body.den_descricao;
    var anonimato = req.body.den_anonimato;
    var descricaoDesordem = req.body.desordem;
    var datahoraregistro = req.body.den_datahora_registro;
    var datahoraocorreu = req.body.den_datahora_ocorreu;
    var confiabilidade = req.body.den_nivel_confiabilidade;
    var idImagem = req.body.img_denuncia_id;
    console.log(req)
    knex('desordem').where({des_descricao : descricao}).select().then(function(found){
        var iddesordem = found[0].des_iddesordem;
        knex('usuario').where({usu_email : usuario}).select().then(function(usuario){
            var idusuario = usuario[0].usu_idusuario;
            knex('denuncia').insert({
                den_iddesordem : iddesordem,
                den_idusuario : idusuario,
                den_datahora_registro : datahoraregistro,
                den_datahora_ocorreu : datahoraocorreu,
                den_status : status,
                den_nivel_confiabilidade : confiabilidade,
                den_local_desordem : "POINT(" + req.body.den_local_latitude + " " + req.body.den_local_longitude +")",
                den_descricao : descricao,
                den_anonimato : anonimato
            }).returning('den_iddenuncia').then(function(val){
                if(idImagem != null && String(idImagem).length > 0) {
                    knex('imagem').insert({
                            img_iddenuncia : parseInt(val[0]),
                            img_idarquivo : String(idImagem),
                        }).then( function(img) {
                            console.log("inseriu no campo imagem", img)
                            res.json({sucesso: true, body: img});
                        }).catch(function(e) {
                            res.send({sucesso: false, body: e})
                        })
                } else {
                    res.json({sucesso: true, body: val})
                }
            }).catch(function(error){

                res.send({sucesso: false, Error: error});
            });
        }).catch(function(error){
            console.log(error)
            res.send({sucesso: false, Error: error});
        });
    }).catch(function(error){
        res.send({sucesso: false, Error: error});
    });
});

router.post("/denuncia/inserir2", function(req, res){
  console.log(req)

    var usuario = req.body.usuario;
    var status = req.body.den_status;
    var descricao = req.body.den_descricao;
    var anonimato = req.body.den_anonimato;
    var descricaoDesordem = req.body.des_descricao;
    var datahoraregistro = req.body.den_datahora_registro;
    var datahoraocorreu = req.body.den_datahora_ocorreu;
    var confiabilidade = req.body.den_nivel_confiabilidade;
    var imagem0 = req.body.img_nome_0;
    var imagem1 = req.body.img_nome_1;
    var imagem2 = req.body.img_nome_2;
    var imagem3 = req.body.img_nome_3;
        knex('desordem').where({des_descricao : descricaoDesordem}).select().then(function(found){
        var iddesordem = found[0].des_iddesordem;
        knex('usuario').where({usu_email : usuario}).select().then(function(usuario){
            var idusuario = usuario[0].usu_idusuario;
            knex('denuncia').insert({
                den_iddesordem : iddesordem,
                den_idusuario : idusuario,
                den_datahora_registro : datahoraregistro,
                den_datahora_ocorreu : datahoraocorreu,
                den_status : status,
                den_nivel_confiabilidade : confiabilidade,
                den_local_desordem : "POINT(" + req.body.den_local_latitude + " " + req.body.den_local_longitude +")",
                den_descricao : descricao,
                den_anonimato : anonimato
            }).returning('den_iddenuncia').then(function(val){
                if (imagem0 != null && String(imagem0).length > 0) {
                    knex('imagem').insert({
                            img_iddenuncia : parseInt(val[0]),
                            img_nomearquivo : String(imagem0),
                        }).then( function(img) {
                            console.log("inseriu no campo imagem0", img)
                            //res.json({sucesso: true, body: img});
                        }).catch(function(e) {
                            res.send({sucesso: false, Error: e})
                        })
                } 
                if(imagem1 != null && String(imagem1).length > 0) {
                    knex('imagem').insert({
                            img_iddenuncia : parseInt(val[0]),
                            img_nomearquivo : String(imagem1),
                        }).then( function(img) {
                            console.log("inseriu no campo imagem1", img)
                            //res.json({sucesso: true, body: img});
                        }).catch(function(e) {
                            res.send({sucesso: false, Error: e})
                        })
                } 
                if (imagem2 != null && String(imagem2).length > 0) {
                    knex('imagem').insert({
                            img_iddenuncia : parseInt(val[0]),
                            img_nomearquivo : String(imagem2),
                        }).then( function(img) {
                            console.log("inseriu no campo imagem2", img)
                            //res.json({sucesso: true, body: img});
                        }).catch(function(e) {
                            res.send({sucesso: false, Error: e})
                        })
                }
                if (imagem3 != null && String(imagem3).length > 0) {
                    knex('imagem').insert({
                            img_iddenuncia : parseInt(val[0]),
                            img_nomearquivo : String(imagem3),
                        }).then( function(img) {
                            console.log("inseriu no campo imagem3", img)
                            //res.json({sucesso: true, body: img});
                        }).catch(function(e) {
                            res.send({sucesso: false, Error: e})
                        })
                }

                res.json({sucesso: true, body: val})
                
            }).catch(function(error){
                res.send({sucesso: false, Error: error});
            });
        }).catch(function(error){
            console.log(error)
            res.send({sucesso: false, Error: error});
        });
    }).catch(function(error){
        res.send({sucesso: false, Error: error});
    });
});

router.post('/denuncia/upload/imagem', upload.single('image'), function(req, res) {
    res.json({filename: req.file.filename}).status(200)
});

router.post('/denuncia/upload/imagems', upload.array('image', 4), function(req, res) {
    //console.log(req)
    res.json({files: req.files}).status(200)
});

router.get('/denuncia/uploads/:file', function (req, res){
    file = req.params.file;
    if(file != null && String(file).length > 0) {

        var img = fs.readFileSync("uploads/denuncia/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    } else {
        res.status(404)
    }

});

router.get("/denuncias/coords", function(req, res){

    knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, '
    + 'den_iddenuncia, den_iddesordem, den_idusuario,den_datahora_registro, den_datahora_ocorreu, '
    + 'den_datahora_solucao, den_status, den_nivel_confiabilidade, den_descricao, den_anonimato, '
    + 'usu_nome, des_descricao '
    + 'from denuncia '
    + 'inner join usuario on usu_idusuario = den_idusuario '
    + 'inner join desordem on des_iddesordem = den_iddesordem')
    .timeout(2000)
    .then(function(result){

        res.json({
            denuncia : result.rows
        });
    
    });
    
})

router.get("/denuncias/coordsA", function(req, res){

    knex.raw('select ST_X(den_local_desordem),ST_Y(den_local_desordem), den_status, den_descricao, '
    + 'den_iddenuncia, den_iddesordem, den_idusuario,den_datahora_registro, den_datahora_ocorreu, '
    + 'den_datahora_solucao, den_status, den_nivel_confiabilidade, den_descricao, den_anonimato, '
    + 'usu_nome, des_descricao '
    + 'from denuncia '
    + 'inner join usuario on usu_idusuario = den_idusuario '
    + 'inner join desordem on des_iddesordem = den_iddesordem')
    .timeout(2000)
    .then(function(result){
        res.json(result.rows);   
    });
    
})

router.get("/denuncias/listadedenuncias", function(req, res){

    knex.raw('select usu_nome, den_anonimato, den_status, den_idusuario, den_iddenuncia, den_descricao, des_descricao, '
        + 'den_datahora_ocorreu, den_datahora_solucao, den_datahora_registro, '
        + 'ST_X(den_local_desordem) as latitude, '
        + 'ST_Y(den_local_desordem) as longitude, ' 
        + 'den_nivel_confiabilidade '
        + 'from denuncia '
        + 'inner join usuario on usu_idusuario = den_idusuario '
        + 'inner join desordem on des_iddesordem = den_iddesordem '
        + 'ORDER BY den_datahora_registro desc')
    .timeout(2000)
    .then(function(result){
        res.json(result.rows);   
    });
    
})

router.get("/denuncias/listadedenuncias/area/", function(req, res){
	var latA = req.query.latA
	var lonA = req.query.lonA
	var latB = req.query.latB
	var lonB = req.query.lonB
	var latC = req.query.latC
	var lonC = req.query.lonC
	var latD = req.query.latD
	var lonD = req.query.lonD
	var status = req.query.status
	var dataIni = req.query.dataIni
	var dataFim = req.query.dataFim
	var natureza = req.query.natureza
	var aux1 = ''

	var aux2 = ''
	var aux3 = ''

	console.log(req)
	console.log(status)
	if ((typeof dataIni !== 'undefined') && (typeof dataFim !== 'undefined')){
		console.log("1")
		aux1 = ' den_datahora_registro BETWEEN \''+dataIni+'\' AND \''+dataFim+'\' AND ' 
		console.log(aux1)
	}

	if ((typeof natureza !== 'undefined') && (natureza != 'Todos os tipos')){
		aux2 = ' and des_descricao =\''+natureza+'\''
		console.log("2")
		console.log(natureza)
	}
	if ((typeof status !== 'undefined') && (status != 'Todos os status')){
		aux3 = ' and den_status=\''+status+'\''
		console.log("3")
		console.log(status)
	}
/*
	knex.select('usu_nome', 'den_anonimato', 'den_status', 'den_idusuario', 'den_iddenuncia', 'den_descricao', 
		'des_descricao', 'den_datahora_ocorreu', 'den_datahora_solucao', 'den_datahora_registro', {latitude: knex.raw('ST_X(den_local_desordem)')}, 
		{longitude: knex.raw('ST_Y(den_local_desordem)')}, 'den_nivel_confiabilidade')
		.from('denuncia')
		.innerJoin('usuario', 'usu_idusuario', 'den_idusuario')
		.innerJoin('desordem', 'des_iddesordem', 'den_iddesordem')
		.where(knex.raw('ST_Contains(ST_GeomFromText(\'POLYGON(('+latA +' '+lonA+', '+latB+' '+lonB+', '+latC+' '+lonC+', '+latD+' '+lonD+', '+latA+' '+lonA+'))\'), ST_GeomFromEWKT(den_local_desordem))')) 
*/
	  knex.raw('select usu_nome, den_anonimato, den_status, den_idusuario, den_iddenuncia, den_descricao, des_descricao, '
        + 'den_datahora_ocorreu, den_datahora_solucao, den_datahora_registro, '
        + 'ST_X(den_local_desordem) as latitude, '
        + 'ST_Y(den_local_desordem) as longitude, ' 
        + 'den_nivel_confiabilidade '
        + 'from denuncia '
        + 'inner join usuario on usu_idusuario = den_idusuario '
    	+ 'inner join desordem on des_iddesordem = den_iddesordem '
        + 'WHERE '
        + aux1
        + 'ST_Contains(ST_GeomFromText(\'POLYGON(('+latA +' '+lonA+', '+latB+' '+lonB+', '+latC+' '+lonC+', '+latD+' '+lonD+', '+latA+' '+lonA+'))\'), ST_GeomFromEWKT(den_local_desordem))'
        + aux2
        + aux3
        + ' ORDER BY den_datahora_registro desc')
	  	.timeout(1000)
    	.then(function(result){ 
    		console.log(result)
    		res.json(result.rows) 
    	});

    
})


router.get("/denunciasComImagens/:latitude/:longitude", function(req, res){
    var lat = req.params.latitude
    var long = req.params.longitude

    knex.raw('select ST_X(den_local_desordem) as latitude,ST_Y(den_local_desordem) as longitude, '
    + 'den_status, den_descricao, '
    + 'den_iddenuncia, den_idusuario, '
    + 'den_nivel_confiabilidade, den_anonimato, '
    + 'usu_nome, des_descricao, img_idarquivo '
    + 'from denuncia '
    + 'inner join usuario on usu_idusuario = den_idusuario '
    + 'inner join desordem on des_iddesordem = den_iddesordem '
    + 'LEFT JOIN imagem on img_iddenuncia = den_iddenuncia '
    + 'WHERE ST_Distance_sphere( st_makepoint( ST_Y(den_local_desordem),ST_X(den_local_desordem)), st_makepoint('+ long+', '+lat+')) < 10000.0'
    + 'ORDER BY ST_Distance_sphere( st_makepoint( ST_Y(den_local_desordem),ST_X(den_local_desordem)), st_makepoint('+ long+', '+lat+')) '
    + 'LIMIT 50')
    .timeout(2000)
    .then(function(result) {
        res.status(200).json(result.rows)
    }).catch(function(erro) {
        console.log(erro)
    })
})

router.get("/denunciasComImagens", function(req, res){
    knex.raw('select ST_X(den_local_desordem) as latitude,ST_Y(den_local_desordem) as longitude, '
    + 'den_status, den_descricao, '
    + 'den_iddenuncia, den_idusuario, '
    + 'den_nivel_confiabilidade, den_anonimato, '
    + 'usu_nome, des_descricao, img_idarquivo '
    + 'from denuncia '
    + 'inner join usuario on usu_idusuario = den_idusuario '
    + 'inner join desordem on des_iddesordem = den_iddesordem '
    + 'LEFT JOIN imagem on img_iddenuncia = den_iddenuncia')
    .timeout(2000)
    .then(function(result) {
        res.status(200).json(result.rows)
    }).catch(function(erro) {
        console.log(erro)
    })

})



router.get("/denuncias", function(req, res){
        knex.select().from("denuncia").then(function(result){
            knex.select().from("tipo_desordem").then(function(tipos){
                knex.select().from("desordem").then(function(desordens){
                    // console.log("Desordens " + desordens[2].des_iddesordem);
                    
                    res.json({
                        denuncias : result, 
                        filtro : req.query, 
                        tipos : tipos, 
                        desordens : desordens
                    })
                })
            })
        })
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
    var idImagem = req.body.img_denuncia_id
    desordem = parseInt(desordem);
	var status = "Pendente";
	var confiabilidade = 1;
	var descricao = req.body.descricao;
    var anonimato = req.body.anonimato;
    //var idUsuario = sess.usuario_id;
    var idUsuario = req.body.idUsuario;
    
    console.log("LATITUDE E LONGITUDE   " + req.body.latitude + " " + req.body.longitude);

    knex('denuncia').insert({
        den_iddesordem : desordem,
        den_idusuario : idUsuario,
        den_datahora_registro : datahoraregistro,
        den_datahora_ocorreu : datahoraocorreu,
        den_status : status,
        den_nivel_confiabilidade : confiabilidade,
        den_local_desordem : "POINT(" + req.body.latitude + " " + req.body.longitude +")",
        den_descricao : descricao,
        den_anonimato : anonimato
	}).then(function(val){
        if(idImagem != null && idImagem.lengh > 0) {
            knex('imagem').insert({
                    img_iddenuncia : val.den_iddenuncia,
                    img_idarquivo : idImagem,
                }).then( function(img_val) {
                    res.json({val: val, image: img_val});
                })
        } else {
            res.json(val)
        }
	}).catch(function(error){
		console.log(error);
		res.redirect("admin");
    });
    
})

router.post("/confirmacao", function(req, res) {
    var iddenuncia = req.body.iddenuncia;
    var comentario = req.body.comentario;
    var confirmacao = req.body.confirmacao;
    var data_confirmacao = new Date().toISOString();;
    var idusuario = req.body.idusuario;

    knex('confirmacao').where({
        "confirmacao.con_iddenuncia": iddenuncia,
        "confirmacao.usu_idusuario": idusuario
    }).select('con_idconfirmacao', 'con_confirmacao')
    .then(function(row) {
        if (row[0] == null ) {
            knex('confirmacao').insert({
                con_iddenuncia : iddenuncia,
                con_comentario : comentario,
                con_confirmacao : confirmacao,
                con_data_confirmacao: data_confirmacao,
                usu_idusuario: idusuario
            }).then(function(val){
                res.status(200).json({sucesso: true, res: confirmacao})
            }).catch(function(error){
                res.status(error.status).json({sucesso: false, erro: error})
            })
        } else {
            
            if (row[0].con_confirmacao == confirmacao) {
                knex('confirmacao')
                .where({
                    con_idconfirmacao: row[0].con_idconfirmacao
                })
                .del()
                .then(function(val){
                    res.status(200).json({sucesso: true, res: -1})
                }).catch(function(error){
                    res.status(error.status).json({sucesso: false, erro: error})
                })
            } else {
                knex('confirmacao')
                .where({
                    con_idconfirmacao: row[0].con_idconfirmacao
                })
                .update({
                    con_confirmacao : confirmacao
                }).then(function(val){
                    res.status(200).json({sucesso: true, res: confirmacao})
                }).catch(function(error){
                    res.status(error.status).json({sucesso: false, erro: error})
                })
            }


            
        }
    })
    

    /*;*/
})

router.get("/confirmacao/:idUsuario/:idDenuncia", function(req, res){

    var idUsu = req.params.idUsuario
    var idDen = req.params.idDenuncia

    knex('confirmacao')
    .where("confirmacao.con_iddenuncia", idDen)
    .andWhere("confirmacao.usu_idusuario", idUsu)
    .select('con_confirmacao')
    .timeout(2000)
    .then(function(result) {
        res.status(200).json(result[0])
    }).catch(function(erro) {
        console.log(erro)
    })

})

router.get("/condel", function(req, res){

   knex('confirmacao').del().then(function(x) {
       console.log(x)
   })

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
