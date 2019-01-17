// JavaScript Document
app.controller('verCotizacionesController', function($rootScope, $scope, $route, $routeParams, $location, DBService, ApiService, $q, $http){
	$scope.cotizaciones = [];
	$rootScope.view_open_menu();
	$scope.cant_paginas = 1;
	$scope.pagina_actual = 1;
	$scope.mensajeError = 'No hay cotizaciones para mostrar'
	$scope.alerts = [];
	$scope.filtro = {};
	if($rootScope.cotFiltros == null){
		$rootScope.cotFiltros = [];
	}else{
		if($rootScope.cotFiltros['cliente'] != null){
			$scope.filtro.cliente = $rootScope.cotFiltros['cliente'];
		}
		if($rootScope.cotFiltros['email'] != null){
			$scope.filtro.email = $rootScope.cotFiltros['email'];
		}
		if($rootScope.cotFiltros['fecha'] != null){
			$scope.filtro.fecha = $rootScope.cotFiltros['fecha_inp'];
		}
		if($rootScope.cotFiltros['nombre'] != null){
			$scope.filtro.nombre = $rootScope.cotFiltros['nombre'];
		}

	}
	//
	$scope.cotLoading = false;
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	$scope.$watch('pagina_actual', function(){
		//$scope.filtros = [];
		$rootScope.cotFiltros['p'] = $scope.pagina_actual;
		$scope.query_api();
	});
	$scope.query_api = function(){
		if($rootScope.online){
			$scope.mensajeError = 'No hay cotizaciones para mostrar'
			var def = $q.defer();
			var url = api_url+'/buscarCotizaciones';
			//$scope.cotLoading = true;
			//debug.info($scope.filtros);
			$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
			//$rootScope.globals.loading = true;
			$rootScope.globals.inner_loader = true;
			$http.post(url, $rootScope.cotFiltros).success(function(response) {
				ApiService.updateCredentials(response, 0).then(function(data){
					$scope.cant_paginas = data.data.cotizaciones.cant_paginas;
					$scope.pagina_actual = data.data.cotizaciones.pagina;
					$scope.cotizaciones = data.data.cotizaciones.lista;
					$rootScope.globals.inner_loader = false;
					//$scope.cotLoading = false;
					def.resolve(true);
				});
			}).error(function(response) { // optional
				debug.info(response);
				$rootScope.globals.msgConn.push({type:'danger', msg: "Error de Búsqueda de cotizaciones"});
				$scope.mensajeError = 'Error de conexion';
				$scope.cotLoading = false;
				 def.resolve(false);
			});
		}else{
			$scope.alerts.push({type:'danger', msg: 'Debe estar conectado a internet'});
		}
	}
	$scope.verCotizacion = function(cotizacion){
		//debug.info(cotizacion);
		//debug.info($scope.filtros);
		$location.path('/verCotizacion/'+cotizacion);
		$rootScope.view_open_menu();
	}
	$scope.limpiar_filtros = function(){
		//debug.info("hola");
		$scope.filtro.cliente = null;
		$scope.filtro.nombre = null;
		$scope.filtro.fecha = null;
		$scope.filtro.email = null;
		//debug.info($scope.filtro);
		$scope.busqueda();
	}
	$scope.busqueda = function(){
		//debug.info($scope.filtro);
		if($scope.filtro.cliente != null && $scope.filtro.cliente != ''){
			$rootScope.cotFiltros['cliente'] = $scope.filtro.cliente;
		}else{
			$rootScope.cotFiltros['cliente'] = null;
		}
		if($scope.filtro.nombre != null && $scope.filtro.nombre != ''){
			$rootScope.cotFiltros['nombre'] = $scope.filtro.nombre;
		}else{
			$rootScope.cotFiltros['nombre'] = null;
		}
		if($scope.filtro.email != null && $scope.filtro.email != ''){
			$rootScope.cotFiltros['email'] = $scope.filtro.email;
		}else{
			$rootScope.cotFiltros['email'] = null;
		}
		if($scope.filtro.fecha != null && $scope.filtro.fecha != ''){
			$rootScope.cotFiltros['fecha_inp'] = $scope.filtro.fecha;
			$rootScope.cotFiltros['fecha'] = formatfecha($scope.filtro.fecha);

		}else{
			$rootScope.cotFiltros['fecha'] = null;
		}
		$rootScope.cotFiltros['p'] = 1;
		$scope.query_api();
	}
});
