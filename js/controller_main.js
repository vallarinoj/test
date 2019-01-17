app.controller('ViewController', function($rootScope, $scope, $route, $routeParams, $location, ApiService) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 $scope.isCollapsed = false;
	 $scope.cats = [];
	 $rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible';
	 $rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
	$rootScope.view_toggle_menu = function(){
		if($scope.menu_class == 'bottom_slide_no_visible'){
			$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_visible'
			$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-remove';
		}else{
			$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible'
			$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
		}
	}
	$rootScope.view_open_menu = function(){
		$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_visible'
		$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-remove';
	}
	$rootScope.view_close_menu = function(){
		$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible'
		$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
	}
 });
app.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 //$scope.hola = "HELLO MY FRIEND";
 });