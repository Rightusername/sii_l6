const fs = require('fs');
const cfg = require('./config.json');
const exp = require('./net/exp.json');

module.exports =  class Net{

    constructor(){
        this.learningRate = 0.1;
        this.epochs = 500;
        this.error = 0.14;
        this.height = cfg.height; 
        this.width = cfg.width; // высота и ширина картинки
        this.experiments =  exp;
        this.n = this.width * this.height;
        this.m = exp.length;
        this.outputsAmount = this.n;
        this.neurons = [];
        this.inputs = [];
        this.outputs = [];
        this.w;
        this.result;    

        this.createNetwork();
    }
 

    createNetwork(){
        this.initMatrix();
    }
    
    
    initMatrix(){
        let w = [];
        for (var i = 0; i < this.n; i++) {
            w.push([]);
            for (var j = 0; j < this.n; j++) {
                w[i][j] = 0;
            }
        }
        
        //вычисление матрицы
        for (var k = 0; k < this.m; k++) {
            for (var i = 0; i < this.n; i++) {
                for (var j = 0; j < this.n; j++) {

                    if( i == j){
                        w[i][j] = 0;
                    } else {
                        w[i][j] += this.experiments[k].input[i] * this.experiments[k].input[j];
                    }
                }
            }

        }

        this.w = w;
    }


        
    mulMatrix(m, vector){
        let matrix = JSON.parse( JSON.stringify(m) );
        let result = [];
        for (var i = 0; i < matrix.length; i++) {
            let t = 0;
            for (var j = 0; j < matrix[i].length; j++) {
                t += ( matrix[i][j] *= vector[j] );
            }
            result.push(t);
        }
        return result;

    }
    
    calcOutputs(){
        let y = this.inputs;
        let y2 = [];

        let copy;
        for (var i = 0; i < this.n; i++) {
            y = this.mulMatrix(this.w, y );
            y = this.activateVector(y);

            // проверка существует ли образ в обуч. выборке
            for (var j = 0; j < this.experiments.length; j++) {
                if(this.experiments[j].input.toString() == y.toString()){
                    console.log(this.experiments[j].output);
                    this.result = y;
                    return y;
                }
            }

            if (i == 0) {
                copy = JSON.parse( JSON.stringify( y ) )
            } 

            //если результат перестал изменятся - прекратить цикл
            if(i > 0){
                if(y.toString() == copy.toString()){
                    console.log("net sovpadeniy " + i);
                    break;
                } else {
                    copy = JSON.parse( JSON.stringify( y ) );
                }
            }


        }
        return y;

        // let T = 10;
        // let y = this.inputs;
        // let y2 = [];

        // for (var t = 0; t < T; t++) {
        //     for (var j = 0; j < this.n; j++) {
        //         let d = 0;

        //         for (var i = 0; i < this.n; i++) {
        //             d += this.w[j][i] * y[i];
        //         }

        //         if(d > 0){
        //             y2[j] = 1;
        //         } else {
        //             y2[j] = -1;
        //         }
                
        //         y = JSON.parse( JSON.stringify( y2 ) );

        //         for (var i = 0; i < this.experiments.length; i++) {
        //             if(this.experiments[i].input.toString() == y.toString()){
        //                 console.log(this.experiments[i].output);
        //                 this.result = y;
        //                 return y;
        //             }
        //         }

        //     }
            

        // }

        // console.log(null);
        // return null;

    }
    
    activate(value){
        if( value > 0 ){
            return 1;
        }else if(value < 0){
            return -1;
        }else {
            return value;
        }
    }

    activateVector( vector ){
        for (var i = 0; i < vector.length; i++) {
            vector[i] = this.activate( vector[i] ); 
        }
        return vector;
    }



    
}

