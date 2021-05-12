"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
var mongoose_1 = require("mongoose");
var bcrypt_1 = __importDefault(require("bcrypt"));
var usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'Usuario es Requerido']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Correo es Requerido']
    },
    clave: {
        type: String,
        required: [true, 'Contraseña es Requerida']
    }
});
usuarioSchema.method('verificarClave', function (password) {
    if (password === void 0) { password = ''; }
    if (bcrypt_1.default.compareSync(password, this.clave)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('usuario', usuarioSchema);
