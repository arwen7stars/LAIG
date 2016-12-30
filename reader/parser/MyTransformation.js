function MyTransformation(type, info) {

    this.type = type;

    this.info = info; 

}

MyNode.prototype.getType = function(){
    return this.type;
}

MyNode.prototype.getInfo = function(){
    return this.info;
}