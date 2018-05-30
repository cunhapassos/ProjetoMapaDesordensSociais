INSERT INTO public.TIPO_USUARIO (TUS_NOME, TUS_DESCRICAO)
VALUES ('Gestor', 'Visualizador dos dados principais das denuncias');

INSERT INTO public.USUARIO (USU_LOGIN, USU_SENHA, USU_NASCIMENTO, USU_CPF, USU_NOME, 
	USU_EMAIL, USU_CONFIABILIDADE, USU_TIPO, USU_TELEFONE, USU_DATA_CADASTRO)
VALUES ('gestorsoares', 'abcd1234', '1970-01-03', '99999999997', 'Gestor Soares', 'gessoares@gmail.com',
	3, currval('public.TIPO_USUARIO_TUS_IDTIPO_sequence'), '99999997', '2018-05-14');

INSERT INTO public.TIPO_USUARIO (TUS_NOME, TUS_DESCRICAO) 
VALUES ('Cidadao', 'Usuario comum do aplicativo, sem maiores autorizacoes e visualizacoes');

INSERT INTO public.USUARIO (USU_LOGIN, USU_SENHA, USU_NASCIMENTO, USU_CPF, USU_NOME,
	USU_EMAIL, USU_CONFIABILIDADE, USU_TIPO, USU_TELEFONE, USU_DATA_CADASTRO)
VALUES ('cidadaosantos', 'abcd1234', '1970-01-04', '99999999996', 'Cidadao Santos', 'cidsantos@gmail.com', 3, 
	currval('public.TIPO_USUARIO_TUS_IDTIPO_sequence'), '99999996', '2018-05-14'),
	('cidadaosouza', 'abcd1234', '1970-01-01', '99999999999', 'Cidadao de Souza', 'cidsouza@gmail.com', 3, 
	currval('public.TIPO_USUARIO_TUS_IDTIPO_sequence'), '99999999', '2018-05-14');

INSERT INTO public.TIPO_DESORDEM (TDE_NOME, TDE_DESCRICAO)
VALUES ('Desordens Fisicas','Desordens de ordem fisica');

INSERT INTO public.ORG_ORGAO (ORG_NOME, ORG_DESCRICAO)
VALUES ('Novacap', 'Companhia Urbanizadora da Nova Capital');

INSERT INTO DESORDEM (DES_DESCRICAO, ORG_IDORGAO, DES_TIPO)
VALUES ('Predio, casa, ou galpão abandonado', 
	currval('public.ORG_ORGAO_ORG_IDORGAO_sequence'),
	currval('public.TIPO_DESORDEM_TDE_IDTIPO_DESORDEM_sequence') 
	);

INSERT INTO DENUNCIA(
            DEN_IDDESORDEM, DEN_IDUSUARIO, DEN_DATAHORA_REGISTRO, 
            DEN_DATAHORA_OCORREU, DEN_DATAHORA_SOLUCAO, DEN_STATUS, 
            DEN_NIVEL_CONFIABILIDADE, DEN_LOCAL_DESORDEM, DEN_DESCRICAO, DEN_ANONIMATO 
            )
    VALUES (currval('public.DESORDEM_DES_IDDESORDEM_sequence'),currval('public.USUARIO_USU_IDUSUARIO_sequence'), '2018-05-21 04:05:06', 
            '2018-05-21 02:05:06', '2018-05-22 06:05:06', 'Solucionado', 
            3, ST_Point(-15.762044, -47.881059), 'Galpão abandonado perto do bloco A', 0);

            
INSERT INTO public.TIPO_USUARIO (TUS_NOME, TUS_DESCRICAO)
VALUES ('Tecnico', 'Administrador do orgao publico, com autorizacoes maiores que um usuario comum');

INSERT INTO public.USUARIO (USU_LOGIN, USU_SENHA, USU_NASCIMENTO, USU_CPF, USU_NOME,
	USU_EMAIL, USU_CONFIABILIDADE, USU_TIPO, USU_TELEFONE, USU_DATA_CADASTRO)
VALUES ('tecnicosantana', 'abcd1234', '1970-01-05', '99999999995', 'Tecnico Santana', 
	'tecsantana@gmail.com', 3, currval('Public.TIPO_USUARIO_TUS_IDTIPO_sequence'), '99999995', '2018-05-14'),
	('tecnicosilva', 'abcd1234', '1970-01-02', '99999999998', 'Tecnico da Silva', 
	'tecsilva@gmail.com', 3, currval('public.TIPO_USUARIO_TUS_IDTIPO_sequence'), '99999998', '2018-05-14');

INSERT INTO CONFIRMACAO(
            CON_IDDENUNCIA, CON_COMENTARIO, CON_CONFIRMACAO, 
            CON_DATA_CONFIRMACAO, USU_IDUSUARIO)
    VALUES (currval('public.DENUNCIA_DEN_IDDENUNCIA_sequence'), 'Ta certo', 1, 
            '2018-05-21 04:05:07', currval('public.USUARIO_USU_IDUSUARIO_sequence'));

INSERT INTO TIPO_DESORDEM (TDE_NOME, TDE_DESCRICAO)
VALUES ('Desordens Publicas', 'Desordens de ordem publica');

INSERT INTO ORG_ORGAO (ORG_NOME, ORG_DESCRICAO)
VALUES ('DETRAN','Departamento de Transito');

INSERT INTO DESORDEM (DES_DESCRICAO, ORG_IDORGAO, DES_TIPO)
VALUES ('Poste de Luz desativado / falha de funcionamento da iluminação ou luminárias sujas (qualidade ruim da iluminação do poste; poste sem sistema de iluminação; lâmpada queimada/luminárias sujas ou com vidro escuro',
	currval('public.ORG_ORGAO_ORG_IDORGAO_sequence'),
	currval('public.TIPO_DESORDEM_TDE_IDTIPO_DESORDEM_sequence'));

INSERT INTO TIPO_DESORDEM (TDE_NOME, TDE_DESCRICAO)
VALUES ('Desordens Sociais', 'Desordens de ordem social');

INSERT INTO ORG_ORGAO (ORG_NOME, ORG_DESCRICAO)
VALUES ('SLU', 'Servico de Limpeza Urbana'),
	('CEB', 'Companhia Elétrica de Brasília'),
	('AGEFIS', 'Agencia de Fiscalizacao do Distrito Federal');

INSERT INTO DESORDEM (DES_DESCRICAO, ORG_IDORGAO, DES_TIPO)
VALUES ('Vendedores ambulantes/camelôs na rua', 
	currval('public.ORG_ORGAO_ORG_IDORGAO_sequence'),
	currval('public.TIPO_DESORDEM_TDE_IDTIPO_DESORDEM_sequence'));
            
