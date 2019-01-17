//CONTROLADOR DE CATEGOORIAS
app.controller('modalCarritoController', function($rootScope, $scope, DBService, $uibModalInstance) {
	$scope.borrarProductoOk = function(){
		DBService.agregar_recorrido_click('pcq', $scope.modalLinea.producto.id);
		DBService.modLineaCarrito($scope.modalLinea.id, -1).then(function(data){
			$scope.refreshCarrito();
		});
		$uibModalInstance.dismiss('ok');
	}
	$scope.borrarProductoCancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
 });