function MyCircularAnimation(id, span, type, center, radius, startang, rotang) {

    this.id=id;

    this.span = span; //segundos
    this.center = center;
    this.radius = radius;
    this.startang = (startang * Math.PI * 2)/360; //rads
    this.rotang = (rotang * Math.PI * 2)/360; //rads
//    this.rotang =- this.startang; //rads
    this.angleTime = []; // em cada indice esta o angulo acomulado ate o segundo do indice


    this.startTime = 0;
    this.endTime = 0;
    //this.controlTimes = []; //angulo de rotacao a cada segundo

    //rads a cada segundo 
    this.anglePerSecond = this.rotang / this.span; 

    for(var i = 0; i < this.span; i++){
        this.angleTime.push(this.anglePerSecond * i);
  console.log("angletime i" + this.angleTime[i]);

    }
    this.angleTime.push(this.span);

    this.lastAnimatedSecond = 0; //ultimo segundo animado

    this.matrix = mat4.create();

}

MyCircularAnimation.prototype.getID = function(){
    return this.id;
};

MyCircularAnimation.prototype.getMatrix = function(){
    return this.matrix;
};

MyCircularAnimation.prototype.update = function(currTime){

    if(this.startTime == 0){
        this.startTime = currTime;
        this.endTime = this.startTime + (this.span * 1000); // converter span em msec
    }

    if(currTime > this.endTime){ //animacao acabou

        if(this.finalPositionDrawn == true){
            return;
        } else { //desenhar a posicao final para o caso de currtime passar endtime antes que seja desenhada
               
            //translacao - (posicao inicial e depois raio)
            var newMatrix = mat4.create();

            mat4.translate(newMatrix, newMatrix, [-this.center[0], -this.center[1], -this.center[2]]);
            mat4.translate(newMatrix, newMatrix, [this.radius, 0, 0]);

            //rotacao

    /* O ANG INICIAL E EM RELACAO A XX? SE SIM DECOMENTAR ISTO
    mat4.rotateX(newMatrix, newMatrix, this.startang);
    */
            mat4.rotateY(newMatrix, newMatrix, this.rotang);

             //translacao + (raio e depois posicao inicial)
            mat4.translate(newMatrix, newMatrix, [-this.radius, 0, 0]);
            mat4.translate(newMatrix, newMatrix, [this.center[0], this.center[1], this.center[2]]);

            this.matrix = newMatrix;

            this.finalPositionDrawn = true;
        }
    }


    else{
console.log("---------- ELSE");
        var tAnimation =  (currTime - this.startTime) / 1000; //instante onde esta a animacao (segundos)
        var nextSecond; // seguinte segundo a ser desenhado
        var prevSecond; // anterior segundo a ser desenhado

        //encontrar os segundos entre os quais estamos
        for(var i = 0; i < this.span + 1; i++){
console.log("tanimicao " + tAnimation + " i " + i);
            if(tAnimation < i){ 
                nextSecond = i;
                prevSecond = i - 1;
                break;
            }
        }
    
console.log("----- NEXT " + prevSecond);
     /*  //deslocamentos em x, y, z 
        var dx = this.controlPoints[nextControlpointI][0] - this.controlPoints[prevControlpointI][0]; //dx = proximoX - antigoX
        var dy = this.controlPoints[nextControlpointI][1] - this.controlPoints[prevControlpointI][1];
        var dz = this.controlPoints[nextControlpointI][2] - this.controlPoints[prevControlpointI][2];
*/

        //tempo decorrido desde o ultimo segundo animado
        var timeSinceLastSecond = tAnimation - prevSecond; // tempo onde vai a ani - ultimo segundo certo completo

        //percentagem do intervalo onde se encontra o instante atual
        var travelPercentage = timeSinceLastSecond; // porque e sempre a percetagem num segundo
        var newAngle = this.angleTime[prevSecond] + travelPercentage * this.anglePerSecond;

  console.log("newAngle " + newAngle + " this.angleTime[prevSecond] " + this.angleTime[prevSecond] + " travelPercentage " + travelPercentage);
       
        console.log("tempo de animacao = " + tAnimation + " percentagem = " + travelPercentage);

        //translacao - 
        var newMatrix = mat4.create();

        mat4.translate(newMatrix, newMatrix, [-this.center[0], -this.center[1], -this.center[2]]);
 //ESTOU A FAZER O RAIO EM X MAS NAO SEI SE E EM Z
        mat4.translate(newMatrix, newMatrix, [this.radius, 0, 0]);

        //rotacao

/* O ANG INICIAL E EM RELACAO A XX? SE SIM DECOMENTAR ISTO
mat4.rotateX(newMatrix, newMatrix, this.startang);
*/
        mat4.rotateY(newMatrix, newMatrix, newAngle);

         //translacao + 
         mat4.translate(newMatrix, newMatrix, [-this.radius, 0, 0]);
        mat4.translate(newMatrix, newMatrix, [this.center[0], this.center[1], this.center[2]]);
        
        this.matrix = newMatrix;



    }
};