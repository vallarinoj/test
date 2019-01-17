app.controller('olvidoPwController', function ($scope, $rootScope, $location, ApiService) {
		$scope.form_error = ''; 
		$scope.email = '';
		$scope.success = false;
 		$rootScope.view_open_menu();
		$scope.newPw = function (pw) {
			if($rootScope.online){         
				ApiService.olvidoPw(email).then(function(data){
					if(data.success){
						//$location.path('/login');
						$scope.success = true;
					}else{
						$scope.form_error = 'Error al solicitar el cambio de contraseña';
					}
	
				});
			}else{
				$scope.form_error = 'Debe estar conectado';
			}
        };
});