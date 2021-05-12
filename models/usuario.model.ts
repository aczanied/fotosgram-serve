import { Schema, model , Document} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUsuario extends Document {
    nombre:string;
    avatar:string;
    email:string;
    clave:string;
    verificarClave(password: string): boolean;
}



const usuarioSchema = new Schema<IUsuario>({
    nombre: {
        type: String,
        required: [ true, 'Usuario es Requerido']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'Correo es Requerido'] 
    },
    clave: {
        type: String,
        required: [ true, 'Contraseña es Requerida']
    }
});

usuarioSchema.method('verificarClave', function(password: string = ''): boolean {
    if(bcrypt.compareSync(password, this.clave)){
        return true;
    }
    else {
        return false;
    }
});

export const Usuario = model<IUsuario>('usuario', usuarioSchema);
