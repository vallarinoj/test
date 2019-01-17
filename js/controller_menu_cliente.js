app.controller('MenuClienteController', function($rootScope, $scope, $route, $routeParams, $location, ApiService,DBService) {
	$rootScope.cliente = {};
	$scope.isCollapsed = false;
	$scope.menu_class = 'right_slide_no_visible';
	$scope.trigger_class = 'glyphicon-chevron-left';
	$scope.encuestasPreguntas = {};
	$scope.encuestasRespuestas ={};
	$scope.encuestaActiva = false;
	//$scope.activeTab = 1;
	 //getItems();


	$scope.guardarClienteLocal = function(cliente){
		DBService.guardarCliente(cliente);
	}
	$rootScope.toggle_menu_der = function(){
		if($scope.menu_class == 'right_slide_no_visible'){
			$scope.menu_class = 'right_slide_visible'
			$scope.trigger_class = 'glyphicon-chevron-right';
		}else{
			$scope.menu_class = 'right_slide_no_visible'
			$scope.trigger_class = 'glyphicon-chevron-left';
		}
	}
	$rootScope.abrir_menu_der = function(){
		$scope.menu_class = 'right_slide_visible'
		$scope.trigger_class = 'glyphicon-chevron-right';
	}
	$rootScope.cerrar_menu_der = function(){
		$scope.menu_class = 'right_slide_no_visible'
		$scope.trigger_class = 'glyphicon-chevron-left';
		//$scope.$apply();
	}
	$scope.limpiar = function(){
		$scope.cliente = {};
		$rootScope.cliente = {};
	}
	$rootScope.$watch('globals.logueado', function(newValue, oldValue) {
		if(newValue){
			$scope.actualizarEncuestas();
		}

	});
	$rootScope.$watch('recorridoActual', function(){
		if($rootScope.recorridoActual){
			$scope.encuestaActiva = true;
		}else{
			$scope.encuestaActiva = false;
		}

	});
	$rootScope.$watch('globals.hizoEncuesta', function(){
		//debug.info("hizo encuesta cambio"+$rootScope.globals.hizoEncuesta);
		if(!$rootScope.globals.hizoEncuesta){
			//debug.info("no hizo encuesta");
			$scope.encuestasRespuestas = {};
		}

	});
	$scope.actualizarEncuestas = function(){
		/*DBService.tabla['encuestas'].getAll(
			function(preguntas){
				$scope.encuestasPreguntas = preguntas;
				$rootScope.actualizar.encuestas = false;
			}
		);*/
		ApiService.getData('encuestas').then(function(data){
			//debug.info(data);
			$scope.encuestasPreguntas = data;
		});
	}
	$scope.guardarEncuesta = function(){
		angular.forEach($scope.encuestasRespuestas, function(value, key) {
		  DBService.guardarRespuestaEncuesta(key,value);
		  $rootScope.globals.hizoEncuesta = true;
		  $rootScope.cerrar_menu_der();
		});
	}
 });
app.directive('menuCliente', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/menuCliente.html';

    return directive;
});