import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = 'la_wea_secreta';
    private static caducidad: string = '30d';

    constructor() {
        
    }

    // Obtener Token
    static obtenerToken( payload: any): string {
        return jwt.sign({usuario: payload}, this.seed, { expiresIn: this.caducidad});
    }

    // Comprobar Toke
    static comprobarToken(userToken: string) {

       return new Promise((resolve, reject) => {
        jwt.verify(userToken, this.seed, (err, decoded) => {
            if (err) {
                reject();
            } else {
                resolve(decoded);
            }
        })
       })
        
    }

}