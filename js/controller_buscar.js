//CONTROLADOR DE CATEGOORIAS
app.controller('buscarController', function($rootScope, $scope, $route, $routeParams, $location, ApiService, DBService,$q, $http, http_defaults) {
	$scope.img_url = $rootScope.img_url;
	$scope.searchTerm = $routeParams.searchTerm;
	$rootScope.view_open_menu();
	$scope.productos = [];
	$scope.cantidad = 0;
	$scope.verProducto = function(producto){
		$location.path('/producto/'+producto);
	}
	$scope.buscarProducto = function(searchTerm){
		var def = $q.defer();
		var respuesta = {};
		var datos = { query: searchTerm };
		var url = api_url+'/productosBuscar';
		$rootScope.globals.inner_loader = true;
		$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
		$http.post(url, datos, http_defaults).success(function(response) {
			ApiService.updateCredentials(response, 0).then(function(data){
				def.resolve(data.data.bproductos);
			});
		}).error(function(response) { // optional
			$rootScope.globals.msgConn.push({type:'danger', msg: "Error al buscar cliente"});
			 def.resolve(false);
		});
		return def.promise;
	}
	$scope.esPrimeroFila = function(index){
		if(((index) % 6) == 0){
			return 'primero_fila';
		}else{
			return '';
		}
	}
	$scope.iniBuscar = function(){
		$scope.buscarProducto($scope.searchTerm).then(function(data){
			$scope.productos = data;
			$scope.cantidad = $scope.productos.length;
			$rootScope.globals.inner_loader = false;
		});
	}
	$scope.iniBuscar();
 });