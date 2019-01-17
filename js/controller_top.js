//CONTROLLER TOP
app.controller('topController', function($scope, $rootScope, $location, ApiService,  DBService, $window, $uibModal, $interval){
	//$scope.nombreUser = $rootScope.nombreUser;
	//debug.info($scope.nombreUser);
	//debug.info($rootScope.nombreUser);
	$scope.msgCount = 0;//$rootScope.globals.msgCount;
	$scope.autoVistaMensajes = 0;
	$scope.online_icon_class = "glyphicon-ok-sign";
	$scope.online_color_class = "btn-success";
	$rootScope.$watch('online', function(){
		if($rootScope.online){
			$scope.online_icon_class = "glyphicon-ok-sign";
			$scope.online_color_class = "btn-success";
		}else{
			$scope.online_icon_class = "glyphicon-exclamation-sign";
			$scope.online_color_class = "btn-warning";
		}
	});
	$rootScope.$watch('recorridoActual', function(){
		if($rootScope.recorridoActual == false){
			$scope.recorridoText = 'Iniciar';
			$scope.recorridoClass = 'btn-success';
			$scope.recorridoBtnClass = 'glyphicon-play';
		}else{
			$scope.recorridoText = 'Finalizar';
			$scope.recorridoClass = 'btn-warning';
			$scope.recorridoBtnClass = 'glyphicon-stop';
		}
	});
	$scope.toggleRecorrido = function(){
		DBService.toggleRecorrido();
	};
	$scope.actualizarMensajes = function(){
		//debug.info("actualizarMensajes");

		DBService.tabla['mensajes'].getAll(
			function(todos_mensajes){
				var cont = 0;
				var ts1 = ts();
				angular.forEach(todos_mensajes, function(value, key) {
					if(value.borrar < ts1){
						DBService.tabla['mensajes'].remove(value.id);
					}else{
						if(!value.leido){
							cont++;
						}
					}
				});
				$scope.msgCount = cont;
				//Si hay mensajes nuevos y ya paso suficiente tiempo (20 mins) y no esta en un recorrido se abre automáticamente
				if(cont > 0 && $rootScope.recorridoActual == false && (ts() - (20*60)) > $scope.autoVistaMensajes){
					$location.path('/verMensajes/');
					$rootScope.view_open_menu();
					$scope.autoVistaMensajes = ts();
				}
				//debug.info($scope.msgCount);
			}
		);
	}
	var segundos_timer = 30;
	if($rootScope.test){
		segundos_timer = 3;
	}
	$scope.timerUpdate = $interval(
		function(){
			$scope.timerFunc();
		}
	, (1000 *segundos_timer));
	$scope.timerFunc = function(){
		if($rootScope.globals.db){
			//debug.info('MENSAJES');
			ApiService.putDatos().then(function(){
				ApiService.getData('mensajes',{}, true).then(function(){
					$scope.actualizarMensajes();
				});
			});
		}
	}

	$scope.mins = 0;//$rootScope.mins;
	$scope.segs2 = 0;//$rootScope.segs;
	$scope.segsShow = 0;
	$scope.zeroPad = function(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}
	$rootScope.$watch('segs', function(){
		$scope.mins = $rootScope.mins;
		$scope.segsShow = $scope.zeroPad(($rootScope.segs%60),2);
	});

	$scope.logout = function(){
		ApiService.Logout();
	}
	$scope.config = function(){
		$location.path('/config');
		$rootScope.view_open_menu();
	}
	//$scope.update = function(){
		/*$rootScope.globals.loading = true;
		ApiService.inicializar_datos(true).then(function(){
			$rootScope.globals.loading = false;
		});*/
		//debug.info("update manual quitado");
		/*$rootScope.globals.loading = true;
		ApiService.actualizar_datos()
		.then(function(){
			$rootScope.globals.loading = false;
		});
		//debug.info("falta inicializar_datos");
		//ApiService.putDatos();
	}*/
	$scope.carrito = function(){
		DBService.carrito_actual().then(function(data){
			$location.path('/carrito/'+data.id);
			$rootScope.view_open_menu();
		});
	}
	$scope.verEncuesta = function(){
		//debug.info($rootScope.recorridoActual);
		//if($rootScope.recorridoActual != false){
			$rootScope.globals.menuClienteTab = 1;
			$rootScope.abrir_menu_der();
		//}
	}
	$scope.verCotizaciones = function(){
		$location.path('/verCotizaciones/');
		$rootScope.view_open_menu();
	}
	$scope.goBack = function() {
    	$window.history.back();
		//debug.info($window.history);
    };
	$scope.goForward = function() {
    	$window.history.forward();
    };
	$scope.mensajes = function(){
		//if($scope.msgCount > 0){
			$location.path('/verMensajes/');
			$rootScope.view_open_menu();
		//}
	}
	/*$rootScope.$watch('actualizar.mensajes', function(){
		if($rootScope.actualizar.mensajes){
			debug.info("Actualizar Mensajes");
			$scope.actualizarMensajes();
		}

	});*/



});
app.directive('eltop', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/top.html';

    return directive;
});