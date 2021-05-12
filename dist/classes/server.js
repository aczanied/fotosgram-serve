"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var name = /** @class */ (function () {
    function name() {
        this.port = 3200;
        this.app = express_1.default();
    }
    // Metodo de Inicializacion
    name.prototype.start = function (callback) {
        this.app.listen(this.port, callback());
    };
    return name;
}());
exports.default = name;
