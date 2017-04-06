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

	
	project:	BIM
	desc:		
		
	module: 	widgetCell
	desc: 		Defines a cell widget in jquery. A cell widget has 3 fields, name, input and result. 
	Normally, the name and result fields are shown while the input is hiden. In edit mode, 
	the result field is hidden and input or field is shown to allow text editing.
	values in the edit field that begin with '=' are treated as expressions and processed similar
	to a cell in a spreadsheet.
	
	usage:	$( DOMelement ).wCell({name:'radius', valu:2.1, onCommit:function(valuRevised){});
	
	
	by: 		Andrew Siddeley 
	started:	29-Jan-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'jquery-ui'],

// Then do...
function($, ui) {

// define a cell widget 
$.widget ("bim.wCell", {

_create:function() {

	this.option({
		label: 'unnamed',
		onCommit:function(){}, 
		onCommitArg1:null,
		type: 'string', //type of valu
		undo:[],
		valu: 'hello',
		//jquery wrapped divs or fields initialized in create
		$label:null, //holds the property name. Always shows
		$edit:null, //holds any editing fields, buttons etc.  Normally hidden until revealled
		$valu:null, //holds the valu or result of any editing.  Normally shows, hidden when editing	
		$text:null, //
	});

	var $label=$('<div></div>').addClass('bimCellname').text(this.option('label'));
	var $edit=$('<div></div>').addClass('bimCelledit');
	var $valu=$('<div></div>').addClass('bimCellvalu').text(this.option('valu'));
	var $text=$('<textarea></textarea>').addClass('bimCelltextarea').text(this.option('valu'));
	var ok$=$('<button>ok</button>').addClass('bimButton').on('click', this, this.oktrigger); //event,arg1,
	
	var autoheight=function(ev){
		//element $input is passed as ev.data
		ev.data.css('height','auto');
		var h=ev.data[0].scrollHeight+5;
		ev.data.css('height', h);
		//BIM.fun.log('autoheight'+h);
	};
	
	$text.on("click keyup", $text, autoheight);
	$edit.append($text).append(ok$);
	
	this.element.addClass('bimCell');
	this.element.append($label, $edit, $valu);
	
	this.option('$label', $label);
	this.option('$edit', $edit);
	this.option('$text', $text);
	this.option('$valu', $valu);

	this._on( this.element, {
		ok:'ok',
		click:'revise',
		dblclick:'ok',
		contextmenu:'contextmenu',
		//mouseenter:'revise', 
		//mouseleave:'reviseoff'
	});
},

access:function(label, valu, onChange, onChangeArg1){
	this.vlca(valu, label, onChange, onChangeArg1);
},

//cancel DOM default context menu Ie. right click floating menu
contextmenu:function(event) {return false; },

cancel:function(){this.reviseoff();},

ok:function(ev) {
	var that=this; //ev.data;
	//BIM.ui.log('ok'+that.options.valu)
	var rv=that.revisedvalu();
	var rt=typeof rv;
	var valu=that.option('valu');
	var type=that.option('type');
	
	if (rt != type) {
		//return type is different from input type so try to fix
		var er='warning, wrong type';
		if (rt=='undefined' || rt==null){
			BIM.fun.log(er);return;
		}
		switch(type){
			case 'string': rv=rv.toString(); break;
			case 'number': rv=parseFloat(rv.toString()); break;
			case 'boolean': rv=Boolean(rv.toString()); break;		
			default: BIM.fun.log(er);return;
		};
		if (isNaN(rv)){BIM.fun.log(er);return;}
	};
	
	if(rv != valu) {
		//has valu been revised? if so do following... 
		var part=that.option('onChangeArg1');
		that.undopush(valu); //update undo stack
		that.option('valu', rv); //update value
		
		//execute callback to inform caller of revised value
		//this.option('onChange')(null, part, rv); 
		that.element.trigger('bimFeature', [part, rv]);
	};
},


//_trigger:function(arg){return this._super(arg);},

oktrigger:function(ev){
	//keyword 'this' is passed as event data as 
	ev.data._trigger('ok');  
},

okDEPRICTED:function(){this.commit(); this.reviseoff();},

option:function(key, valu){ 
	if(typeof valu == 'undefined'){
		return this._super(key); 
	} else {
		return this._super(key,valu);
	}
},

revise:function(event) {
	this.option('$label').text(this.option('label')).show();
	this.option('$edit').show();	
	this.option('$valu').text(this.option('valu')).hide();	
	this.option('$text').val(this.option('valu'));
},

reviseoff:function(event){
	this.option('$label').text(this.option('label')).show();
	this.option('$valu').text(this.option('valu')).show();
	//this.option('$text').text(this.option('valu'));
	this.option('$edit').hide();
},

revisedvalu:function(that){
	var that=this;
	var rv=that.option('$text').val();
	if (rv.substr(0,1) == '=') {
		try{rv=eval(rv.substr(1));}
		catch(er){
			BIM.ui.blackboard.log('expression error: ' + er.toString());
			rv=that.option('valu');
		}
	}
	return rv;
},

_setOption: function( key, valu ) {
   //if ( key === "valu" ) {valu = this._checkValu( valu );}
   this._super( key, valu );
},

_setOptions: function( options ) {this._super( options );},	

undo:function(){
	//reserved
},

undopush:function(valu){
	//add value to the undo stack
	this.option('undo').push(valu);
	//but limit it to just 10 changes
	if (this.option('undo').length > 10) {this.option('undo').shift();}
},

// API function to set value, label, callback and argument1 (part)
// to do - rename to start
vlca:function(valu, label, onChange, onChangeArg1){
	//BIM.fun.log('valu, type:'+ valu + ',' + typeof(valu));
	this.option({
		label:label,
		onChange:onChange,
		onChangeArg1:onChangeArg1,
		type:typeof(valu),
		valu:valu
	});
	//BIM.ui.log('valu '+valu);
	this.element.show();
	this.reviseoff();
	
	//to do - rewrite as an event
	this.element.off('bimFeature'); //reset
	this.element.on('bimFeature', BIM.ui.picker.onFeature );
	this.element.on('bimFeature', onChange)
	
}


}); //end of widget
}); //end of define
