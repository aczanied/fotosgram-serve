import { IFileUpload } from "../interfaces/todo.interface";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
export default class FileSystem {
    constructor() {
        
    };

    grabarTemporal(file: IFileUpload, userId: string) {
        return new Promise((resolve, reject) => {

            const path = this.crearCarpeta(userId);
            const archivo = this.generarNombreArchivo(file.name);
    
            // Mover Archivo
            file.mv(`${path}/${archivo}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('');
                }
            });
        })
       
    }

    asentarTemporal(userId: string) {
        const tempPath = path.resolve(__dirname, '../uploads', userId, 'temp');
        const finalPath =  path.resolve(__dirname, '../uploads', userId, 'posts');

        console.log('loooas pathsss', fs.existsSync(tempPath) , finalPath);

        if (!fs.existsSync(tempPath)) {
            return [];
        }

        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });

        }

        const imagenesTemp = this.obtenerImgTemp(userId);

        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${tempPath}/${imagen}`,`${finalPath}/${imagen}` )
        });

        return imagenesTemp;

    }


    public obtenerUrlImg(userId: string, img: string) {

        const userPath = path.resolve(__dirname, '../uploads', userId, 'posts', img);

        const existe = fs.existsSync(userPath);
        if (!existe) {
            return path.resolve(__dirname, '../assets/default.jpg')
        }
        
        return userPath;

    }

    private crearCarpeta(userId: string) {
        const userPath = path.resolve(__dirname, '../uploads', userId);
        const tempUserPath = userPath+ '/temp';

        const existe = fs.existsSync(userPath);

       
        if (!existe) {
            fs.mkdirSync(userPath, { recursive: true });
            fs.mkdirSync(tempUserPath);
        };

        return tempUserPath;

    }

    private obtenerImgTemp(userId: string) {
        // Obtener la extension del Archivo
        const tempPath = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(tempPath) || [];

    }

    private generarNombreArchivo(nombre: string) {
        // Obtener la extension del Archivo
        const arrayNombre = nombre.split('.');
        const extension = arrayNombre[arrayNombre.length - 1];
        const idUnico = uniqid();

        return `${idUnico}.${extension}`;
    }
}