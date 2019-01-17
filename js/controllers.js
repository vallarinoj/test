// JavaScript Document
app.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 //$scope.hola = "HELLO MY FRIEND";
 });

//CONTROLLER TOP
app.controller('topController', function($scope, $rootScope, $location, ApiService, $interval){
	$scope.online_icon_class = "glyphicon-ok-sign";
	$scope.online_color_class = "btn-success";
	$rootScope.$watch('online', function(){
		if($rootScope.online){
			$scope.online_icon_class = "glyphicon-ok-sign";
			$scope.online_color_class = "btn-success";
		}else{
			$scope.online_icon_class = "glyphicon-exclamation-sign";
			$scope.online_color_class = "btn-warning";
		}
	});
	$rootScope.recorridoActual = false;
	$scope.toggleRecorrido = function(){
		//debug.info("toggleRecorrido");
		if($rootScope.recorridoActual){
			$rootScope.recorridoActual = false;
			$scope.recorridoText = 'Iniciar Recorrido';
			$scope.recorridoClass = 'btn-success';
			$scope.recorridoBtnClass = 'glyphicon-play';
			$interval.cancel($scope.timer);
			$scope.mins = $scope.segs = 0;

		}else{
			//iniciamos un recorrido
			$rootScope.recorridoActual = 1;
			$scope.recorridoText = 'Finalizar Recorrido';
			$scope.recorridoClass = 'btn-warning';
			$scope.recorridoBtnClass = 'glyphicon-stop';
			$scope.timerStart();
			$scope.segs = 1;
			$scope.segsShow = zeroPad($scope.segs,2)
		}
	}
	$scope.recorridoText = 'Iniciar Recorrido';
	$scope.recorridoClass = 'btn-success';
	$scope.recorridoBtnClass = 'glyphicon-play';
	$scope.mins = $scope.segs = 0;

	$scope.incrementarInterval = function(){
		$scope.segs2 = $scope.segs + 1;
		if($scope.segs2 == 60){
			$scope.segs = 0;
			$scope.mins++;
		}else{
			$scope.segs = $scope.segs2;
		}
		$scope.segsShow = zeroPad($scope.segs,2)
	}
	$scope.timerStart = function (){
		$scope.timer = $interval($scope.incrementarInterval, 1000);
	}
	$scope.logout = function(){
		ApiService.Logout();
	}
	$scope.config = function(){
		$location.path('/config');
		$rootScope.view_open_menu();
	}
	$scope.update = function(){
		//ApiService.inicializar_datos(false);
	}
	$scope.carrito = function(){
		$location.path('/carrito');
		$rootScope.view_open_menu();
	}
	function zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}
});

app.controller('configController', function($rootScope, $scope, $route, $routeParams, $location, DBService){
	$scope.borrarDb = function(){
		DBService.borrarDB().then(function(){
			$scope.alerts.push({type:'success', msg: 'Se borró la base de datos completa'});
		});
	}

	$scope.alerts = [];
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

});



app.controller('LoginController', function ($scope, $rootScope, $location, ApiService) {
        // reset login status
        ClearCredentials();
 		$rootScope.view_open_menu();
        $scope.login = function ($credentials) {
            ApiService.Login($credentials.email, $credentials.password).then(function(data){
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
        };
		/*$scope.fogot_pw = function(){
			$location.path('/olvido_pw');
		}*/
		function ClearCredentials(){
			$scope.login_error = '';
			$scope.credentials = {email: '', password : ''};
		}
});