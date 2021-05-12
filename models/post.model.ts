import { Schema , Document, model } from 'mongoose';

interface IPost extends Document {
    created_at: Date;
    mensaje: string;
    imagen: string;
    coords: string;
    usuario: string;
}

const postSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Referencia no establecida a Usuario']
    }
});

postSchema.pre<IPost>('save', function(next){
    this.created_at = new Date();
    next();
});

export const Post = model<IPost>('Post', postSchema);

