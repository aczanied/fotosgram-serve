import Server from './classes/server'
import userRoute from './routes/usuarios.routes';
import postRoute from "./routes/post.routes"
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { request } from 'express';

const SERVER = new Server();
// Body Parser

SERVER.app.use(bodyParser.urlencoded({extended: true }));
SERVER.app.use(bodyParser.json());

// File Upload
SERVER.app.use(fileUpload());

// Rutas de la Apps
SERVER.app.use('/user', userRoute);
SERVER.app.use('/post', postRoute);

// Levantar MongoDB
var connect = 'mongodb+srv://db_admin:jeHvY3NTV5WxJ8Vq@cluster0.suvhk.mongodb.net/fotosgram?retryWrites=true&w=majority';
var localConnect = 'mongodb://localhost:27017/fotosgram';
mongoose.connect(connect, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (error ) => {
    if (error) {
        throw error;
    }
    console.log('MongoDB Preparado!');
});
// Levantar Express
SERVER.start(() => {
    console.log('Servidor corriendo en puerto ' + SERVER.port)
})