 /*PRODUCTOS*/
app.controller('ProdController', function($scope, $route, $routeParams, $location, ApiService, DBService, $sce, $rootScope, $q) {
	 $scope.producto = {};
	 $scope.producto.Prelacionados = [];
	 $scope.producto.Phermanos = [];
	 $scope.existencias = {};
	 $scope.img_url = img_url;
	 $scope.ini = function(){
	 	//DBService.tabla['productos'].get(parseInt($routeParams.prodId), getItemSuccess, function(){debug.info("ERROR");});
	 	$rootScope.globals.inner_loader = true;
	 	$scope.getProducto(parseInt($routeParams.prodId));
	 }
	$rootScope.view_open_menu();
	$scope.empresa = $rootScope.empresa;
	function getItemSuccess(data){
		$scope.inicializar_producto(data).then(function(){
			/*$scope.productos_hermanos().then(function(){
			});
			$scope.productos_relacionados().then(function(){
			});/**/
		});
	}
	$scope.inicializar_producto = function(data){
		var def = $q.defer();
        $scope.producto = data;
		if($rootScope.recorridoActual != false){
			DBService.agregar_recorrido_click('producto', data.id);
		}
		$rootScope.globals.inner_loader = false;
		def.resolve(true);
		return def.promise;

    };
	$scope.productos_hermanos = function(){
		var def = $q.defer();
		$scope.producto.Phermanos = [];
		var cont = 0;
		angular.forEach($scope.producto.hermanos, function(value, key) {
			DBService.tabla['productos'].get(parseInt(value),
				function(data1){
					$scope.producto.Phermanos.push(data1);
					cont++;
					if(cont == $scope.producto.hermanos.length){
						def.resolve(true);
					}
				},
				function(){
					debug.info("ERROR");
				}
			);
		});
		return def.promise;
	}
	$scope.productos_relacionados = function(){
		var def = $q.defer();
		$scope.producto.Prelacionados = [];
		var cont = 0;
		angular.forEach($scope.producto.relacionados, function(value, key) {
			DBService.tabla['productos'].get(parseInt(value),
				function(data1){
					$scope.producto.Prelacionados.push(data1);
					cont++;
					if(cont == $scope.producto.relacionados.length){
						def.resolve(true);
					}
				},
				function(){
					debug.info("ERROR");
				}
			);
		});
		return def.promise;
	}
	$scope.getProducto = function(id){
		var vars = {};
		vars.id = id;
		ApiService.getData('producto', vars).then(function(data){
			if(data.error != null){
				$rootScope.globals.msgConn.push({type:'danger', msg: data.error});
				$rootScope.globals.inner_loader = false;
			}else{
				$scope.producto = data[0];
				$rootScope.globals.inner_loader = false;
				//debug.info(data);
				if($rootScope.recorridoActual != false){
					DBService.agregar_recorrido_click('producto', $scope.producto.id);
				}
			}
		});
	}
	$scope.verProducto = function(producto){
		$location.path('/producto/'+producto);
	}
	$scope.add_carrito = function(prod){
		//if($scope.existencias.e > 0){
			ApiService.agregar_carrito(prod).then(function(data){
				//debug.info(data);
				if($rootScope.recorridoActual != false){
					DBService.agregar_recorrido_click('pca', prod.id);
				}
				if(data){
					$scope.alerts.push({type:'success', msg: 'Se agregó correctamente'});
				}else{
					$scope.alerts.push({type:'danger', msg: 'No se pudo agregar el producto'});
				}

			});
		//}
	}
	$scope.alerts = [];
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	//Al final para haber cargado las funciones
	$scope.ini();
 });