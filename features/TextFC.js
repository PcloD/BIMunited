/************************************************************

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

	
	project:	BIM united FC
	module:		uiFeatureText
	desc:		field for editing a text feature
	by: 		Andrew Siddeley 
	started:	26-Mar-2017
**************************************************************/

// Define module with simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {
	
var $=require('jquery');
var FC=require('features/FC');

var TextFC=function(place, feature) {
	//Inherits from FeatureEditor, call super constructor to initialize
	FC.call(this, place, feature);
	
	//this.prop$.hide(); //inherited but not used
	this.text$=$('<input type="text" placeholder=" " value="--"></input>');
	try{ this.text$.val(feature.prop); } catch(er) { BIM.fun.log(er.toString()) ;};
	this.ok$=$('<input type="submit" value="ok">');
	this.form$.append(this.text$, this.ok$);
	return this;
};

//inherit prototype...
TextFC.prototype=Object.create(FC.prototype);
TextFC.prototype.constructor=TextFC;

var __=TextFC.prototype;

//override 
__.onSubmit=function(ev) {
	//ok button triggers local form event
	//call prototype function and pass as arguments, event, feature and updated valu
	//onSubmit triggers the featureChange event 	
	ev.data.feature.propToBe=ev.data.text$.val(); //note how new property value is passed for base class to call updater() with
	FC.prototype.onSubmit.call(ev.data, ev, ev.data.feature);
};

//override
__.onFeatureChange=function(ev, feature){
	//this function is called by the BIM wide featureChange event (triggered by onSubmit) 
	//calling the prototype function takes care of executing feature-callback function to update mesh
	FC.prototype.onFeatureChange.call(ev.data, ev, feature); 
	//To Do - anything that needs updating due the changed feature 
};

//override start function
__.start=function(){
	//call super function - mainly to wigetize the form 
	FC.prototype.start.call(this);
	//try{ this.text$.val(feature.valu); } catch(er) {BIM.fun.log(er.toString());}
};

return TextFC;

}); //end of define

