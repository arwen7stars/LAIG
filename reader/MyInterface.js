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

	this.omniLights=this.gui.addFolder("Omni Lights");
	this.spotLights=this.gui.addFolder("Spot Lights");
	this.omniLights.open();
	this.spotLights.open();

	return true;
};

MyInterface.prototype.addOmniLight = function(lightId) {
		this.omniLights.add(this.scene, lightId);
};

MyInterface.prototype.addSpotLight = function(lightId) {
		this.spotLights.add(this.scene, lightId);
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	switch (event.keyCode)
	{
		case (109):	// m
		  console.log("m pushed");
		  this.scene.playPerspectiveAnimation();
		  break;
		case(77): // M
		  console.log("M pushed");
		  this.scene.playPerspectiveAnimation();
		  break;
	};
};
