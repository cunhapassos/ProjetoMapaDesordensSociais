var express = require('express');
var router = express.Router();


//ROTAS api
var ApidesordemRouter = require("./desordem.js");
var ApiorgaoRouter = require("./orgaos.js");
var ApiusuarioRouter = require("./usuarios.js");
var ApitipoRouter = require("./tipos.js");
var ApidenunciaRouter = require("./denuncias.js");
var ApigestorRouter = require("./gestor.js");

router.use(ApidenunciaRouter);
router.use(ApiorgaoRouter);	
router.use(ApidesordemRouter);
router.use(ApiusuarioRouter);
router.use(ApitipoRouter);
router.use(ApigestorRouter);

module.exports = router;