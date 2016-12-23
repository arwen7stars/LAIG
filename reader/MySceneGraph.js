
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
};

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseScene(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseView(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTransformation(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
console.table(this.transformation_list);

console.log("----- PRIMITIVES -----");
	error = this.parsePrimitives(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

console.log("----- ANIMATIONS -----");
	error = this.parseAnimations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

console.log("----- COMPONENTS -----");
	error = this.parseComponent(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	console.log("----- GRAPH LOADED -----");
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


MySceneGraph.prototype.parseScene = function(rootElement) {
	
	var scene_ini =  rootElement.getElementsByTagName('scene');

	if (scene_ini == null) {
		return "scene element is missing.";
	}

	if (scene_ini.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}

	var scene = scene_ini[0];
	this.root = this.reader.getString(scene, 'root', 1);				
	this.axis_length = this.reader.getFloat(scene, 'axis_length', 1);

	console.log("Scene initials read from file: {root=" + this.root + " axis_length=" + this.axis_length + "}");
};

MySceneGraph.prototype.parseView = function(rootElement) {
		
	var views_ini = rootElement.getElementsByTagName("views");

	if (views_ini == null) {
		return "views element is missing.";
	}

	this.views_list=[];

	var views = views_ini[0];
	this.default_view = this.reader.getString(views, 'default', 1);

	console.log("Views initials read from file: {default=" + this.default_view + "}");

	var nnodes=views_ini[0].children.length;

	for(var i=0; i<nnodes; i++){								
		var e = views_ini[0].children[i];

		var near=e.attributes.getNamedItem("near").value;		
		var far=e.attributes.getNamedItem("far").value;			
		var angle=e.attributes.getNamedItem("angle").value;		
		//angle = (angle * Math.PI * 2) / 360;
		var pers1 = new MyPerspective(e.id, near, far, angle);

		this.views_list[i] = pers1;

		var from_ini = views_ini[0].children[i].getElementsByTagName("from");
		var from = from_ini[0];
		var from_x = this.reader.getFloat(from, 'x', 1);
		var from_y = this.reader.getFloat(from, 'y', 1);
		var from_z = this.reader.getFloat(from, 'z', 1);

		pers1.setFromPosition(from_x, from_y, from_z);

		var to_ini = views_ini[0].children[i].getElementsByTagName("to");
		var to = to_ini[0];
		var to_x = this.reader.getFloat(to, 'x', 1);
		var to_y = this.reader.getFloat(to, 'y', 1);
		var to_z = this.reader.getFloat(to, 'z', 1);

		pers1.setToPosition(to_x, to_y, to_z);

		console.log("Perspective initials read from file: {default=" + pers1.id + ", near=" +
		pers1.near + ", far=" + pers1.far + ", angle=" + pers1.angle +
		", from initals=(" + pers1.from_x + ", " + pers1.from_y + ", " + pers1.from_z +
		"), to initials = (" + pers1.to_x + ", " + pers1.to_y + ", " + pers1.to_z + "}");
		
	}

};

MySceneGraph.prototype.parseIllumination = function(rootElement) {	
	var illumination_ini = rootElement.getElementsByTagName("illumination");

	if (illumination_ini == null) {
		return "illumination element is missing.";
	}

	var illumination = illumination_ini[0];
	this.doublesided = this.reader.getBoolean(illumination, 'doublesided', 1);
	this.local = this.reader.getBoolean(illumination, 'local', 1);
	this.ambient=[];
	this.background=[];

	var ambient_ini = rootElement.getElementsByTagName("ambient");
	var ambient = ambient_ini[0];
	this.ambient[0] = this.reader.getFloat(ambient, 'r', 1);
	this.ambient[1] = this.reader.getFloat(ambient, 'g', 1);
	this.ambient[2] = this.reader.getFloat(ambient, 'b', 1);
	this.ambient[3] = this.reader.getFloat(ambient, 'a', 1);

	var background_ini = rootElement.getElementsByTagName("background");
	var background = background_ini[0];
	this.background[0] = this.reader.getFloat(background, 'r', 1);
	this.background[1] = this.reader.getFloat(background, 'g', 1);
	this.background[2] = this.reader.getFloat(background, 'b', 1);
	this.background[3] = this.reader.getFloat(background, 'a', 1);

	console.log("Illumination initials read from file: { doublesided " + this.doublesided + 
	", local " + this.local + ", ambient initials=(" + this.ambient[0] + ", " + this.ambient[1] +
	", " + this.ambient[2] + ", " + this.ambient[3] + "), background initials=(" + 
	this.background[0] + ", " + this.background[1] + ", " + this.background[2] + 
	", " + this.background[3] + ") }");

};

MySceneGraph.prototype.parseLights = function(rootElement) {
	var lights_ini = rootElement.getElementsByTagName("lights");

	if (lights_ini == null){
		return "lights element is missing.";
	}

	this.lights_list=[];
	var nLights=lights_ini[0].children.length;

	for(var i=0;i<nLights;i++){

		var lightRef = lights_ini[0].children[i];
		var lightID = this.reader.getString(lightRef,"id",1);
		var lightEnabled = this.reader.getBoolean(lightRef,"enabled",1);

		var location_ini = lights_ini[0].children[i].getElementsByTagName("location");
		var location = location_ini[0];
		var location_x = this.reader.getFloat(location, 'x', 1);
		var location_y = this.reader.getFloat(location, 'y', 1);
		var location_z = this.reader.getFloat(location, 'z', 1);

		var ambient_ini = lights_ini[0].children[i].getElementsByTagName("ambient");
		var ambient = ambient_ini[0];
		var ambient_r = this.reader.getFloat(ambient, 'r', 1);
		var ambient_g = this.reader.getFloat(ambient, 'b', 1);
		var ambient_b = this.reader.getFloat(ambient, 'a', 1);
		var ambient_a = this.reader.getFloat(ambient, 'a', 1);

		var diffuse_ini = lights_ini[0].children[i].getElementsByTagName("diffuse");
		var diffuse = diffuse_ini[0];
		var diffuse_r = this.reader.getFloat(diffuse, 'r', 1);
		var diffuse_g = this.reader.getFloat(diffuse, 'g', 1);
		var diffuse_b = this.reader.getFloat(diffuse, 'b', 1);
		var diffuse_a = this.reader.getFloat(diffuse, 'a', 1);

		var specular_ini = lights_ini[0].children[i].getElementsByTagName("specular");
		var specular = specular_ini[0];
		var specular_r = this.reader.getFloat(specular, 'r',1);
		var specular_g = this.reader.getFloat(specular, 'g',1);
		var specular_b = this.reader.getFloat(specular, 'b',1);
		var specular_a = this.reader.getFloat(specular, 'a',1);

		var light = new MyLight(lightID, lightEnabled);
		light.setLocation(location_x,location_y,location_z);
		light.setAmbient(ambient_r, ambient_g, ambient_b, ambient_a);
		light.setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);
		light.setSpecular(specular_r, specular_g, specular_b, specular_a);

		switch(lights_ini[0].children[i].tagName){
			case 'omni':
				var location_w = this.reader.getFloat(location, 'w', 1);
				light.setOmniParam(location_w);

				this.lights_list[i] = light;

				console.log("LIGHT OMNI: id " + lightID + " enabled " + lightEnabled + " location: " + 
				location_x + " " + location_y + " " + location_z + " " + location_w +
				" ambient: " + ambient_r + " " + ambient_g + " " + ambient_b + " " + ambient_a +
				" diffuse: " + diffuse_r + " " + diffuse_g + " " + diffuse_b + " " + diffuse_a + 
				" specular: " + specular_r + " " + specular_g + " " + specular_b + " " + specular_a);
				break;
			case 'spot':
				var lightAngle = this.reader.getFloat(lightRef,'angle',1);
				var lightExponent = this.reader.getFloat(lightRef,'exponent',1);

				var target_ini = lights_ini[0].children[i].getElementsByTagName("target");
				var target = target_ini[0];

				var target_x = this.reader.getFloat(target, 'x',1);
				var target_y = this.reader.getFloat(target, 'y',1);
				var target_z = this.reader.getFloat(target, 'z',1);

				light.setSpotParam(lightAngle, lightExponent, target_x, target_y, target_z);

				this.lights_list[i] = light;

				console.log("LIGHT SPOT: id " + lightID + " enabled " + lightEnabled + " angle " +
				lightAngle + " exponent " + lightExponent + " target: " +
				target_x + " " + target_y + " " + target_z + " location: " + location_x + " " + 
				location_y + " " + location_z + " "+ location_w + " ambient: " + ambient_r + " " + 
				ambient_g + " " + ambient_b + " " + ambient_a + " diffuse: " + diffuse_r + " " + 
				diffuse_g + " " + diffuse_b + " " + diffuse_a + " specular: " + specular_r + " " + 
				specular_g + " " + specular_b + " " + specular_a);


				break;
			default:
				return "lights can only be omni or spot.";
		}


		
	}

};

MySceneGraph.prototype.parseTextures = function(rootElement) {
	var textures_ini = rootElement.getElementsByTagName("textures");

	if (textures_ini == null) {
		return "textures element is missing.";
	}

	this.textures_list = [];

	var nTexRef=textures_ini[0].children.length;

	for(var i=0;i<nTexRef; i++){
		var id = this.reader.getString(textures_ini[0].children[i],"id",1);
		var file = this.reader.getString(textures_ini[0].children[i],"file",1);
		var length_s = this.reader.getFloat(textures_ini[0].children[i],"length_s",1);
		var length_t = this.reader.getFloat(textures_ini[0].children[i],"length_t",1);

		console.log("TEXTURA " + i + ": " + id + ", " + file + ", " + length_s + ", " + length_t);

		var tex = new MyTexture(id,file,length_s, length_t);
		this.textures_list[i] = tex;
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {
    var materials_ini = rootElement.getElementsByTagName("materials");
 
    if (materials_ini == null) {
        return "materials element is missing.";
    }
 
    this.materials_list = [];
 
    var nMaterials=materials_ini[0].children.length;
 
    for(var i=0;i<nMaterials;i++){
 
        var matRef = materials_ini[0].children[i];
        var matID = this.reader.getString(matRef,"id",1);
 
        var emission_ini = materials_ini[0].children[i].getElementsByTagName("emission");
        var emission = emission_ini[0];
        var emission_r = this.reader.getFloat(emission, 'r', 1);
        var emission_g = this.reader.getFloat(emission, 'g', 1);
        var emission_b = this.reader.getFloat(emission, 'b', 1);
        var emission_a = this.reader.getFloat(emission, 'a', 1);
 
        var ambient_ini = materials_ini[0].children[i].getElementsByTagName("ambient");
        var ambient = ambient_ini[0];
        var ambient_r = this.reader.getFloat(ambient, 'r', 1);
        var ambient_g = this.reader.getFloat(ambient, 'g', 1);
        var ambient_b = this.reader.getFloat(ambient, 'b', 1);
        var ambient_a = this.reader.getFloat(ambient, 'a', 1);
 
        var diffuse_ini = materials_ini[0].children[i].getElementsByTagName("diffuse");
        var diffuse = diffuse_ini[0];
        var diffuse_r = this.reader.getFloat(diffuse, 'r', 1);
        var diffuse_g = this.reader.getFloat(diffuse, 'g', 1);
        var diffuse_b = this.reader.getFloat(diffuse, 'b', 1);
        var diffuse_a = this.reader.getFloat(diffuse, 'a', 1);
 
        var specular_ini = materials_ini[0].children[i].getElementsByTagName("specular");
        var specular = diffuse_ini[0];
        var specular_r = this.reader.getFloat(diffuse, 'r', 1);
        var specular_g = this.reader.getFloat(diffuse, 'g', 1);
        var specular_b = this.reader.getFloat(diffuse, 'b', 1);
        var specular_a = this.reader.getFloat(diffuse, 'a', 1);
 
        var shininess = materials_ini[0].children[i].getElementsByTagName("shininess");
        var shininess = shininess[0];
        var value = this.reader.getFloat(shininess, 'value', 1);
 
        console.log("MATERIAL " + i + " id " + matID + 
        " emission " + emission_r + " " + emission_g + " " + emission_b + " " + emission_a + 
        " ambient " + ambient_r + " " + ambient_g + " " + ambient_b + " " + ambient_a +
        " diffuse " + diffuse_r + " " + diffuse_g + " " + diffuse_b + " " + diffuse_a +
        " specular " + specular_r + " " + specular_g + " " + specular_b + " " + specular_a +
        " shininess " + value);
 
        var mat = new MyMaterial(matID);
        mat.setEmission(emission_r, emission_g, emission_b, emission_a);
        mat.setAmbient(ambient_r, ambient_g, ambient_g, ambient_a);
        mat.setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);
        mat.setSpecular(specular_r, specular_g, specular_b, specular_a);
        mat.setShininess(value);
 
        this.materials_list[i] = mat;
 
    }
 
};

MySceneGraph.prototype.parseAnimations = function(rootElement){
	var animations_ini = rootElement.getElementsByTagName("animations");

	if (animations_ini.length == 0){
		return "animation element is missing.";
	}

	this.animations_list=[]; //[id, MyAnimation]

	var nAnimations=animations_ini[0].children.length;

	for(var i=0;i<nAnimations;i++){

		var animationRef = animations_ini[0].children[i];
		var animationID = this.reader.getString(animationRef,'id',1);
		var animationSpan = this.reader.getFloat(animationRef,'span',1);
		var animationType = this.reader.getString(animationRef,'type',1);

		if(animationType == 'linear'){

			var vecControl = [];

			for(j = 0; j < animationRef.children.length; j++){
				var cp = animationRef.children[j];
				
				var cp_xx = this.reader.getFloat(cp, 'xx', 1);
				var cp_yy = this.reader.getFloat(cp, 'yy', 1);
				var cp_zz = this.reader.getFloat(cp, 'zz', 1);
				var pontoControlo = [cp_xx,cp_yy,cp_zz];

				vecControl.push(pontoControlo);
			}
			
			var animation = new MyLinearAnimation(animationID, animationSpan, animationType, vecControl);

			console.log("Leu linear animation: CP["+j+"] xx " +cp_xx+ " yy " +cp_yy+  " zz " + cp_zz);
			
		} else if (animationType == 'circular'){
				
				var center = this.reader.getString(animationRef, 'center', 1);
				var centerCoords = center.split(" ");
				var centerx = centerCoords[0];
				var centery = centerCoords[1];
				var centerz = centerCoords[2];
				var vecCenter = [centerx, centery, centerz];

				var radius = this.reader.getFloat(animationRef, 'radius', 1);
				var startang = this.reader.getFloat(animationRef, 'startang', 1);
				var rotang = this.reader.getFloat(animationRef, 'rotang', 1);

				var animation = new MyCircularAnimation(animationID, animationSpan, animationType, vecCenter, radius, startang, rotang);
				
				console.log("Leu circular animation: center " + centerCoords + " radius "+radius+" startang "+startang+ " rotang " + rotang);
			
		}

		var vecIdAnimacao = [animationID, animation]
		this.animations_list.push(vecIdAnimacao);

		
	}


};

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
 
    var primitives_ini = rootElement.getElementsByTagName("primitives");
 
    if (primitives_ini == null) {
        return "primitive element is missing.";
    }
 
    this.primitives_list = []; // ["referencia", MyPrimitive]
 
    var nPrimRef=primitives_ini[0].children.length; //num primitivas referenciadas
 
    for(var i=0; i<nPrimRef; i++){

		var primID = this.reader.getString(primitives_ini[0].children[i],"id", 1);

		var primitive_name = primitives_ini[0].children[i].children[0].nodeName;

		if(primitive_name == "rectangle"){
			 // RECTANGLE
            console.log("rectangle found");

            primAtual = primitives_ini[0].children[i].getElementsByTagName("rectangle");
 
            var rec = primAtual[0];
            var x1 = this.reader.getFloat(rec, 'x1', 1);
            var y1 = this.reader.getFloat(rec, 'y1', 1);
            var x2 = this.reader.getFloat(rec, 'x2', 1);
            var y2 = this.reader.getFloat(rec, 'y2', 1);
     
            console.log("rectangulo  = " + x1 + " " + y1 + " "+ x2 + " " + y2);
 
            var rectangle = new MyRectangle (this.scene, x1, y1, x2, y2);
            var prim = new MyPrimitive(primID, rectangle);

		} else if (primitive_name == "triangle"){
			// TRIANGLE
			console.log("triangle found");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("triangle");

			var tri = primAtual[0];
			var x1 = this.reader.getFloat(tri, 'x1', 1);
			var x2 = this.reader.getFloat(tri, 'x2', 1);
			var x3 = this.reader.getFloat(tri, 'x3', 1);
			var y1 = this.reader.getFloat(tri, 'y1', 1);
			var y2 = this.reader.getFloat(tri, 'y2', 1);
			var y3 = this.reader.getFloat(tri, 'y3', 1);
			var z1 = this.reader.getFloat(tri, 'z1', 1);
			var z2 = this.reader.getFloat(tri, 'z2', 1);
			var z3 = this.reader.getFloat(tri, 'z3', 1);


			console.log("triangulo = " + x1 + " " + y1 + " " + z1 + " " +
			x2 + " " + y2 + " " + z2 + " " + x3 + " " + y3 + " " + z3);

			var triangle = new MyTriangle(this.scene, x1,x2,x3,y1,y2,y3,z1,z2,z3);
			var prim = new MyPrimitive(primID, triangle);

		} else if (primitive_name == "cylinder"){
			 // CYLINDER
			console.log("cylinder found");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("cylinder");

			var cyl = primAtual[0];
			var base = this.reader.getFloat(cyl, 'base', 1);
			var top = this.reader.getFloat(cyl, 'top', 1);
			var height = this.reader.getFloat(cyl, 'height', 1);
			var slices = this.reader.getFloat(cyl, 'slices', 1);
			var stacks = this.reader.getFloat(cyl, 'stacks', 1);

			console.log("Cylinder initials read from file: { base=" + 
			base + ", top=" + top + ", height=" + height + ", slices=" +
			slices + ", stacks=" + stacks + ") }");

			var cylinder = new MyCylinderWithTops(this.scene,base,top,height,slices,stacks);
			var prim = new MyPrimitive(primID, cylinder);


		} else if (primitive_name == "sphere") {
			// SPHERE
			console.log("sphere found");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("sphere");

			var sphere = primAtual[0];

			var radius = this.reader.getFloat(sphere, 'radius',1);
			var slices = this.reader.getFloat(sphere, 'slices',1);
			var stacks = this.reader.getFloat(sphere, 'stacks',1);

			var sph = new MySphere(this.scene,radius, slices,stacks);
			var prim = new MyPrimitive(primID, sph);

			console.log("Sphere initials read from file: { radius=" + 
			radius + ", slices=" + slices + ", stacks=" + stacks + ") }");

		} else if (primitive_name == "plane") {

			// PLANE

			console.log("plane found.");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("plane");

			var plane = primAtual[0];

			var dimX = this.reader.getFloat(plane, 'dimX', 1);
			var dimY = this.reader.getFloat(plane, 'dimY', 1);
			var partsX = this.reader.getInteger(plane, 'partsX', 1);
			var partsY = this.reader.getInteger(plane, 'partsY', 1);

			console.log("Plane initials read from file: { dimX=" + 
			dimX + ", dimY=" + dimY + ", partsX=" + partsX + ", partsY=" +
			partsY + ") }");

			var pl = new MyPlane(this.scene, dimX, dimY, partsX, partsY);
			var prim = new MyPrimitive(primID, pl);

		} else if (primitive_name == "patch") {

			// PATCH

			console.log("patch found.");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("patch");

			var patch = primAtual[0];

			var orderU = this.reader.getInteger(patch, 'orderU', 1);
			var orderV = this.reader.getInteger(patch, 'orderV', 1);
			var partsU = this.reader.getInteger(patch, 'partsU', 1);
			var partsV = this.reader.getInteger(patch, 'partsV', 1);

			console.log("Patch initials read from file: { orderU=" + 
			orderU + ", orderV=" + orderV + ", partsU=" + partsU + ", partsV=" +
			partsV + ") }");

			var controlPoints = [];

			for(var j = 0; j < patch.children.length; j++){

				var cp = patch.children[j];

				var x = this.reader.getFloat(cp, 'x', 1);
				var y = this.reader.getFloat(cp, 'y', 1);
				var z = this.reader.getFloat(cp, 'z', 1);

				var control_point = [];

				control_point.push(x);
				control_point.push(y);
				control_point.push(z);
				control_point.push(1);

				controlPoints.push(control_point);

				console.log("CONTROL POINTS " + j + " : " + controlPoints[j]);

				console.log("Patch control field: x - " + x + " y - " + y + " z - " + z);
			}

			var newCP = [];

			for(var j = 0; j <= orderU; j++){

				var tmp = [];
				for(var k = 0; k <= orderV; k++){
					var cp = controlPoints[j*(orderV + 1) + k];
					tmp.push(cp);
				}
				newCP.push(tmp);
			}

			for(var j = 0; j < newCP.length; j++){
				console.log("NEW CP " + newCP[j]);

			}

			var patch = new MyPatch(this.scene, orderU, orderV, partsU, partsV, newCP);
			var prim = new MyPrimitive(primID, patch);


		} else if (primitive_name == "board") {
			// BOARD

			console.log("board found.");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("board");

			var piece = primAtual[0];

			var size_casa = this.reader.getFloat(piece, 'size_casa', 1);
			var first_player = this.reader.getString(piece, 'first_player', 1);

			console.log("Board initials read from file: { size_casa = " + size_casa + " first_player = " + first_player + "}");

			this.board = new MyBoard(this.scene, size_casa, first_player);
			var prim = new MyPrimitive(primID, this.board);

		} else if (primitive_name == "piece") {
			// PLANE

			console.log("piece found.");

			primAtual = primitives_ini[0].children[i].getElementsByTagName("piece");

			var piece = primAtual[0];

			var nFloors = this.reader.getInteger(piece, 'nFloors', 1);
			var type = this.reader.getString(piece, 'type', 1);

			console.log("Piece initials read from file: { nFloors = " + nFloors + " type = " + type + " }");

			var piece = new MyPiece(this.scene, nFloors, type);
			var prim = new MyPrimitive(primID, piece);

		} else if (primitive_name == "vehicle") {
			console.log("vehicle found.");

			var vehicle = new MyVehicle(this.scene);
			var prim = new MyPrimitive(primID, vehicle);

		} else if (primitive_name == "time_counter") {
			console.log("time counter found");

			var tim = new TimeCounter(this.scene, 0, 0, 0, 0);
			var prim = new MyPrimitive(primID, tim);
		}
		else if (primitive_name == "chessboard") {
			// CHESSBOARD

			primAtual = primitives_ini[0].children[i].getElementsByTagName("chessboard");

			console.log("chessboard found.");
			var chessboard = primAtual[0];

			var du = this.reader.getInteger(chessboard, 'du', 1);
			var dv = this.reader.getInteger(chessboard, 'dv', 1);
			var textureref  = this.reader.getString(chessboard, 'textureref', 1);
			var su = this.reader.getInteger(chessboard, 'su', 1);
			var sv = this.reader.getInteger(chessboard, 'sv', 1);

			console.log("Chessboard initials read from file: { du=" + du + " dv=" + dv + "textureref=" +
			textureref + " su=" + su + " sv=" + sv + ") }");

			var c1 = [];
			var c2 = [];
			var cs = [];

			var colors = [];

			for(var j = 0; j < chessboard.children.length; j++){

				var color = chessboard.children[j];

				var r = this.reader.getFloat(color, 'r', 1);
				var g = this.reader.getFloat(color, 'g', 1);
				var b = this.reader.getFloat(color, 'b', 1);
				var a = this.reader.getFloat(color, 'a', 1);

				var col = [r,g,b,a];

				colors.push(col);

			}

			var col1 = colors[0];
			var col2 = colors[1];
			var col3 = colors[2];

			console.log("c1 " + col1 + " c2 " + col2 + 
			" cs " + col3);

			var filename = "";

			for(var ind= 0; ind < this.textures_list.length; ind++){
				if(textureref == this.textures_list[ind].id)
					filename = this.textures_list[ind].file;
			}

			var chess = new MyChessboard(this.scene, du, dv, filename,su,sv, col1, col2, col3);
			var prim = new MyPrimitive(primID, chess);
		}  else{
			console.log("invalid primitive");
		}
	 
 		console.log("primID : " + primID + " prim " + prim);
 		var paraLista = [primID, prim]; //terá o id do dsx e a MyPrimitive
 		this.primitives_list[i] = paraLista; 
               
    
    }


	console.table(this.primitives_list);

};


MySceneGraph.prototype.parseTransformation = function(rootElement){ //transformacao vazia guarda matriz identidade
																	//guarda de cada transformation uma matriz na lista	
	this.transformation_list = [];
	this.transformation_list_matrix = [];
	
	var transformation_ini = rootElement.getElementsByTagName("transformations");

	if (transformation_ini == null) {
		return "transformation element is missing.";
	}

	var nTrans = transformation_ini[0].children.length;
	for(var j=0; j<nTrans; j++){ ////transformacoes referenciadas

		var matrix = mat4.create();
        mat4.identity(matrix);

		var transformationRef = transformation_ini[0].children[j]; // uma transformation referenciada
		var transID = this.reader.getString(transformationRef,"id",1);


		var numPrim = transformationRef.children.length;

		for(var k = 0 ; k<numPrim; k++){
			var transformationPrim = transformationRef.children[k];

			switch(transformationPrim.tagName){
				case 'translate':
						
						this.x = this.reader.getFloat(transformationPrim,'x',1);
						this.y = this.reader.getFloat(transformationPrim,'y',1);
						this.z = this.reader.getFloat(transformationPrim,'z',1);
						console.log("Transformacao explicita: " + transformationPrim.tagName + " " + this.x + " " +this.y+ " "+this.z);

						this.vecTranslate = [this.x,this.y,this.z];
						
						var novaTransf = new MyTransformation(transformationPrim.tagName, this.vecTranslate);
						var vecTransRef = [transID, novaTransf];
				
						this.newMatrix = mat4.translate(matrix,matrix,this.vecTranslate); //altera matrix

						break;
				case 'rotate':
						this.axis = this.reader.getString(transformationPrim,'axis',1);
						this.angle = this.reader.getFloat(transformationPrim,'angle',1);

						this.angle = (this.angle * Math.PI * 2)/360;

						console.log("Transformacao explicita: " + transformationPrim.tagName + " " + this.axis + " " +this.angle);

						this.vecRotate = [this.axis,this.angle];
						
						var novaTransf = new MyTransformation(transformationPrim.tagName, this.vecRotate);
						var vecTransRef = [transID, novaTransf];

						switch(this.axis){
                        case 'x':
                                this.newMatrix = mat4.rotateX(matrix, matrix, this.angle);
         
                                break;
                        case 'y':
                                this.newMatrix = mat4.rotateY(matrix, matrix, this.angle);
                                break;
                        case 'z':
                                this.newMatrix = mat4.rotateZ(matrix, matrix, this.angle);
                                break;
                   		}
						
						break;
				case 'scale':
						this.x = this.reader.getFloat(transformationPrim,'x',1);
						this.y = this.reader.getFloat(transformationPrim,'y',1);
						this.z = this.reader.getFloat(transformationPrim,'z',1);
						console.log("Transformacao explicita: " + transformationPrim.tagName + " " + this.x + " " +this.y+ " "+this.z);

						this.vecScale = [this.x,this.y,this.z];						

						var novaTransf = new MyTransformation(transformationPrim.tagName, this.vecTranslate);
						var vecTransRef = [transID, novaTransf];
						
						this.newMatrix = mat4.scale(matrix,matrix,this.vecScale); //altera matrix

						break;
				default:
						console.log("Erro. A seguinte transformacao nao e suportada: " + transID);
						return -1;
			}

			console.log("A por transformacao na lista: " + matrix);
			this.transformation_list.push(vecTransRef);

			var vecTransf=[transID,matrix];
    		this.transformation_list_matrix.push(vecTransf); //se der erro ver se tem de ser this
		}


	}
};
	
MySceneGraph.prototype.addCustomTransformation = function(id, no){	

	var nTrans = this.transformation_list.length;

	for(var j=0; j<nTrans; j++){ //TRANSFORMATIONS

		var transformation = this.transformation_list[j];
		this.transID = transformation[0];

		if(this.transID != id){
			continue;
		}
		else{
			console.log("Encontrou transformacao explicita. Vai adicionar MyTransformation" + transformation[1] + " ao no.");
			no.addTransformation(transformation[1]); //adiciona MyTransformation
		}

	}

};

MySceneGraph.prototype.addCustomTransformationMatrix = function(id, no){	

	var nTrans = this.transformation_list_matrix.length;

	for(var j=0; j<nTrans; j++){ //TRANSFORMATIONS

		var transformation = this.transformation_list_matrix[j];
		var transID = transformation[0];
console.log	("list matrix 0: " + transformation);
		if(transID != id){
			continue;
		}
		else{
			console.log("Encontrou transformacao explicita. Vai adicionar matriz " + transformation[1] + " ao no.");
			no.addMatrix(transformation[1]); //adiciona matriz
		}

	}

};

MySceneGraph.prototype.parseComponent = function(rootElement){ //nao verificamos se cada componente e exclusivamente folha ou intermedio 
																// se tiver pelo menos uma primitiva nao pode ter children (folha)


	var component_ini = rootElement.getElementsByTagName("components");

	if (component_ini == null) {
		return "components element is missing.";
	}

	this.component_list=[];

	var components = component_ini[0].getElementsByTagName("component");

	var nComp = components.length;

	for(var i=0; i<nComp; i++){ // COMPONENTS
		var component = component_ini[0].children[i];
		
		var componentID = this.reader.getString(component, 'id',1);

		var no = new MyNode(componentID);

//TRANSFORMATIONS

	var transformation_ini = component.getElementsByTagName('transformation');
	if (transformation_ini == null) {
		return "components element is missing transformation.";
	}

	var nTrans = transformation_ini[0].children.length;
	
	for(j=(nTrans-1); j>-1; j--){ //TRANSFORMATIONS percorremos ao contrario porque estamos a usar mat4 multiply
		var transformation = transformation_ini[0].children[j];
			
		var matrix = mat4.create();
		mat4.identity(matrix);

		switch(transformation.tagName){
			case 'translate':
				
					var x = this.reader.getFloat(transformation,'x',1);
					var y = this.reader.getFloat(transformation,'y',1);
					var z = this.reader.getFloat(transformation,'z',1);
					console.log("Transformacao explicita em component: " + transformation.tagName + " " + x + " " +y+ " "+ z);

					vecTranslate = [x,y,z];

					var novaTransf = new MyTransformation(transformation.tagName, vecTranslate);
					no.addTransformation(novaTransf);

					var newMatrix = mat4.translate(matrix,matrix,vecTranslate) //altera matrix
					no.addMatrix(newMatrix);
					break;
			case 'rotate':
					axis = this.reader.getString(transformation,'axis',1);
					angle = this.reader.getFloat(transformation,'angle',1);

					angle = (angle * Math.PI * 2)/360;

					console.log("Transformacao explicita em component: " + transformation.tagName + " " + axis + " " +angle);

					vecRotate = [axis,angle];

					var novaTransf = new MyTransformation(transformation.tagName, vecRotate);
					no.addTransformation(novaTransf);
				
					switch(axis){
    	                case 'x':
        	                var newMatrix = mat4.rotateX(matrix, matrix, angle);
 
                            break;
                        case 'y':
                            var newMatrix = mat4.rotateY(matrix, matrix, angle);
                            break;
                        case 'z':
                            var newMatrix = mat4.rotateZ(matrix, matrix, angle);
                            break;
 	                 }

                    console.log("Matriz a adicionar ao no: " + newMatrix);
                    no.addMatrix(newMatrix);

					break;
			case 'scale':
					var x = this.reader.getFloat(transformation,'x',1);
					var y = this.reader.getFloat(transformation,'y',1);
					var z = this.reader.getFloat(transformation,'z',1);
					console.log("Transformacao explicita em component: " + transformation.tagName + " " + x + " " +y+ " "+z);

					var vecScale = [x,y,z];

					var novaTransf = new MyTransformation(transformation.tagName, vecScale);
					no.addTransformation(novaTransf);

					var newMatrix = mat4.scale(matrix,matrix,vecScale); //retorna matrix
                        
                        console.log("Matriz a adicionar ao no: " + newMatrix);
                        no.addMatrix(newMatrix);

						break;
				default:
						var transID = this.reader.getString(transformation, 'id', 1);
						console.log("Transformacao referenciada: " + transID);
						this.addCustomTransformation(transID, no); //FAZER FUNCAO PARA MULTIPLICAR AS TRANSFORMACOES NUMA TRANSFORMACAO
						this.addCustomTransformationMatrix(transID, no);
						break;
			}

			console.log("Matrix no no " + no.getMatrix());
		}

//MATERIALS
	
	var material_ini = components[i].getElementsByTagName('materials');
		if (material_ini == null) {
			return "components element is missing materials.";
		}

		var nMaterial = material_ini[0].children.length;
		

		for(var j=0; j<nMaterial; j++){ //materiais
			var material = material_ini[0].children[j];
			
			id = this.reader.getString(material,'id',1);
			
			no.setMaterial(id); //material default e o primeiro - deviamos arranjar melhor forma de fazer isto

			if(this.id != "inherit"){
				no.addMaterial(id);
			}
		}

//TEXTURE - so ha uma!

	var texture_ini = components[i].getElementsByTagName('texture');

	if (texture_ini == null) {
		return "components element is missing texture.";
	}
	
	var texture = texture_ini[0];
	var textID = this.reader.getString(texture, "id", 1);

	//if(id != "inherit"){ //ainda nao temos inherit :( 
		no.setTexture(textID);
	//}
	

//CHILDREN

	var children_ini = components[i].getElementsByTagName('children');

	if (children_ini == null) {
		return "components element is missing children.";
	}

	var nChild = children_ini[0].children.length;

	for(var j=0; j<nChild; j++){ //percorrer children
		var child = children_ini[0].children[j];
			
		id = this.reader.getString(child,'id',1);

		if(child.tagName == "primitiveref"){ //e primitiva e nao outro componente
			no.addPrimitive(id)
		}
		else {
			no.addChild(id); //tem de ser o id porque nao podemos criar um mynode do nada so com o id. temos de percorrer os existentes
		}
	}
//ANIMATIONS
	var animation_ini = components[i].getElementsByTagName('animation');

	if (animation_ini.length != 0) {

		var nAnimations = animation_ini[0].children.length;
		for(var a = 0; a < nAnimations; a++){
console.log("num animations " + nAnimations);
			var aniChild = animation_ini[0].children[a];
			
			var aniId = this.reader.getString(aniChild,'id',1);

			console.log("Encontrou animacao: " + aniId);

			no.addAnimation(aniId);
		}
	
	}

console.log("------------- PUSH " + i);

	this.component_list.push(no);

	}

console.log("------------- FIM");
};

	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: " + message);	
	this.loadedOk=false;
};