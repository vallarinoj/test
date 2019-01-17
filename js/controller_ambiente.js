 /*PRODUCTOS*/
app.controller('ambienteController', function($rootScope,$scope, $route, $routeParams, $location, ApiService, DBService) {
	$scope.img_url = $rootScope.img_url;
	$scope.tipoAmbiente = $rootScope.tipoAmbiente;
	 $scope.ambiente = {};
	 //$scope.productos = [];
	 $rootScope.view_open_menu();
	 $scope.empresa = $rootScope.empresa;
	 $scope.ambienteId = parseInt($routeParams.ambId);



	 $scope.productosAmbiente = function(){
		var vars = {};
		vars.id = $scope.ambienteId;
		vars.page = 1;
		ApiService.getData('productos_ambiente', vars).then(function(data){
			//debug.info(data);
			$scope.ambiente = data[0];
			//debug.info($scope.ambiente);
		 	$scope.productos = data[0].productos;
		 	$rootScope.globals.inner_loader = false;
		});
	 }
	 $rootScope.globals.inner_loader = true;
	 $scope.productosAmbiente();

	 //DBService.tabla['ambientes'].get(, getItemSuccess, errorCallback);

	/*function getItemSuccess(data){
        $scope.ambiente = data;
		$scope.productos = [];
		angular.forEach($scope.ambiente.productos, function(value, key) {
			DBService.infoProducto(value).then(function(data){
				$scope.productos.push(data);
			});
		});
    };
	function errorCallback(data){
        debug.info("Error");
    };*/
	$scope.verProducto = function(producto){
		$location.path('/producto/'+producto);
	}
	$scope.esPrimeroFila = function(index){
		if(((index) % 6) == 0){
			return 'primero_fila';
		}else{
			return '';
		}
	}
 });