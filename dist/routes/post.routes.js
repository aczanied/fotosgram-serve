"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middle_1 = require("../middlewares/auth.middle");
var post_model_1 = require("../models/post.model");
var filesystem_1 = __importDefault(require("../classes/filesystem"));
var postRoute = express_1.Router();
var fileSystem = new filesystem_1.default();
// Metodo de obtener todos los post paginados
postRoute.get('/', [auth_middle_1.verificarToken], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var pagina, skip, posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pagina = Number(request.query.pagina) || 1;
                skip = pagina - 1;
                skip = skip * 10;
                return [4 /*yield*/, post_model_1.Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('usuarios', '-clave').exec()];
            case 1:
                posts = _a.sent();
                response.json({
                    ok: true,
                    data: posts
                });
                return [2 /*return*/];
        }
    });
}); });
// Metodo de obtener todos las imagenes
postRoute.get('/imagen/:userid/:img', [auth_middle_1.verificarToken], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, img, path;
    return __generator(this, function (_a) {
        userId = request.params.userid;
        img = request.params.img;
        path = fileSystem.obtenerUrlImg(userId, img);
        response.sendFile(path);
        return [2 /*return*/];
    });
}); });
// Metodo de Grabar Post
postRoute.post('/', [auth_middle_1.verificarToken], function (request, response) {
    var body = request.body;
    body.usuario = request.usuario._id;
    var imagenes = fileSystem.asentarTemporal(request.usuario._id);
    body.imagen = imagenes;
    console.log('la imagggggen', body.imagen);
    post_model_1.Post.create(body).then(function (resultDB) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resultDB.populate('usuarios', '-clave').execPopulate()];
                case 1:
                    _a.sent();
                    response.json({
                        ok: true,
                        data: resultDB
                    });
                    return [2 /*return*/];
            }
        });
    }); }).catch(function (err) {
        response.json({
            ok: false,
            mensaje: err
        });
    });
});
// Servicio de  Carga de Archivos
postRoute.post('/upload', [auth_middle_1.verificarToken], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!request.files) {
                    return [2 /*return*/, response.status(400).json({
                            ok: false,
                            mensaje: 'No se subio ningun archivo'
                        })];
                }
                file = request.files.imagen;
                if (!file) {
                    return [2 /*return*/, response.status(400).json({
                            ok: false,
                            mensaje: 'No se encontro el campo imagen'
                        })];
                }
                if (!file.mimetype.includes('image')) {
                    return [2 /*return*/, response.status(400).json({
                            ok: false,
                            mensaje: 'El archivo cargado no es una imagen.'
                        })];
                }
                return [4 /*yield*/, fileSystem.grabarTemporal(file, request.usuario._id)];
            case 1:
                _a.sent();
                response.json({
                    ok: true,
                    file: file.mimetype
                });
                return [2 /*return*/];
        }
    });
}); });
exports.default = postRoute;
