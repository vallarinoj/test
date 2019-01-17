// JavaScript Document
app.controller('FPController', function($rootScope,$scope, $route, $routeParams, $location, DBService, ApiService, $q, $compile){
	$scope.sucursales = [];
	$scope.sucursal_sel = {};
	$scope.sucursal_sel.id = 0;
	$scope.sucursal_sel.nombre = '';
	$scope.sucursal_sel.floor_plans = [];
	$scope.floor_plans = [];
	$scope.fp_sel = {};
	$scope.fp_sel.id = 0;
	$scope.fp_sel.svg = '';
	$scope.ambientes = [];
	$scope.tipoAmbiente = [];//$rootScope.tipoAmbiente;
	$scope.fpLoading = true;
	$scope.closeAlert = function(index) {
		$rootScope.globals.msgConn.splice(index, 1);
	};
	/*$scope.selSucursal = function(idSucursal){
		DBService.tabla['sucursal'].get(parseInt(idSucursal), function(data){
			$scope.sucursal_sel = data;
			$rootScope.globals.sucursalSel = $scope.sucursal_sel.id;
			$rootScope.bodegaActual = $scope.sucursal_sel.id_bodega;
			$scope.selFP(0);
		}, function(){debug.info("ERROR")});
	}*/
	$scope.getAmbientes = function(floorplan){
		//$scope.tipoAmbiente = [];
		//debug.info('getAmbientes');
		var vars = {};
		vars.fp = floorplan;
		ApiService.getData('ambientes_fp', vars).then(function(data){
			//debug.info(data);
			$scope.ambientes = data.ambientes;
			$scope.fpLoading = false;
			$scope.tipoAmbiente = data.tipos;
			//debug.info("fin_fp");
			if(data.usar_zoom == 1){
				$scope.iniAmbientes();
			}
		});

	}
    $scope.iniciar_sucursal = function(){
    	//debug.info('iniciar_sucursal');
    	ApiService.getData('sucursal_actual').then(function(data){
    		//debug.info(data);
    		$scope.sucursal_sel = data[0];
    		//debug.info($scope.sucursal_sel);
			$rootScope.globals.sucursalSel = $scope.sucursal_sel.id;
			$rootScope.bodegaActual = $scope.sucursal_sel.id_bodega;
			$scope.floor_plans = $scope.sucursal_sel.floor_plans;
			if(data[0].id != 0){
				$scope.selFP(0);
			}else{
				$scope.fpLoading = false;
			}
    	});
    }
	$rootScope.$watch('globals.logueado', function(newValue, oldValue) {
		if(newValue){
			$scope.iniciar_sucursal();
		}
    });
	$scope.selFP = function(fpSelection){
		if($scope.sucursal_sel.id != 0){//es una de verdad
			//debug.info("selFP");
			//debug.info($scope.fp_sel);
			//debug.info($scope.sucursal_sel.floor_plans);
			if(fpSelection == 0){
				$scope.fp_sel = $scope.sucursal_sel.floor_plans[0];//se selecciona el primero
				//$scope.getTipoAmbiente().then(function(data){
					$scope.iniFP();
				//});
			}else{
				angular.forEach($scope.sucursal_sel.floor_plans, function(value, key) {
					if (value.id == fpSelection){
						$scope.fp_sel = value;//se selecciona el primero
						$scope.iniFP();
					}
				});
			}
		}
	};
	$scope.iniFP = function(){
		//debug.info('iniFP');
		if($scope.fp_sel.id != 0){//es una de verdad
			//debug.info("inicio_fp");
			$scope.fpLoading = true;
			//debug.info($scope.fp_sel.id);
			$scope.getAmbientes($scope.fp_sel.id);//.then(function(data){

			//});
		}
	};
	$scope.iniAmbientes = function(){
		if($scope.ambientes.length > 0 && $scope.fp_sel.svg != ''){
		//debug.info("iniAmbientes");
			if($scope.zoomSvg){
				$scope.zoomSvg.destroy();
				//debug.info("destroyed");
			}
			var svg_elm = angular.element(document.getElementById('svg_fp'));
		//debug.info(svg_elm);
		//debug.info("zoom_ini");
		var w = document.getElementById('container').clientWidth;
		var h = document.getElementById('container').clientHeight;
		$scope.zoomSvg = svgPanZoom('#svg_fp', {
		zoomEnabled: true,
		minZoom: .8,
		maxZoom: 2,
		controlIconsEnabled: false,
		fit: false,
		beforePan:function(oldPan, newPan){
			//debug.info("HOLA");
		var stopHorizontal = false
		, stopVertical = false
		, gutterWidth = w
		, gutterHeight = h
		// Computed variables
		, sizes = this.getSizes()
		/*, leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
		, rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
		, topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
		, bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);*/
		, leftLimit =  -(sizes.width* sizes.realZoom /2)
		, rightLimit = sizes.width/2
		, topLimit = -(sizes.height*sizes.realZoom /2)
		, bottomLimit = sizes.height/2;

		/*debug.info('ll = '+leftLimit);
		debug.info('rl = '+rightLimit);
		debug.info('tl'+topLimit);
		debug.info('bl'+bottomLimit);*/

		var customPan = {};
		customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
		customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
		//debug.info('newpan x  = '+newPan.x);
		//debug.info('custompan x  = '+customPan.x);
		return customPan;
		},
		customEventsHandler: {
		haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
		, init: function(options) {
		var instance = options.instance
		, initialScale = 1
		, pannedX = 0
		, pannedY = 0
		// Init Hammer
		// Listen only for pointer and touch events
		this.hammer = Hammer(options.svgElement, {
		inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
		})
		// Enable pinch
		this.hammer.get('pinch').set({enable: true})
		// Handle double tap
		this.hammer.on('doubletap', function(ev){
		instance.zoomIn();
		})
		// Handle pan
			this.hammer.on('panstart panmove', function(ev){
				// On pan start reset panned variables
				if (ev.type === 'panstart') {
					pannedX = 0
					pannedY = 0
				}
				// Pan only the difference
				instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
				pannedX = ev.deltaX
				pannedY = ev.deltaY
			})
			// Handle pinch
			this.hammer.on('pinchstart pinchmove', function(ev){
			// On pinch start remember initial zoom
			if (ev.type === 'pinchstart') {
				initialScale = instance.getZoom()
				instance.zoom(initialScale * ev.scale)
			}
			instance.zoom(initialScale * ev.scale)
		})
		// Prevent moving the page on some devices when panning over SVG
			options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
		}
		, destroy: function(){
			this.hammer.destroy()
		}
		}

		});
		}
	}
	$scope.mostrarAmbiente = function(ambiente_sel){
		if(ambiente_sel != false && ambiente_sel.productos.length > 0){
			//debug.info(ambiente_sel);
			if($rootScope.recorridoActual != false){
				DBService.agregar_recorrido_click('ambiente', ambiente_sel.id);
			}
			$location.path('/ambiente/'+ambiente_sel.id);
		}
	}
	//SE INICIA LA SUCURSAL ACTUAL
	//$scope.iniciar_sucursal();
});
app.controller('svgelementController', function($rootScope,$scope, $route, $routeParams, $location, DBService, $q, $compile){
	//debug.info('svgelement');

});
app.directive('svgelement',function ($compile) {
	  return {
		restrict: 'E',
		replace:true,
		controller: 'svgelementController',
		templateNamespace: 'svg',
		link: function ($scope, element, attrs) {
			//var mainsvg = angular.element(document.getElementById('svg_fp'));
			//var elm = createSVGNode('g', attrs);
			//
			//debug.info($scope.ambiente);
			var elm_val = String($scope.ambiente.svg);
			if(elm_val.length > 0){
				//debug.info(elm_val);
				//quitamos los tags
				elm_val = elm_val.replace(new RegExp('<', 'g'), '');
				elm_val = elm_val.replace(new RegExp('/>', 'g'), '');
				//quitamos los saltos
				elm_val = elm_val.replace(/(\r\n|\n|\r)/gm,"")
				//quitamos los espacios de mas
				elm_val = elm_val.replace(new RegExp('  ', 'g'), ' ');
				var elm_array = elm_val.split(' ');
				var tipo_elm = elm_array.shift();
				//debug.info(elm_array.join(' '));
				var attrs= elm_array.join(' ').match(new RegExp('[^="\n]+="[^"\n]*"(?!")', 'g'));
				//debug.info(attrs);
				if($scope.ambiente.productos.length > 0){
					attrs.push('fill="'+$scope.tipoAmbiente[$scope.ambiente.tipo].color+'"');
				}else{
					attrs.push('fill="#CCCCCC"');
				}
				//debug.info(tipo_elm);
				//debug.info(elm_array);

				var node = document.createElementNS('http://www.w3.org/2000/svg', tipo_elm);

				angular.forEach(attrs, function(value, key){
					if(value.length > 0){
						//debug.info(value);
						var array_item = value.split('=');
						var attr_name = array_item[0].replace(' ', '');
						var attr_value = array_item[1];
						//debug.info(array_item);
						if(typeof(attr_value) == 'undefined'){
							debug.info(array_item);
							debug.info($scope.ambiente.id);
						}
						attr_value = attr_value.replace(new RegExp('"', 'g'),'');//attrs[attribute];
						//debug.info(attr_name);
						//debug.info(attr_value);
						if (attr_value !== null && !value.match(/\$/) && (typeof attr_value !== 'string' || attr_value !== '')) {
							node.setAttribute(attr_name, attr_value);
						}
					}
				});
				var node_elm = angular.element(node);
				element.replaceWith(node_elm);
			}
		}

	  }
	});

app.directive('svgMain',function ($compile) {
	return {
		replace:true,
		controller: 'svgelementController',
		templateNamespace: 'svg',
		link: function ($scope, element, attrs) {
			$scope.$watch('fp_sel', function(){
				if($scope.fp_sel.svg != ''){
					//debug.info("borrar svg");
					var oldElm = angular.element( document.querySelector( '#fpbg' ) );
					oldElm.remove();
					element.append($scope.fp_sel.svg);
					//debug.info("appended");
					//$scope.iniAmbientes();
				}
			});
		}
	}
});
app.directive('fp', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/fp.html';

    return directive;
});

