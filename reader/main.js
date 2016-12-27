//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyPerspective.js', 'MyCylinder.js', 'MyRectangle.js', 
								'MyTriangle.js', 'MyPrimitive.js', 'MyNode.js', 'MyTransformation.js', 'MyCylinderWithTops.js',
								'MyCircle.js', 'MyInterface.js','MyLight.js','MyTexture.js', 'MyMaterial.js', 'MySphere.js',
								'MySemiSphere.js','MyLamp.js', 'MyLinearAnimation.js', 'MyCircularAnimation.js','MyPatch.js',
								'MyPlane.js', 'MyVehicle.js', 'MyChessboard.js', 'MyPiece.js','MyBoard.js', 'MyTopFloor.js',
								'PieceBoard.js', 'MyQuad.js', 'MyUnitCubeQuad.js', 'TimeCounter.js', 'Game.js', 'PerspAnimation.js',
								'MyHandler.js',
main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new XMLscene();
    var myInterface = new MyInterface();

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myScene.getInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
	var filename=getUrlVars()['file'] || "cenaV0.dsx";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);
	
	// start
    app.run();
}

]);