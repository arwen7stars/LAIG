/**
 * MyInterface 
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	this.lights = this.gui.addFolder("Lights");
	this.omniLights = this.lights.addFolder("Omni Lights");
	this.spotLights = this.lights.addFolder("Spot Lights");
	this.controls = this.gui.addFolder("Controls");
	this.controls.add(this, "handleUndo").name("Undo");
	this.controls.open();
	return true;
};

MyInterface.prototype.addOmniLight = function(lightId) {
		this.omniLights.add(this.scene, lightId);
};

MyInterface.prototype.addSpotLight = function(lightId) {
		this.spotLights.add(this.scene, lightId);
};

MyInterface.prototype.handleUndo= function(){
	this.scene.game.undoLastPlay();
}

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	switch (event.keyCode)
	{
		case(13): // v
            this.scene.game.setNextPersp();
            break;
	};
};
