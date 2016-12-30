function MyPrimitive(name, prim) {
    this.name = name; //tipo triangle
    this.prim = prim; //tipo MyTriangle
};

MyPrimitive.prototype.getType = function(){
    return this.name;
};

MyPrimitive.prototype.getPrimitive = function(){
    return this.prim;
};