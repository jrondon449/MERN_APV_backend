import nodemailer from 'nodemailer'


const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email, nombre, token } = datos;

      // 

      const info = await transport.sendMail({
        from: "APV administrador de pacientes",
        to: email,
        subject: 'Restablece tu contraseña',
        text: 'Restablece tu contraseña',
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu contraseña.</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer contraseña</a></p>
            <p>Si no has creado esta cuenta, puedes ignorar este mensaje</p>
        `
      });

      console.log('Mensaje enviado %s', info.messageId);
}

export default emailOlvidePassword