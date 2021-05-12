import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificarToken } from "../middlewares/auth.middle";
import { Post } from "../models/post.model";
import { IFileUpload } from "../interfaces/todo.interface";
import FileSystem from "../classes/filesystem";

const postRoute = Router();
const fileSystem: FileSystem = new FileSystem();

// Metodo de obtener todos los post paginados
postRoute.get('/', [verificarToken ] , async (request: any, response: Response) => {

    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const posts = await Post.find().sort({_id: -1 }).skip(skip).limit(10).populate('usuarios', '-clave').exec();

    response.json({
        ok: true,
        data: posts
    });

   });

   // Metodo de obtener todos las imagenes
postRoute.get('/imagen/:userid/:img', [verificarToken ] , async (request: any, response: Response) => {

    const userId = request.params.userid;
    const img = request.params.img;

    const path = fileSystem.obtenerUrlImg(userId, img);
    
    response.sendFile(path);

   });

// Metodo de Grabar Post
postRoute.post('/', [verificarToken ] , (request: any, response: Response) => {

    const body = request.body;
    body.usuario = request.usuario._id;

    const imagenes = fileSystem.asentarTemporal(request.usuario._id);

    body.imagen = imagenes;

    console.log('la imagggggen', body.imagen);
    Post.create(body).then(async resultDB => {

       await  resultDB.populate('usuarios', '-clave').execPopulate();

        response.json({
            ok: true,
            data: resultDB
        });
    }).catch(err => {
        response.json({
            ok: false,
            mensaje: err
        }); 
    })
   });


   // Servicio de  Carga de Archivos
   postRoute.post('/upload', [verificarToken ] , async (request: any, response: Response) => {

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: IFileUpload = request.files.imagen;
    if (!file) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No se encontro el campo imagen'
        });
    }

    if (!file.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'El archivo cargado no es una imagen.'
        });
    }

    await fileSystem.grabarTemporal(file, request.usuario._id);

    response.json({
        ok: true,
        file : file.mimetype
    });

   });
export default postRoute;