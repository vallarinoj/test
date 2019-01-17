//CONTROLADOR DE CATEGOORIAS
app.controller('VerMensajeController', function($rootScope, $scope, $route, $compile, $routeParams, $location, ApiService, DBService,$q, $sce) {
	$scope.idMensaje = parseInt($routeParams.msgId);
	$scope.mensajeActual = '';
	$scope.productos= [];
	$scope.buscarMensaje = function(id){
		DBService.tabla['mensajes'].get(id,
			function(data){
				$scope.mensajeActual = $sce.trustAsHtml(data.mensaje);
				$scope.productos = data.productos;
				//debug.info(data);
				//debug.info($scope.mensajeActual);
				var leido = {};
				leido.id = id;
				leido.ts = ts();
				leido.actualizar = true;
				leido.user = localStorage.getItem('userid');
				//debug.info(leido);
				DBService.tabla['mensajes_leidos'].put(leido, function(){$rootScope.actualizar.mensajes = true;});
				data.leido = true;
				DBService.tabla['mensajes'].put(data);
				$scope.$digest();
			},
			function(){
				debug.info("ERROR");
			}
		);
	}
	$scope.verProducto = function(id){
		//debug.info(id);
		//debug.info("hola");
		$location.path('/producto/'+id);
		$rootScope.view_open_menu();
	}
	$scope.buscarMensaje($scope.idMensaje);

 });
 app.directive("itemProducto", function($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs) {
            scope.$watch('mensajeActual', function(html) {
                $compile(element.contents())(scope);
            });
        }
    };


});