function MyLinearAnimation(id, span, type, controlPoints) {

    this.id=id;

    this.controlPoints = controlPoints; //[[xa,ya,xa],[xb,yb,zb]]
    this.span = span;

    this.startTime = 0;
    this.endTime = 0;
    this.controlTimes = []; //tempo decorrido a cada control point

    //intervalo entre controlPoints = span / num pontos (segundos)
    this.interval = this.span / (this.controlPoints.length-1); 

    for(var i = 0; i < this.controlPoints.length; i++){
        this.controlTimes[i] = i * this.interval;
    }
    this.controlTimes.push(this.span);

    this.lastAnimatedIndex = 0; //ultimo instante animado

    this.matrix = mat4.create();

}

MyLinearAnimation.prototype.getID = function(){
    return this.id;
}

MyLinearAnimation.prototype.getVecControl = function(){
    return this.controlPoints;
}

MyLinearAnimation.prototype.getMatrix= function(){
    return this.matrix;
}

MyLinearAnimation.prototype.update = function(currTime){

    if(this.startTime == 0){
        this.startTime = currTime;
        this.endTime = this.startTime + (this.span * 1000); // converter span em msec
    }

    if(currTime > this.endTime){ //animacao acabou
        return;
    }
    else{

        var tAnimation =  (currTime - this.startTime) / 1000; //instante onde esta a animacao (segundos)
        var nextControlpointI; // indice do seguinte ponto de controlo a ser desenhado
        var prevControlpointI; // indice do anterior ponto de controlo a ser desenhado

        //encontrar os controlpoints entre os quais estamos
        for(var i = 0; i < this.controlTimes.length; i++){ 

            if(tAnimation < this.controlTimes[i]){ 
                nextControlpointI = i;
                prevControlpointI = i -1;
                break;
            }
        }

       //deslocamentos em x, y, z 
        var dx = this.controlPoints[nextControlpointI][0] - this.controlPoints[prevControlpointI][0]; //dx = proximoX - antigoX
        var dy = this.controlPoints[nextControlpointI][1] - this.controlPoints[prevControlpointI][1];
        var dz = this.controlPoints[nextControlpointI][2] - this.controlPoints[prevControlpointI][2];


        //tempo decorrido desde o ultimo checkpoint
        var timeSinceLastControlpoint = tAnimation - this.controlTimes[prevControlpointI]; 

        //percentagem do intervalo onde se encontra o instante atual
        var travelPercentage = timeSinceLastControlpoint / this.interval; 
        var newX = this.controlPoints[prevControlpointI][0] + dx * travelPercentage;
        var newY = this.controlPoints[prevControlpointI][1] + dy * travelPercentage;
        var newZ = this.controlPoints[prevControlpointI][2] + dz * travelPercentage;
       
        console.log("tempo de animacao = " + tAnimation + " percentagem = " + travelPercentage);

        //translacao
        var newTranslation = mat4.create();

        mat4.translate(newTranslation, newTranslation, [newX, newY, newZ]);

        this.matrix = newTranslation;


    }
}