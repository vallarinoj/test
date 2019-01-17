app.controller('LoginController', function ($scope, $rootScope, $location, ApiService) {
        // reset login status
        ClearCredentials();
		$scope.login_error = '';
 		$rootScope.view_open_menu();
 		$rootScope.globals.inner_loader = false;
        $scope.login = function ($credentials) {
        	$scope.login_error = '';
        	if($credentials.email != '' && $credentials.password != ''){
	        	$rootScope.globals.inner_loader = true;
	            ApiService.Login($credentials.email, $credentials.password).then(function(data){
	            	$rootScope.globals.inner_loader = false;
					if(data.success){
						$rootScope.view_close_menu();
						$rootScope.globals.logueado = true;
						$location.path('/');
					}else{
						$rootScope.view_open_menu();
						$scope.login_error = data.mensaje;
						$location.path('/login');
					}

				});
	        }
        };
		$scope.fogot_pw = function(){
			$location.path('/olvido_pw');
		}
		function ClearCredentials(){
			$scope.login_error = '';
			$scope.credentials = {email: '', password : ''};
		}
});