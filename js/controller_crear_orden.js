// JavaScript Document
app.controller('crearOrdenController', function($rootScope, $scope, $route, $routeParams, $location, DBService, ApiService, $q, $http, http_defaults){
	$scope.cliente = '';
	$scope.clienteSel = {};
	$scope.clienteSel.id = 0;
	$scope.webCliente = {};
	$scope.webCliente.id = 0;
	$scope.idCarrito = parseInt($routeParams.idCarrito);
	$scope.carrito = {};
	$rootScope.view_open_menu();

	$scope.clientesBuscados = [];
	$scope.busquedaHecha = false;
	$scope.carritoLineas = [];
	$scope.alerts = [];
	$scope.ordenWeb = 0;
	$scope.crearCliente = false;
	$scope.web = {};
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	$scope.buscarCliente = function(searchTerm){
		var def = $q.defer();
		var respuesta = {};
		var datos = { query: searchTerm };
		var url = api_url+'/clienteBuscar';
		$rootScope.globals.inner_loader = true;
		$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
		$http.post(url, datos, http_defaults).success(function(response) {
			ApiService.updateCredentials(response, 0).then(function(data){
				$rootScope.globals.inner_loader = false;
				def.resolve(data.data.cliente);
			});
		}).error(function(response) { // optional
			$rootScope.globals.msgConn.push({type:'danger', msg: "Error al buscar cliente"});
			 def.resolve(false);
		});
		return def.promise;
	}
	$scope.buquedaCliente = function(searchTerm){
		//debug.info(searchTerm);
		if($rootScope.online){
			if(searchTerm != '' && searchTerm.length >= 3){
				$scope.buscarCliente(searchTerm).then(function(data){
					$scope.clientesBuscados = data;
					$scope.busquedaHecha = true;
					DBService.lineasCarrito($scope.idCarrito).then(function(data1){
						$scope.carritoLineas = data1;
						$scope.calcularTotalCarrito();
					});
				});
			}else{
				$scope.alerts.push({type:'warning', msg: 'Debe escribir al menos 3 caracteres'});
			}
		}else{
			$scope.alerts.push({type:'danger', msg: 'Debe estar conectado a internet'});
		}
	}
	$scope.selCliente = function(cliente){
		$scope.clienteSel = cliente;
	}
	$scope.totalCarrito = 0;
	$scope.calcularTotalCarrito = function(){
		$scope.totalCarrito = 0;
		angular.forEach($scope.carritoLineas, function(value, key) {
		 	$scope.totalCarrito += (value.cant * value.precio);
		});
	}
	$scope.proceder = function(){
		if($rootScope.online){
			$rootScope.globals.inner_loader = true;
			$scope.procederSave().then(function(data){
				$scope.ordenWeb = data;
				$rootScope.globals.inner_loader = false;
				DBService.carritoActual = false;
			});
		}else{
			$scope.alerts.push({type:'danger', msg: 'Debe estar conectado a internet'});
		}
	}
	$scope.procederSave = function(){
		var def = $q.defer();
		var respuesta = {};
		var datos = {clienteId:$scope.clienteSel.id, lineas:$scope.carritoLineas};
		var url = api_url+'/guardarOrden';
		//var url = api_url+'/12345/guardarOrden/'+localStorage.getItem('empresa');
		//debug.info(datos);
		$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
		$http.post(url, datos, http_defaults).success(function(response) {
			//debug.info(response);
			ApiService.updateCredentials(response, 0).then(function(data){
				DBService.tabla['carrito'].get($scope.idCarrito, function(data2){
					data2.id_biz = data.data.orden;
					data2.status = 3;
					//debug.info(data2);
					DBService.tabla['carrito'].put(data2, function(){
						def.resolve(data2.id_biz);
					});
				});
			});
		}).error(function(response) { // optional
			$rootScope.globals.msgConn.push({type:'danger', msg: "Error al guardar orden"});
			debug.info(response);
			//ApiService.Logout();
			def.resolve(false);
		});
		return def.promise;
	}
	$scope.clienteNuevo = function(){
		$scope.crearCliente = true;
	}
	$scope.submitCrearCliente = function(){
		$scope.submitCrearClienteDo().then(function(data){
			if(data){
				$scope.crearCliente = false;
				$scope.clienteSel = data;
			}
		});
	}
	$scope.submitCrearClienteDo = function(){
		var def = $q.defer();
		var datos = {};
		datos.sucursal = $rootScope.globals.sucursalSel;
		if(!angular.isUndefined($scope.web.Nombre)){
			datos.Nombre = $scope.web.Nombre;
		}else{
			datos.Nombre = '';
		}
		if(!angular.isUndefined($scope.web.Cedula)){
			datos.Cedula = $scope.web.Cedula;
		}else{
			datos.Cedula = '';
		}
		if(!angular.isUndefined($scope.web.Direccion1)){
			datos.Direccion1 = $scope.web.Direccion1;
		}else{
			datos.Direccion1 = '';
		}
		/*if(!angular.isUndefined($scope.web.Direccion2)){
			datos.Direccion2 = $scope.web.Direccion2;
		}else{
			datos.Direccion2 = '';
		}
		if(!angular.isUndefined($scope.web.Direccion3)){
			datos.Direccion3 = $scope.web.Direccion3;
		}else{
			datos.Direccion3 = '';
		}*/
		if(!angular.isUndefined($scope.web.Email)){
			datos.Email = $scope.web.Email;
		}else{
			datos.Email = '';
		}
		if(!angular.isUndefined($scope.web.Contacto)){
			datos.Contacto = $scope.web.Contacto;
		}else{
			datos.Contacto = '';
		}
		/*if(!angular.isUndefined($scope.web.FechaCumple)){
			datos.FechaCumple = formatfecha($scope.web.FechaCumple);
		}else{
			datos.FechaCumple = '';
		}*/
		if(!angular.isUndefined($scope.web.Telefono)){
			datos.Telefono = $scope.web.Telefono;
		}else{
			datos.Telefono = '';
		}
		/*if(!angular.isUndefined($scope.web.Fax)){
			datos.Fax = $scope.web.Fax;
		}else{
			datos.Fax = '';
		}
		datos.sucursal = $rootScope.sucursalSel;*/
		$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
		var url = api_url+'/crearCliente';
		//debug.info(datos);
		$http.post(url, datos, http_defaults).success(function(response) {
				ApiService.updateCredentials(response, 0).then(function(data){
					datos = data.data.cliente;
					//debug.info(datos);
					if(angular.isUndefined(datos.error)){
						//debug.info("no error");
						def.resolve(datos[0]);
					}else{
						//debug.info("ERROR");
						$rootScope.globals.msgConn.push({type:'danger', msg: datos.error});
						def.resolve(false);
					}
				});


		}).error(function(response) { // optional
			//ApiService.Logout();
			$rootScope.globals.msgConn.push({type:'danger', msg: "Error al crear Cliente"});
			def.resolve(false);
		});
		return def.promise;
	}
});
