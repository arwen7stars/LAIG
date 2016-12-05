function MyNode(id) {

    this.id=id;

    this.children = []; //id do no
    this.primitives = []; //id da primitiva
    this.materials = []; //inicialmente pomos o do pai -- COMO?
    this.materialNow; //id
    this.texture; //o mesmo de cima
    this.animations = []; //ids das animacoes

    this.transformations = [];
    this.matrix = mat4.create();
    mat4.identity(this.matrix);

    this.desenhado = 0; //0 se nao foi desenhado, 1 no caso contrario

}

MyNode.prototype.getID = function(){
    return this.id;
}

MyNode.prototype.getTransformations = function(){
    return this.transformations;
}

MyNode.prototype.getTexture = function(){
    return this.texture;
}

MyNode.prototype.getChildrenIDs = function(){
    return this.children;
}

MyNode.prototype.getPrimitiveIDs = function(){
    return this.primitives;
}

MyNode.prototype.addChild = function(id) { 
    this.children.push(id);
}

MyNode.prototype.addPrimitive = function(id){
    this.primitives.push(id);
}

MyNode.prototype.addTransformation = function(transf){

  //  mat4.multiply(this.transformation, this.transformation, mat); //VERIFICAR ORDEM DA MUTIOPLICACAO
    this.transformations.push(transf);
}

MyNode.prototype.addMaterial = function(id){
    this.materials.push(id);
}

MyNode.prototype.setMaterial = function(id){
    this.materialNow = id;
}

MyNode.prototype.getMaterial = function(){
    return this.materialNow;
}

MyNode.prototype.setTexture = function(id){
    this.texture=id;
    console.log("Mudou textura para " + this.texture);
}

MyNode.prototype.getTexture = function(){
    return this.texture;
}

MyNode.prototype.addMatrix = function(mat){
     mat4.multiply(this.matrix, mat, this.matrix); //VERIFICAR ORDEM DA MUTIOPLICACAO
}

MyNode.prototype.getMatrix = function(){
    return this.matrix;
}

MyNode.prototype.addAnimation = function(id){
    this.animations.push(id);
}

MyNode.prototype.getAnimationIDs = function(){
    return this.animations;
}