//CONTROLADOR DE CATEGOORIAS
app.controller('CatController', function($rootScope, $scope, $route, $routeParams, $location, ApiService, DBService,$q) {
	$scope.img_url = $rootScope.img_url;
	$scope.catId = parseInt($routeParams.catId);
	$scope.page = 1;
	$scope.cant_paginas = 1;
	//DBService.tabla['categorias'].get($scope.catId, getCatName);
	$rootScope.view_open_menu();
	$scope.empresa = $rootScope.empresa;
	$scope.productos = [];
	$rootScope.globals.inner_loader = true;
	$scope.inner_loader_ref = $rootScope.globals.inner_loader;
	$scope.getCatName = function(data){
		$scope.catName = data.nombre;
	}
	$scope.$watch('page', function(){
		//$scope.filtros = [];
		if($scope.page >= 1){
			$scope.productosCat();
		}
	});
	$scope.productosCat = function(){
		var vars = {};
		vars.id = $scope.catId;
		vars.page = $scope.page;
		$rootScope.globals.inner_loader = true;
		ApiService.getData('productos_cat',vars).then(function(data){
			//debug.info('productos_cat');
			//debug.info(data);
			$scope.cant_paginas = data.cant_paginas;
			$scope.page = data.pagina;
			$scope.productos = data.productos;
			$rootScope.globals.inner_loader = false;
		});
	}
	$scope.productosCat();
	$scope.getCat = function(){
		var vars = {};
		vars.id = $scope.catId;
		ApiService.getData('categoria',vars).then(function(data){
			$scope.getCatName(data[0]);
		});
	}
	$scope.getCat();
	$scope.verProducto = function(producto){
		$location.path('/producto/'+producto);
		$rootScope.view_open_menu();
	}
	$scope.esPrimeroFila = function(index){
		if(((index) % 6) == 0){
			return 'primero_fila';
		}else{
			return '';
		}
	}
 });