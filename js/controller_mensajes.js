app.controller('MensajesController', function($rootScope, $scope, $route, $routeParams, $location, ApiService, DBService,$q) {
	$scope.mensajes = [];
	$scope.cont = 0;
	$scope.getMensajes = function(){
		DBService.tabla['mensajes'].getAll(
			function(todos_mensajes){
				/*DBService.tabla['mensajes_leidos'].getAll(
					function(mensajes_leidos){*/
						var cont = 0;
						var ts1 = ts();
						angular.forEach(todos_mensajes, function(value, key) {
							//debug.info(value);
							if(value.borrar < ts1){
								DBService.tabla['mensajes'].remove(value.id);
							}else{
								$scope.mensajes.push(value);
							}
							//debug.info(mensajes_leidos);
						});
					//}
				//);
				$rootScope.globals.inner_loader = false;
			}
		);
	}
	$scope.getMensajes();
	$scope.verMensaje = function(id){
		if(id != null){
			$location.path('/verMensaje/'+id);
			$rootScope.view_open_menu();
		}
	}

 });