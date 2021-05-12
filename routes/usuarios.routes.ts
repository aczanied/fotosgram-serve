import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificarToken } from "../middlewares/auth.middle";

const userRoute = Router();

userRoute.post('/login', (request: Request, response: Response) => {

    const body = request.body;

    Usuario.findOne({email: body.email}).then( userDB => {
        if (!userDB) {
            response.json({
                ok: true,
                message: 'Usuario/Contraseña no es valido.'
            });
        }
        if (userDB?.verificarClave(body.password)) {
            const tokenUser = Token.obtenerToken({_id: userDB._id,
                                                    nombre: userDB.nombre,
                                                    email: userDB.email,
                                                    avatar: userDB.avatar})
            response.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            response.json({
                ok: true,
                message: 'Usuario/Contraseña no es valido.'
            });
        }
    }).catch( error => {
        response.json({
            ok: false,
            message: error
        });
    });
   
     
   });

   userRoute.post('/update', verificarToken, (request: any, response: Response) => {

    const user = {
        nombre: request.body.nombre || request.usuario.nombre,
        email: request.body.email || request.usuario.email,
        avatar: request.body.avatar || request.usuario.avatar
    }


    Usuario.findByIdAndUpdate(request.usuario._id, user, { new: true }, (error, userDB) => {

      

        if (error) {
            console.log('error ', error)
            throw error;
        }

        if (!userDB) {
            response.json({
                ok: false,
                message: 'No se encontro usuario.'
            });
        }

        const tokenUser = Token.obtenerToken({_id: userDB?._id,
            nombre: userDB?.nombre,
            email: userDB?.email,
            avatar: userDB?.avatar})

        response.json({
            ok: true,
            usuario: userDB,
            token: tokenUser
        });
        

    });
  
   });

userRoute.post('/grabar', (request: Request, response: Response) => {

    const user = {
        nombre: request.body.nombre,
        email: request.body.email,
        clave: bcrypt.hashSync(request.body.clave, 10),
        avatar: request.body.avatar
    }

    Usuario.create(user).then( userDB => {
        const tokenUser = Token.obtenerToken({_id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar})

        response.json({
            ok: true,
            token: tokenUser
        });
    }).catch( error => {
        response.json({
            ok: false,
            message: error
        });
    })
   
     
   });

   userRoute.get('/', verificarToken, (request: any, response: Response) => {
       const usuario = request.usuario;
       response.json({
        ok: true,
        user: usuario
    });
   });
   
export default userRoute;