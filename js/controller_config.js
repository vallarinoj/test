app.controller('configController', function($rootScope, $scope, $route, $routeParams, $location, DBService, ApiService){
	$scope.borrarDb = function(){
		DBService.borrarDB().then(function(){
			$scope.alerts.push({type:'success', msg: 'Se borró la base de datos completa'});
			ApiService.Logout();
		});
	}
	/*$scope.cambiarPw = function(){
		$location.path('/cambiarPw');
		$rootScope.view_open_menu();
		$rootScope.cerrar_menu_iz();
		$rootScope.cerrar_menu_der();
	}*/
	$rootScope.view_open_menu();
	$scope.alerts = [];
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

});