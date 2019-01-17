//CONTROLADOR DE CATEGOORIAS
app.controller('modalRecorridoController', function($rootScope, $scope, DBService, $uibModalInstance) {
	$scope.finalizarRecorridoOk = function(){
		DBService.finalizarRecorridoOk();
		$uibModalInstance.dismiss('ok');
	}
	$scope.finalizarRecorridoCancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
 });