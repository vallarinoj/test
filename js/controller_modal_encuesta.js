//CONTROLADOR DE CATEGOORIAS
app.controller('modalRecorridoEncuestaController', function($rootScope, $scope, DBService, $uibModalInstance) {
	$scope.finalizarRecorridoOk = function(){
		DBService.finalizarRecorridoOk();
		$uibModalInstance.dismiss('ok');
	}
	$scope.finalizarRecorridoEncuesta = function(){
		$rootScope.globals.menuClienteTab = 1;
		$rootScope.abrir_menu_der();
		$uibModalInstance.dismiss('cancel');
	}
 });