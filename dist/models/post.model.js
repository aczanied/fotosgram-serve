"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var mongoose_1 = require("mongoose");
var postSchema = new mongoose_1.Schema({
    created_at: {
        type: Date,
    },
    mensaje: {
        type: String,
    },
    imagen: [{
            type: String,
        }],
    coords: {
        type: String,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Referencia no establecida a Usuario']
    }
});
postSchema.pre('save', function (next) {
    this.created_at = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
