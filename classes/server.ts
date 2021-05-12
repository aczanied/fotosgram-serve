
import express from 'express';
export default class name {
    public app: express.Application;
    public port: number = 3200
    constructor() {
        this.app = express();
    }

    // Metodo de Inicializacion
    start( callback: Function ) {
        this.app.listen(  this.port, callback() );
    }
}