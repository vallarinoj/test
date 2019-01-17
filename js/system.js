var api_url = 'http://server.gspanama.com/api2';
var img_url = 'http://server.gspanama.com/img_cache/';
var tax_val = 0.07;
var Debugger = function(gState, klass) {
  this.debug = {}
  if (!window.console) return function(){}
  if (gState && klass.isDebug) {
    for (var m in console){
      	if (typeof console[m] == 'function'){
        	this.debug[m] = console[m].bind(window.console, klass.toString()+": ");
		}
	}
  }else{
    for (var m in console){
      if (typeof console[m] == 'function'){
        this.debug[m] = function(){}
	  }
	}
  }
  return this.debug
}

isDebug = true //global debug state
var ts = function(){
	return Math.round(new Date().getTime()/1000);
}
// we instantiate with the global switch and a ref to this for the local
// this must have it's own isDebug defined for local controll
debug = Debugger(isDebug, this)
error = function(msg){
	throw new Error(msg);
}
function filtrar(array_ini, nombre_var, valor_var, tipo_filtro){
  var array_fin = new Array;
		array_ini.forEach(function(item){
		  switch(tipo_filtro){
			case 'like':
			var item_val = String(item[nombre_var]).toLowerCase();
			valor_var = valor_var.toLowerCase();
			if(item_val.indexOf(valor_var) != -1){
			  array_fin.push(item);
			}
			break;
			case '=':
			if(item[nombre_var] == valor_var){
			  array_fin.push(item);
			}
			break;
			case '>':
			if(item[nombre_var] > valor_var){
			  array_fin.push(item);
			}
			break;
			case '>=':
			if(item[nombre_var] >= valor_var){
			  array_fin.push(item);
			}
			break;
			case '<':
			if(item[nombre_var] < valor_var){
			  array_fin.push(item);
			}
			break;
			case '<=':
			if(item[nombre_var] <= valor_var){
			  array_fin.push(item);
			}
			break;
			case '!=':
			if(item[nombre_var] != valor_var){
			  array_fin.push(item);
			}
			break;
			case '!isset':
			if(typeof(item[nombre_var]) == 'undefined'){
			  array_fin.push(item);
			}
			break;
			case 'isset':
			if(typeof(item[nombre_var]) != 'undefined'){
			  array_fin.push(item);
			}
			break;
		  }
		});
  return array_fin;
}
function formatfecha(inputFormat) {//dd/mm/yyyy
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}
function validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}