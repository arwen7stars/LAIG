
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.getInterface = function (interface) {
	this.interface = interface;
}

var updatePeriod = 100;

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];				
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(updatePeriod); //100 msec

	this.setPickEnabled(true);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.update = function(currTime) {

	/*if(this.graph.loadedOk){

		for(var i = 0; i < this.graph.animations_list.length; i++){

			if(this.graph.animations_list[i][1] instanceof MyLinearAnimation){
				this.graph.animations_list[i][1].update(currTime);
			}
			if(this.graph.animations_list[i][1] instanceof MyCircularAnimation){
	console.log("----------ANTES UPDATE");
				this.graph.animations_list[i][1].update(currTime);
			}

		}
	}*/
	/*if(this.su < (this.du-1.0)){
		this.su += 1.0;
	} else if((this.su == (this.du-1.0)) && (this.sv < (this.dv-1.0))){
		this.su = 0.0;
		this.sv += 1.0;
	} else if((this.su == (this.du-1.0)) && (this.sv == (this.dv-1.0))){
		this.su = 0;
		this.sv = 0;
	}

	this.chessboard.setPosition(this.su, this.sv);
	this.chessboard.updatePosition();*/
};

XMLscene.prototype.getCamFromGraph = function() {
	this.views = [];
	this.curr_cam;			// camera atual ativa
	var id;

	for(var i = 0; i < this.graph.views_list.length; i++){
		var angle = parseFloat(this.graph.views_list[i].angle);
		var near = parseFloat(this.graph.views_list[i].near);
		var far = parseFloat(this.graph.views_list[i].far);

		var fromX = parseFloat(this.graph.views_list[i].from_x);
		var fromY = parseFloat(this.graph.views_list[i].from_y);
		var fromZ = parseFloat(this.graph.views_list[i].from_z);

		var toX = parseFloat(this.graph.views_list[i].to_x);
		var toY = parseFloat(this.graph.views_list[i].to_y);
		var toZ = parseFloat(this.graph.views_list[i].to_z);

		var cam = new CGFcamera(angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
		this.views.push(cam);

		if(this.graph.views_list[i].id == this.graph.default_view){
			id = i;
		}
	}

	 if(id == -1){ //se nao houver prespetiva com esse nome
  		id = 0;
 		}

	this.camera = this.views[id];
	this.curr_cam = i;
	this.interface.setActiveCamera(this.camera);

};


XMLscene.prototype.getLightsFromGraph = function () {

	for(var i = 0; i < this.graph.lights_list.length; i++){
		var light_id = this.graph.lights_list[i].id;
		var enabled = this.graph.lights_list[i].enabled;

		if(enabled){
			eval("this."+light_id+"=true");
		} else{
			eval("this."+light_id+"=false");
		}

		var ambient_r = this.graph.lights_list[i].ambient_r;
		var ambient_g = this.graph.lights_list[i].ambient_g;
		var ambient_b = this.graph.lights_list[i].ambient_b;
		var ambient_a = this.graph.lights_list[i].ambient_a;
		this.lights[i].setAmbient(ambient_r, ambient_g, ambient_b, ambient_a);

		var diffuse_r = this.graph.lights_list[i].diffuse_r;
		var diffuse_g = this.graph.lights_list[i].diffuse_g;
		var diffuse_b = this.graph.lights_list[i].diffuse_b;
		var diffuse_a = this.graph.lights_list[i].diffuse_a;
		this.lights[i].setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);

		var specular_r = this.graph.lights_list[i].specular_r;
		var specular_g = this.graph.lights_list[i].specular_g;
		var specular_b = this.graph.lights_list[i].specular_b;
		var specular_a = this.graph.lights_list[i].specular_a;
		this.lights[i].setSpecular(specular_r, specular_g, specular_b, specular_a);

		var location_x = this.graph.lights_list[i].location_x;
		var location_y = this.graph.lights_list[i].location_y;
		var location_z = this.graph.lights_list[i].location_z;
		
		var omni = this.graph.lights_list[i].omni;

		if(omni){
			var location_w = this.graph.lights_list[i].location_w;
			this.lights[i].setPosition(location_x, location_y, location_z, location_w);

			this.interface.addOmniLight(light_id);
		} else{
			this.lights[i].setPosition(location_x, location_y, location_z, 1.0);

			this.lights[i].setSpotCutOff(this.graph.lights_list[i].angle);
			this.lights[i].setSpotExponent(this.graph.lights_list[i].exponent);

			var target_x = this.graph.lights_list[i].target_x;
			var target_y = this.graph.lights_list[i].target_y;
			var target_z = this.graph.lights_list[i].target_z;

			this.lights[i].setSpotDirection(target_x - location_x, target_y - location_y,
			target_z - location_z);

			this.interface.addSpotLight(light_id);
		}
	}

};


XMLscene.prototype.changeCamera = function() {
	this.curr_cam = (this.curr_cam + 1) % this.views.length;
	this.camera = this.views[this.curr_cam];
	this.interface.setActiveCamera(this.camera);
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
    this.getCamFromGraph();
    this.enableTextures(true);
    this.getTexturesAppearance();
    this.getMaterialsAppearance();
    this.getLightsFromGraph();
};

XMLscene.prototype.display = function () {
	this.logPicking();
	this.clearPickRegistration();

	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();


	this.setDefaultAppearance();
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		for(var i = 0; i < this.graph.lights_list.length; i++){
			eval("var enabled = this."+this.graph.lights_list[i].id);

			if(enabled){
    			this.lights[i].enable();
			} else {
				this.lights[i].disable();
			}
			
			this.lights[i].setVisible(true);
			this.lights[i].update();
		}

		var rootVector = [];
		rootVector.push(this.graph.component_list[0]);

		var matIni = mat4.create();
		mat4.identity(matIni);

		var rootMaterial = this.graph.component_list[0].getMaterial();
		var rootTexture = this.graph.component_list[0].getTexture();

		

		this.displayComponents(rootVector, matIni, rootMaterial,rootTexture);
	}

}; 

XMLscene.prototype.getTexturesAppearance = function() {

	this.textures = []; // [id, CGFappearance]

	for(var i = 0; i < this.graph.textures_list.length; i++){

		var id = this.graph.textures_list[i].id;
		var file = this.graph.textures_list[i].file;
		var length_s = this.graph.textures_list[i].length_s;
		var length_t = this.graph.textures_list[i].length_t;

		var tex = new CGFtexture(this, file);
		//tex.loadTexture(file);
		//tex.setTextureWrap(length_s, length_t);


		var vecIdTex = [id, tex];
		this.textures.push(vecIdTex);
	}
};

XMLscene.prototype.getMaterialsAppearance = function (){

	this.materials = []; // [id, CGFappearance]

	for(var m = 0; m < this.graph.materials_list.length; m++){

		var matAtual = this.graph.materials_list[m];
		var appearance = new CGFappearance(this.scene);

		appearance.scene = this;
		appearance.setEmission(matAtual.emission_r,matAtual.emission_g,matAtual.emission_b,matAtual.emission_a);
		appearance.setAmbient(matAtual.ambient_r,matAtual.ambient_g,matAtual.ambient_b,matAtual.ambient_a);
		appearance.setDiffuse(matAtual.diffuse_r,matAtual.diffuse_g,matAtual.diffuse_b,matAtual.diffuse_a);
		appearance.setSpecular(matAtual.specular_r,matAtual.specular_g,matAtual.specular_b,matAtual.specular_a);
		appearance.setShininess(matAtual.shininess);

		var vecIdApp = [matAtual.id, appearance];
		this.materials.push(vecIdApp);


	}

};

XMLscene.prototype.findMaterial = function (id){

	var ret;

	for(var m = 0; m < this.materials.length; m++){

		if(id == this.materials[m][0]){ // id
			ret = this.materials[m][1]; // appearance
			break;
		}
	}

	return ret;

}

XMLscene.prototype.findTexture = function (id){

	var ret;

	for(var t = 0; t < this.textures.length; t++){

		if(id == this.textures[t][0]){ // id
			ret = this.textures[t][1]; // appearance
			break;
		}
	}

	return ret;

}


XMLscene.prototype.getChildren = function(no){

	var ret = [];
	var nChildren = no.getChildrenIDs().length;

    for(var j = 0; j < nChildren; j++){ //percorrer children ids
    
        var childID = no.getChildrenIDs()[j];

        for(var i = 0; i < this.graph.component_list.length; i++){ //percorrer componentes
        
        var comp = this.graph.component_list[i]; //child 
        var compID = comp.getID();
        if(childID == compID){ //comparar id de child ao do componente
            ret.push(comp); //array de nos child
        }

        }
    }

    return ret;
	
}

XMLscene.prototype.getPrimitives = function(no){

	var ret = [];

    for(var j = 0; j < no.getPrimitiveIDs().length; j++){ //percorrer primitive ids (aka type)
    
        var primID = no.getPrimitiveIDs()[j];

        for(var a = 0; a < this.graph.primitives_list.length; a++){ //percorrer primitivas
        
        	var primName = this.graph.primitives_list[a][0]; //no
        
        	if(primID == primName){ //comparar id de child ao da primitiva
            	ret.push(this.graph.primitives_list[a][1]); //array de primitiva (posicao 1 de primitives_list)
        	}

        }
    }

    return ret;
	
};

XMLscene.prototype.getAnimations = function(no){

	var ret = [];

    for(var j = 0; j < no.getAnimationIDs().length; j++){ //percorrer animation ids
    
        var aniID = no.getAnimationIDs()[j];

        for(var a = 0; a < this.graph.animations_list.length; a++){ //percorrer animations
        
        	var aniName = this.graph.animations_list[a][0]; //id da animation
        
        	if(aniID == aniName){ //comparar id da ani da list ao da do no
            	ret.push(this.graph.animations_list[a][1]); //array de myAnimation (posicao 1 de animations_list)
        	}

        }
    }

    return ret;
	
};

XMLscene.prototype.displayComponents = function(list, fatherMatrix, fatherMaterial, fatherTexture){ //so para componentes

	var nComp = list.length;
	var compAtual;


	for(var i = 0; i < nComp; i++){ //percorrer a lista para tratar de children e primitives
		compAtual = list[i];
		var log = list[0].getMatrix();
		var compMat = mat4.create();
		mat4.identity(compMat);
		compMat = compAtual.getMatrix();

		var thisMat = mat4.create();
		mat4.copy(thisMat, compMat);
		mat4.multiply(thisMat, fatherMatrix,thisMat);
			
		var compMaterial = compAtual.getMaterial();
		if(compMaterial == "inherit"){
			compMaterial = fatherMaterial;
		}
		var compTexture = compAtual.getTexture();
		if(compTexture == "inherit"){
			compTexture = fatherTexture;
		}

		var nPrim = compAtual.getPrimitiveIDs().length;
		if(nPrim > 0){ // mandar as primitivas para display

			var primitives = this.getPrimitives(compAtual);
			var animations = this.getAnimations(compAtual); //MyAnimation vec
			
			this.displayPrimitives(primitives,thisMat, compMaterial, compTexture, animations); //display de uma primitiva
				
		}

		var children = this.getChildren(compAtual); //mandar as children de novo para esta funcao
		if(children.length > 0){

			this.displayComponents(children, thisMat, compMaterial, compTexture);
		}

	}
};

XMLscene.prototype.displayPrimitives = function(primitives, matrix, materialID, textureID, animations){
	
	var nPrim = primitives.length;						// tamanho das primitivas do no
	var nPrimList = this.graph.primitives_list.length;	// primitivas do grafo
	
	for(var i = 0; i < nPrim; i++){
		for(var j = 0; j < nPrimList; j++){

			var primName = this.graph.primitives_list[j][1].getType();
	
			if(primName == primitives[i].getType()){ //encontrar na lista o id da primitiva referenciada para ir buscar a MyPrimitive

			//	console.log("Primitiva a desenhar: " + primID);
				var thisPrim = this.graph.primitives_list[j][1]; // posicao 1 e uma MyPrimitive

							this.pushMatrix();

								for(var a = 0; a < animations.length; a++){



			
									if(animations[a] instanceof MyLinearAnimation){										
										var matAni = mat4.create();
										matAni = animations[a].getMatrix();
										this.multMatrix(matAni);
									}

									if(animations[a] instanceof MyCircularAnimation){								
										var matAni = mat4.create();
										matAni = animations[a].getMatrix();
										this.multMatrix(matAni);
									}
								}
									
								 //aplicar matriz transformacao 						
								this.multMatrix(matrix);

								var materialApp = this.findMaterial(materialID);

								if(textureID != "none"){
									var textureApp = this.findTexture(textureID);
									materialApp.setTexture(textureApp);
								}
								
								materialApp.apply();
							

								var classeParaDisplay = thisPrim.getPrimitive();
								
								classeParaDisplay.display();
								
							
							this.popMatrix();
			}
		}
	}
};