const nodemailer = require('nodemailer');

function enviar_email(email_denunciador, denuncia_registrada, status){
    nodemailer.createTestAccount((err, account) => {
                    
        let transporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: 'gessoares0@gmail.com', // generated ethereal user
                pass: 'PW8THHTs' // generated ethereal password
            }
        });

        let mailOptions = {
            from: '<gessoares0@gmail.com>', 
            to: email_denunciador, 
            subject: 'Status Denunica',  
            html: '<p>Informamos que a sua denúncia realizada com a descrição "' + denuncia_registrada[0].den_descricao + '" teve uma atualização de status. A sua denuncia agora possui o status: ' + status + '</p>'
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

module.exports = enviar_email;