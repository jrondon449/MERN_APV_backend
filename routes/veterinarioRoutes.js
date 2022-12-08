import express from 'express'

import {    perfil, 
            registrar, 
            confirmar, 
            autenticar, 
            olvidePassword,
            comprobarToken,
            nuevoPassword,
            updatePerfil,
            updatePassword  
        } 
            
from '../controllers/veterinarioController.js';

import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();
// área pública
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


// área privada
router.get('/perfil', checkAuth, perfil)
router.put('/perfil/:id', checkAuth, updatePerfil)
router.put('/actualizar-password', checkAuth, updatePassword)


export default router;


