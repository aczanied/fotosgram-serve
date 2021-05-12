"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_model_1 = require("../models/usuario.model");
var bcrypt_1 = __importDefault(require("bcrypt"));
var token_1 = __importDefault(require("../classes/token"));
var auth_middle_1 = require("../middlewares/auth.middle");
var userRoute = express_1.Router();
userRoute.post('/login', function (request, response) {
    var body = request.body;
    usuario_model_1.Usuario.findOne({ email: body.email }).then(function (userDB) {
        if (!userDB) {
            response.json({
                ok: true,
                message: 'Usuario/Contraseña no es valido.'
            });
        }
        if (userDB === null || userDB === void 0 ? void 0 : userDB.verificarClave(body.password)) {
            var tokenUser = token_1.default.obtenerToken({ _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar });
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
    }).catch(function (error) {
        response.json({
            ok: false,
            message: error
        });
    });
});
userRoute.post('/update', auth_middle_1.verificarToken, function (request, response) {
    var user = {
        nombre: request.body.nombre || request.usuario.nombre,
        email: request.body.email || request.usuario.email,
        avatar: request.body.avatar || request.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(request.usuario._id, user, { new: true }, function (error, userDB) {
        if (error) {
            console.log('error ', error);
            throw error;
        }
        if (!userDB) {
            response.json({
                ok: false,
                message: 'No se encontro usuario.'
            });
        }
        var tokenUser = token_1.default.obtenerToken({ _id: userDB === null || userDB === void 0 ? void 0 : userDB._id,
            nombre: userDB === null || userDB === void 0 ? void 0 : userDB.nombre,
            email: userDB === null || userDB === void 0 ? void 0 : userDB.email,
            avatar: userDB === null || userDB === void 0 ? void 0 : userDB.avatar });
        response.json({
            ok: true,
            usuario: userDB,
            token: tokenUser
        });
    });
});
userRoute.post('/grabar', function (request, response) {
    var user = {
        nombre: request.body.nombre,
        email: request.body.email,
        clave: bcrypt_1.default.hashSync(request.body.clave, 10),
        avatar: request.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(function (userDB) {
        var tokenUser = token_1.default.obtenerToken({ _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar });
        response.json({
            ok: true,
            token: tokenUser
        });
    }).catch(function (error) {
        response.json({
            ok: false,
            message: error
        });
    });
});
userRoute.get('/', auth_middle_1.verificarToken, function (request, response) {
    var usuario = request.usuario;
    response.json({
        ok: true,
        user: usuario
    });
});
exports.default = userRoute;
