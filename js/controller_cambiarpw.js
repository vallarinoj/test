app.controller('cambiarPwController', function ($scope, $rootScope, $location, ApiService) {
		$scope.form_error = ''; 
		$scope.pw1 = $scope.pw2 = '';
		$scope.conError1 = $scope.conError2 = false;
		
 		$rootScope.view_open_menu();
        $scope.revisarPw = function(){
			$scope.form_error = ''; 
			$scope.conError1 = $scope.conError2 = false;
			if($scope.pw2.length > 3 && $scope.pw2 != $scope.pw1){
				$scope.conError2 = true;
				$scope.form_error = 'Las contraseñas no coinciden';
			}
			re = /[0-9]/;
			if(!re.test($scope.pw1)) {
				$scope.form_error = "La contraseña debe tener números (0-9)";
				$scope.conError1 = true;
			}
      		re = /[a-z]/;
		  	if(!re.test($scope.pw1)) {
				$scope.form_error = "La contraseña debe tener al menos una letra minúscula (a-z)";
				$scope.conError1 = true;
		  	}
      		re = /[A-Z]/;
      		if(!re.test($scope.pw1)) {
				$scope.form_error = "La contraseña debe tener al menos una letra mayúscula (A-Z)";
		        $scope.conError1 = true;
	      	}
			if($scope.pw1.length < 6){
				$scope.conError1 = true;
				$scope.form_error = 'La contraseña debe tener al menos 6 caracteres';
			}
			if($scope.pw1 == ''){
				$scope.conError1 = true;
				$scope.form_error = 'Debe escribir su contraseña';
			}
		}
		$scope.newPw = function (pw) {
			if($rootScope.online){         
				ApiService.CambiarPw(pw).then(function(data){
					if(data.success){
						$location.path('/');
						$rootScope.view_close_menu();
						$rootScope.globals.cambiarpw = false;
					}else{
						$scope.form_error = 'Error al actualizar la contraseña';
					}
	
				});
			}else{
				$scope.form_error = 'Debe estar conectado';
			}
        };
});