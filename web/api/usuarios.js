var express = require('express');
var config = require("../config/db.js");
var router = express.Router({mergeParams : true});
db = config.database;

const fs = require('fs')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/usuario' })

var knex = require('knex')(db);
monName = new Array ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro")

router.get("/usuarios/new", function(req,res){
	
	sess = req.session;
	if(sess.email){
		knex.select().from("tipo_usuario").then(function(result){
			res.json({tipos : result});
		});

	}else{
		res.redirect("../login");
	}

});

router.get("/usuarios", function(req,res){

	var fotos;

	knex.select().from("foto_usuario").then(function(result){
		fotos = result;
		knex.select().from("usuario").then(function(usuarios){
			res.json({usuarios : usuarios, fotos : fotos});
		})
	})

})

router.post("/usuarios",function(req,res){
	console.log(req.body)
	
	var login = req.body.login;
	var senha = req.body.senha;
	var email = req.body.email;
	var nascimento = new Date(req.body.nascimento);
	var cpf = req.body.cpf.replace(/[^\d]+/g,''); //remove todos caracteres que nao sao digitos
	var nome = req.body.nome;
	var confia = req.body.confia;
	var tipo = req.body.tipo;
	var telefone = req.body.telefone.replace(/[^\d]+/g,''); //remove todos caracteres que nao sao digitos
	var idImagem = req.body.img_usuario_id;


	var today = new Date().toISOString();


	knex('usuario').insert({
		usu_login : login,
		usu_senha : senha,
		usu_email : email,
		usu_nascimento : nascimento,
		usu_cpf : cpf,
		usu_nome : nome,
		usu_confiabilidade : confia,
		usu_tipo : tipo,
		usu_telefone : telefone,
		usu_data_cadastro : today
	}).returning('usu_idusuario').then(function(val){
		if(idImagem != null && String(idImagem).length > 0) {
			knex('foto_usuario').insert({
					fot_idusuario : parseInt(val[0]),
					fot_idfoto : String(idImagem),
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
		res.send({sucesso: false});
	})

})

router.post("/usuarios/delete", function(req,res){

	var id_usuario = req.body.id_usuario;
	
	knex('usuario')
	.where('usu_idusuario', id_usuario)
	.del().then(function(){
		res.redirect("/usuarios");
	})
})

router.get("/usuarios/:id/edit", function(req,res){

	var id = req.params.id;
	var usuarios;

	knex('usuario').where({usu_idusuario : id}).select().then(function(found){
		res.json({usuario : found[0]})
	});
})

router.get("/usuarios/:id/show", function(req,res){
	var id = req.params.id;
	var usuarios;
	var fotos;

	knex('usuario').where({usu_idusuario : id}).select().then(function(found){
		var cpf = found[0].usu_cpf;
		var telefone = found[0].usu_telefone;
		var new_cpf;
		new_cpf = cpf.substr(0, 3) + "." + cpf.substr(3,3) + "." + cpf.substr(6,3) + "-" + cpf.substr(9,2);
		telefone = "(" + telefone.substr(0,2) + ") " + telefone.substr(2,5) + "-" + telefone.substr(7,4);
		nascimento = formatDate(found[0].usu_nascimento);
		cadastro = formatDate(found[0].usu_data_cadastro);

		knex.select().from('foto_usuario').then(function(resp){
			fotos = resp;
			res.json({usuario : found[0], cpf : new_cpf, telefone : telefone, fotos : fotos, nascimento : nascimento, cadastro : cadastro})
		})
		
	});

})

router.get("/usuarioComImagem/:id", function(req, res){

    knex.raw('select * '
    + 'from usuario '
	+ 'LEFT JOIN foto_usuario on fot_idusuario = usu_idusuario '
	+ 'WHERE usu_idusuario = ' + req.params.id)
    .timeout(500)
    .then(function(result) {
        res.status(200).json(result.rows)
    }).catch(function(erro) {
        console.log(erro)
    })

})


router.post('/usuario/upload/imagem', upload.single('image'), function(req, res) {
    res.json({filename: req.file.filename}).status(200)
});


router.get('/usuario/uploads/:file', function (req, res){
    file = req.params.file;
    if(file != null && String(file).length > 0) {

        var img = fs.readFileSync("uploads/usuario/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    } else {
        res.status(404)
    }

});

router.post("/usuario/consulta/:email", function(req,res){

	var email = req.params.email;
	console.log(req)
	console.log(email);


	knex('usuario').where({
		usu_email : email,
	}).select().then(function(usuario){
		if(usuario.length <= 0){
			res.send({sucesso: 'false'});
		}
		else{
			res.send({sucesso: 'true'});
		}
	});
});

router.post("/usuario/login", function(req,res){

	var senha = req.body.password;
	var email = req.body.email;
	
	console.log(email);
	console.log(senha);


	knex.raw('select * from usuario where usu_email=\''+email+'\' and usu_senha=\''+senha+'\'').timeout(2000).then(function(usuario){
		if (usuario.rows <= 0){
			res.send({sucesso: 'false'});
		}
		else{
			res.send({sucesso: 'true'});
			console.log(usuario);
		}
	});
});

router.post("/usuario/inserir",function(req,res){
            
            
            var login = req.body.login;
            var senha = req.body.senha;
            var email = req.body.email;
            var nome = req.body.nome;
            var confia = req.body.confia;
            var tipo = req.body.tipo;

            knex.raw('select * from usuario where usu_login = \''+login+'\'').timeout(1000).then(function(usuario){
                console.log(usuario)
                if (usuario.rows.length > 0){
                    console.log(usuario.length)
                    res.json({sucesso: 'false', resposta: 'O email já está cadastrado'});
                    console.log("O email já está cadastrado! Tente outro email!")
                             //console.log(res)
                }
                else{
                    knex('usuario').insert({
                        usu_login : login,
                        usu_senha : senha,
                        usu_email : email,
                        usu_nome : nome,
                        usu_confiabilidade : confia,
                        usu_tipo : tipo
                    }).then(function(){
                        res.json({sucesso: 'true', resposta: 'cadastro realizado'});
                        console.log("cadastro realizado com sucesso")
                        //console.log(res)
                    }).catch(function(error){
                        console.log(error);
                        res.json({sucesso: 'false', resposta: error});
                        console.log("Passou 3")
                        //console.log(res)
                             
                    });
                             
                }})
            });
            


router.put("/usuarios/:id",function(req,res){

	knex('usuario')
	.where('id_usuario',req.params.id)
	.update({
		usu_login : login,
		usu_senha : senha,
		usu_nascimento : nascimento,
		usu_cpf : cpf,
		usu_nome : nome,
		usu_confiabilidade : confia,
		usu_tipo : tipo,
		usu_telefone : telefone,
		usu_data_cadastro : dcadastro
	}).then(function(){
		res.redirect("../../admin");
	}).catch(function(error){
		console.log(error);
		res.redirect("/usuarios/"+ req.params.id + "/edit");
	})
})



function formatDate(date){
	date = date.toLocaleDateString();
			
	ano = date.substr(0, 4);
	mes = date.substr(5,1);
	dia = date.substr(7,1);
	
	if (mes <= 9){
		mes = "0" + mes;
	}
	if(dia <= 9){
		dia = "0" + dia;
	}

	date = (dia + "/" + mes + "/" + ano);

	return date;
}

module.exports = router;
