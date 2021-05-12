"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./classes/server"));
var usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
var post_routes_1 = __importDefault(require("./routes/post.routes"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var SERVER = new server_1.default();
// Body Parser
SERVER.app.use(body_parser_1.default.urlencoded({ extended: true }));
SERVER.app.use(body_parser_1.default.json());
// File Upload
SERVER.app.use(express_fileupload_1.default());
// Rutas de la Apps
SERVER.app.use('/user', usuarios_routes_1.default);
SERVER.app.use('/post', post_routes_1.default);
// Levantar MongoDB
var connect = 'mongodb+srv://db_admin:jeHvY3NTV5WxJ8Vq@cluster0.suvhk.mongodb.net/fotosgram?retryWrites=true&w=majority';
var localConnect = 'mongodb://localhost:27017/fotosgram';
mongoose_1.default.connect(connect, {
    useNewUrlParser: true,
    useCreateIndex: true
}, function (error) {
    if (error) {
        throw error;
    }
    console.log('MongoDB Preparado!');
});
// Levantar Express
SERVER.start(function () {
    console.log('Servidor corriendo en puerto ' + SERVER.port);
});
