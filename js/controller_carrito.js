// JavaScript Document
app.controller('carritoController', function($rootScope, $scope, $route, $routeParams, $location, DBService, $http, http_defaults, ApiService, $uibModal){
	$scope.alerts = [];
	$scope.taxVal = tax_val;
	$scope.idCarrito = parseInt($routeParams.idCarrito);
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	$scope.carrito = false;
	$scope.refreshCarrito = function(){
		//debug.info("refresh");
		DBService.carritos_recorrido().then(function(resultado){
			//debug.info(resultado);
			$scope.carritosRecorrido = resultado;
		});
		DBService.lineasCarrito($scope.idCarrito).then(function(data1){
			//debug.info(data1);
			$scope.carritoLineas = data1;
			$scope.calcularTotalCarrito();
			DBService.tabla['carrito'].get($scope.idCarrito, function(data){$scope.carrito = data;}, function(){debug.info("ERROR");$scope.carrito = false;})
		});
	}
	$scope.seleccionarCarritoLocal = function(id){
		DBService.seleccionarCarrito(id).then(function(){
			$scope.carrito = DBService.carritoActual;
			$scope.idCarrito = $scope.carrito.id;
			$scope.refreshCarrito();
		});
	}
	$scope.carritosRecorrido = [];
	$scope.mostrarGuardar = $scope.mostrarEmail = false;
	$scope.emailLoading = false;
	$scope.emailLoading2 = false;
	$scope.emailLoading3 = false;
	$scope.refreshCarrito();
	$scope.img_url = $rootScope.img_url;
	$scope.carritoLineas = [];
	$scope.subtotalCarrito = 0;
	$scope.taxCarrito = 0;
	$scope.totalCarrito = 0;
	$rootScope.view_open_menu();
	$scope.calcularTotalCarrito = function(){
		//debug.info("calcularTotal");
		$scope.subtotalCarrito = 0;
		angular.forEach($scope.carritoLineas, function(value, key) {
			//debug.info(value);
		 	$scope.subtotalCarrito += (value.cant * value.precio);
		});
		$scope.taxCarrito = $scope.subtotalCarrito * tax_val;
		$scope.totalCarrito = $scope.subtotalCarrito + $scope.taxCarrito;
	}
	$scope.masLinea = function(linea){
		//if(linea.producto.existencias_bodega.e > linea.cant){
			DBService.agregar_recorrido_click('pca', linea.producto.id);
			DBService.modLineaCarrito(linea.id, 1).then(function(data){
				$scope.refreshCarrito();
			});
		//}

	}
	$scope.nuevoCarrito = function (){
		DBService.otro_carrito().then(function(data){
			//$location.path( "/carrito/"+data );
			$rootScope.view_close_menu();
		});
	}
	$scope.menosLinea = function(linea){

		if(linea.cant > 1){
			DBService.modLineaCarrito(linea.id, -1).then(function(data){
				DBService.agregar_recorrido_click('pcq', linea.producto.id);
				$scope.refreshCarrito();
			});
		}else{
			//debug.info(linea);
			$scope.modalLinea = linea;
			//debug.info($scope.modalLinea);
			$scope.modalInstance = $uibModal.open({
			  templateUrl: 'templates/modalBorrar.html',
			  controller: 'modalCarritoController',
			  scope: $scope
			});

		}

	}
	$scope.facturar = function(){
		if($scope.carritoLineas.length > 0){
			$location.path('/crearOrden/'+$scope.idCarrito);
			$rootScope.view_open_menu();
		}
	}
	$scope.guardarCarrito = function(nombre){
		//debug.info(nombre);
		$scope.carrito.nombre = nombre;
		DBService.tabla['carrito'].put($scope.carrito, function(){
			$scope.mostrarGuardar = false;
		}, function(){
			debug.info("ERROR");
		});
	}
	$scope.enviarCarrito = function(email,email2,email3, comentarios){
		if($rootScope.online){
			var emails = [];
			var comments = comentarios;

			if(validEmail(email)){
				emails.push(email);
				$scope.emailLoading = true;
				DBService.agregar_recorrido_click('email', email);
			}
			if(validEmail(email2)){
				emails.push(email2);
				$scope.emailLoading2 = true;
				DBService.agregar_recorrido_click('email', email2);
			}
			if(validEmail(email3)){
				emails.push(email3);
				$scope.emailLoading3 = true;
				DBService.agregar_recorrido_click('email', email3);
			}
			if(comments != null){
				DBService.agregar_recorrido_click('email_comentarios', comments);
			}
			$scope.carritoEmail = null;
			$scope.carritoEmail2 = null;
			$scope.carritoEmail3 = null;
			$scope.carritoComentarios = null;
			if(emails.length > 0){
				var datos = $scope.carrito;
				datos.sucursal = $rootScope.globals.sucursalSel;
				datos.emails = emails;
				datos.lineas = $scope.carritoLineas;
				datos.comentarios = comments;

				//debug.info(datos);
				$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
				var url = api_url+'/carritoEmail';
				//$http.post(url, datos).then(function(response){debug.info(response)});
				$http.post(url, datos, http_defaults).success(function(response) {
					ApiService.updateCredentials(response, 0).then(function(data){
						if(data.data.resultado == ''){
							$scope.mostrarEmail = false;
							$scope.alerts.push({type:'success', msg: 'Se envió el correo'});

						}else{
							$scope.alerts.push({type:'danger', msg: data.data.resultado});
						}
						$scope.emailLoading = $scope.emailLoading2 = $scope.emailLoading3 = false;
					});
				}).error(function(response) { // optional
					debug.info(response);
					$scope.alerts.push({type:'danger', msg: 'Error no identificado'});
					$scope.emailLoading = false;
					$scope.emailLoading2 = false;
					$scope.emailLoading3 = false;
				});
			}else{
				$scope.alerts.push({type:'danger', msg: 'El email no es válido'});
			}
		}else{
			$scope.alerts.push({type:'danger', msg: 'Debe estar conectado a internet'});
		}
	}


});