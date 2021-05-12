"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var uniqid_1 = __importDefault(require("uniqid"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    ;
    FileSystem.prototype.grabarTemporal = function (file, userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = _this.crearCarpeta(userId);
            var archivo = _this.generarNombreArchivo(file.name);
            // Mover Archivo
            file.mv(path + "/" + archivo, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('');
                }
            });
        });
    };
    FileSystem.prototype.asentarTemporal = function (userId) {
        var tempPath = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        var finalPath = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        console.log('loooas pathsss', fs_1.default.existsSync(tempPath), finalPath);
        if (!fs_1.default.existsSync(tempPath)) {
            return [];
        }
        if (!fs_1.default.existsSync(finalPath)) {
            fs_1.default.mkdirSync(finalPath, { recursive: true });
        }
        var imagenesTemp = this.obtenerImgTemp(userId);
        imagenesTemp.forEach(function (imagen) {
            fs_1.default.renameSync(tempPath + "/" + imagen, finalPath + "/" + imagen);
        });
        return imagenesTemp;
    };
    FileSystem.prototype.obtenerUrlImg = function (userId, img) {
        var userPath = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        var existe = fs_1.default.existsSync(userPath);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/default.jpg');
        }
        return userPath;
    };
    FileSystem.prototype.crearCarpeta = function (userId) {
        var userPath = path_1.default.resolve(__dirname, '../uploads', userId);
        var tempUserPath = userPath + '/temp';
        var existe = fs_1.default.existsSync(userPath);
        if (!existe) {
            fs_1.default.mkdirSync(userPath, { recursive: true });
            fs_1.default.mkdirSync(tempUserPath);
        }
        ;
        return tempUserPath;
    };
    FileSystem.prototype.obtenerImgTemp = function (userId) {
        // Obtener la extension del Archivo
        var tempPath = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(tempPath) || [];
    };
    FileSystem.prototype.generarNombreArchivo = function (nombre) {
        // Obtener la extension del Archivo
        var arrayNombre = nombre.split('.');
        var extension = arrayNombre[arrayNombre.length - 1];
        var idUnico = uniqid_1.default();
        return idUnico + "." + extension;
    };
    return FileSystem;
}());
exports.default = FileSystem;
