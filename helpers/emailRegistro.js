import nodemailer from 'nodemailer'


const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

     

      const {email, nombre, token } = datos;

      // enviar email

      const info = await transport.sendMail({
        from: "APV administrador de pacientes",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tú cuenta está registrada, debes configurarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
            <p>Si no has creado esta cuenta, puedes ignorar este mensaje</p>
        `
      });

      console.log('Mensaje enviado %s', info.messageId);
}

export default emailRegistro