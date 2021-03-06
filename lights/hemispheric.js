/************************************************************ license:

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	
	project:	BIM United FC
	module: 	lightHemi
	author:		Andrew Siddeley 
	started:	27-Jan-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module){

var BABYLON=require('babylon');
var $=require('jquery');
var Instrument=require('handles/Handle');
var Nameable=require('features/Nameable');
var Position=require('features/Position');

var Hemispheric=function(topFeatures){

	Instrument.call(this, topFeatures);
	
	this.bimType='Hemispheric'; //DEP? - instead use bimhandler.constructor.name
	this.desc='A volumetric pixel or 10 unit cube that can be placed at 10 unit coordinates.';
	//Note that the following method is inherited from Element...
	this.addFeatures(Nameable, Position);
}

//inherit prototype from super
Hemispheric.prototype=Object.create(Instrument.prototype);
Hemispheric.prototype.constructor=Instrument;
//shortcut
var __=Hemispheric.prototype;	

__.setScene=function(scene, mesh){
	Instrument.prototype.setScene.call(this, scene, mesh);
	var mesh=new BABYLON.HemisphericLight('hemiTop', new BABYLON.Vector3(0,10,0), BIM.scene);
	//new BABYLON.HemisphericLight('hemiBottom', new BABYLON.Vector3(10,10,10), BIM.scene);
	
};


return Hemispheric;
});