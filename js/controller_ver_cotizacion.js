// JavaScript Document
app.controller('verCotizacionController', function($rootScope, $scope, $route, $routeParams, $location, DBService, ApiService, $q, $http, http_defaults){
	$scope.cotizacion = {};
	$rootScope.view_open_menu();
	$scope.id_cotizacion = $routeParams.id;
	$scope.alerts = [];
	$scope.emailLoading = false;
	$scope.emailLoading2 = false;
	$scope.emailLoading3 = false;
	$scope.mostrarEmail = false;
	$scope.cotLoading = false;
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.query_api = function(){
		if($rootScope.online){
			var def = $q.defer();
			$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
			var url = api_url+'/buscarCotizacion/'+$scope.id_cotizacion;
			$scope.cotLoading = true;
			$http.get(url, http_defaults).success(function(response) {
				ApiService.updateCredentials(response, 0).then(function(data){
					var lineas_proc = [];
					angular.forEach(data.data.cotizacion.lineas,function(value, key) {
						//DBService.infoProducto(value.id_producto).then(function(prod){
							var line = value;
							//line.producto = prod;
							lineas_proc.push(value);
						//});
					});
					data.data.cotizacion.lineas = lineas_proc;
					$scope.cotizacion = data.data.cotizacion;
					//debug.info(data.data.cotizacion);
					$scope.cotLoading = false;
					def.resolve(true);
				});
			}).error(function(response) { // optional
				//debug.info(response);
				$rootScope.globals.msgConn.push({type:'danger', msg: "Error al buscar cotización"});
				$scope.cotLoading = false;
				 def.resolve(false);
			});
		}else{
			$scope.alerts.push({type:'danger', msg: 'Debe estar conectado a internet'});
		}
	}
	$scope.info_producto = function(id_prod){
		DBService.infoProducto(id_prod).then(function(prod){
			//console.log(prod);
			return prod.nombre;
		});
	}
	$scope.enviarCarrito = function(email,email2,email3, comentarios){
		if($rootScope.online){
			var emails = [];
			var comments = comentarios;
			if(validEmail(email)){
				emails.push(email);
				$scope.emailLoading = true;
			}
			if(validEmail(email2)){
				emails.push(email2);
				$scope.emailLoading2 = true;
			}
			if(validEmail(email3)){
				emails.push(email3);
				$scope.emailLoading3 = true;
			}
			$scope.carritoEmail = null;
			$scope.carritoEmail2 = null;
			$scope.carritoEmail3 = null;
			$scope.carritoComentarios = null;
			if(emails.length > 0){
				var datos = {};
				datos.sucursal = $rootScope.globals.sucursalSel;
				datos.emails = emails;
				datos.lineas = $scope.cotizacion.lineas;
				datos.comentarios = comments;
				debug.info(datos);
				$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
				var url = api_url+'/carritoEmail';
				//var url = api_url+'/'+localStorage.getItem('token')+'/carritoEmail/'+localStorage.getItem('empresa');
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
					//debug.info(response);
					$rootScope.globals.msgConn.push({type:'danger', msg: "Error al enviar cotización por correo"});
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
	$scope.query_api();
	$scope.copiarACarrito = function(){
		DBService.iniciarRecorrido().then(function(){
			var cot = {};
			cot.actualizar = false;
			cot.idRecorrido = $rootScope.recorridoActual;
			cot.id_user = parseInt(localStorage.getItem('userid'));
			if($scope.cotizacion.nombre != null){
				cot.nombre = $scope.cotizacion.nombre;
			}
			cot.status = 1;
			//debug.info($scope.cotizacion.cliente);
			DBService.guardarCliente($scope.cotizacion.cliente);
			DBService.tabla['carrito'].put(cot, function(nuevoId){
				cot.id = nuevoId;
				var lineas =[];
				var cant_lineas = $scope.cotizacion.lineas.length;
				var cont_lineas = 0;
				angular.forEach($scope.cotizacion.lineas,function(linea, key) {
					var linea_nueva = {};
					linea_nueva.id_carrito = nuevoId;
					linea_nueva.cant = linea.cant;
					linea_nueva.id_producto = linea.id_producto;
					linea_nueva.id_user = parseInt(localStorage.getItem('userid'));
					linea_nueva.precio = linea.precio;
					DBService.tabla['carrito_lineas'].put(linea_nueva, function(nuevoIdLinea){
						cont_lineas++;
						if(cont_lineas >= cant_lineas){
							//debug.info("cambiar carrito actual y redirigir a la pagina del carrito");
							DBService.seleccionarCarrito(nuevoId);
							$location.path('/carrito/'+nuevoId);
							$rootScope.view_open_menu();

						}
					});

				});
			});
		});


		//var lineas = cot.lineas;

	}
});
