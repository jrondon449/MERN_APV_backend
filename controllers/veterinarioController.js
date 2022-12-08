import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const { email, nombre } = req.body;
    
    //  prevenir usuarios duplicados

    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        // guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save()

        // enviar email

        emailRegistro({
            email, 
            nombre,
            token: veterinarioGuardado.token
        });
        res.json({msg: "Registrando usuario..."})

    } catch (error) {
        console.log(error);
    }
}

const perfil =  (req, res) =>{
    const { veterinario } = req;
    res.json(veterinario)
}

const confirmar = async (req, res) => {

    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token no válido");
        return res.status(404).json({msg: error.message});
    }


    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: "Cuenta confirmada correctamente"})
    } catch (error) {
        console.log(error);
    }
    
};

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    }

    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }
    // Revisar el password
    if( await usuario.comprobarPassword(password)){
        // autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    }else{
        const error = new Error("Password incorrecto");
        return res.status(403).json({msg: error.message});
    }
   
}

const olvidePassword = async (req, res) =>{

    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email})

    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        // enviar email con instrucciones

        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Hemos enviado un email para restablecer su contraseña"})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        res.json({msg: 'Token válido y el usuario existe'})
    }else{
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message}); 
    }
}

const nuevoPassword = async  (req, res) =>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error)
    } 
}

const updatePerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    
    const { email } = req.body
    if(veterinario.email !== req.body.email){

        const exiteEmail = await Veterinario.findOne({email})
        if(exiteEmail){
            const error = new Error("Este correo ya se encuentra en uso por otro usuario")
            return res.status(400).json({msg: error.message})
        }
    }

    
    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono 
        
        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {

        console.log(error)
    }
}

const updatePassword = async (req, res) => {
    // leer los datos

    const { id } = req.veterinario
    const { currentPwd, newPwd } = req.body

    // comprobar que el veterinario existe

    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    // comprobar su contraseña actual

    if(await veterinario.comprobarPassword(currentPwd)){
        veterinario.password = newPwd
        await veterinario.save()
        res.json({
            msg: 'Contraseña actualizada correctamente'
        })
    }else{
        const error = new Error('La cotraseña actual es incorrecta')
        return res.status(400).json({msg: error.message})
    }

    // almacenar su nueva contrase;a


}

export {
    registrar, 
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    updatePerfil,
    updatePassword
}