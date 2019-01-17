app.controller('MenuController', function($rootScope, $scope, $route, $routeParams, $location, ApiService, DBService) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 $scope.isCollapsed = false;
	 $scope.searchTerm = '';
	 $scope.cats = [];
	 $scope.catActual = 0;
	 $scope.menu_class = 'left_slide_no_visible';
	 $scope.trigger_class = 'glyphicon-chevron-right';
	 $scope.img_url = img_url;
	 $scope.productos = [];
	 $rootScope.$watch('globals.db', function(){
		if($rootScope.globals.db){
			getItems();
		}
	
	});
	$rootScope.toggle_menu_iz = function(){
		if($scope.menu_class == 'left_slide_no_visible'){
			$scope.menu_class = 'left_slide_visible'
			$scope.trigger_class = 'glyphicon-chevron-left';
		}else{
			$scope.menu_class = 'left_slide_no_visible'
			$scope.trigger_class = 'glyphicon-chevron-right';
		}
	}
	$rootScope.abrir_menu_iz = function(){
		$scope.menu_class = 'left_slide_visible'
		$scope.trigger_class = 'glyphicon-chevron-left';
	}
	$rootScope.cerrar_menu_iz = function(){
		$scope.menu_class = 'left_slide_no_visible'
		$scope.trigger_class = 'glyphicon-chevron-right';
	}
	function getItems(){
    	DBService.tabla['categorias'].getAll(getItemsSuccess,errorCallback);
    };
	function getItemsSuccess(data){
        $scope.cats = data;
        $scope.$apply(); 
    };
	function errorCallback(data){
        debug.info("Error");
    };
	$scope.buscar = function(){
		debug.info($scope.searchTerm);
	}
	$scope.ver_cat = function(categoria, tiene_hijos, tiene_productos){
		$scope.catActual = categoria;
		if(tiene_hijos != 1 && tiene_productos == 1){			
			$location.path('/cat/'+categoria);
			$rootScope.view_open_menu();
			$rootScope.cerrar_menu_iz();
			$rootScope.cerrar_menu_der();
		}
	}
	$scope.esSelected = function(cat){
		if(cat == $scope.catActual){
			return 'selected';
		}else{
			return '';
		}
	}
	
 });
app.controller('ViewController', function($rootScope, $scope, $route, $routeParams, $location, ApiService) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 $scope.isCollapsed = false;
	 $scope.cats = [];
	 $rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible';
	 $rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
	 //getItems();
	$rootScope.view_toggle_menu = function(){
		//debug.info($scope.menu_class);
		if($scope.menu_class == 'bottom_slide_no_visible'){
			$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_visible'
			$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-down';
		}else{
			$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible'
			$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
		}
	}
	$rootScope.view_open_menu = function(){
		$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_visible'
		$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-down';
	}
	$rootScope.view_close_menu = function(){
		$rootScope.view_menu_class = $scope.menu_class = 'bottom_slide_no_visible'
		$rootScope.view_trigger_class = $scope.trigger_class = 'glyphicon-menu-up';
	}
	/*function getItems(){
    	tabla['categorias'].getAll(getItemsSuccess,errorCallback);
    };
	function getItemsSuccess(data){
        $scope.cats = data;
        $scope.$apply(); 
    };
	function errorCallback(data){
        debug.info("Error");
    };
	$scope.ver_cat = function(categoria){
		$location.path('/cat/'+categoria);
	}*/
 });
app.controller('MenuClienteController', function($rootScope, $scope, $route, $routeParams, $location, ApiService) {
	 $scope.logueado = $rootScope.globals.logueado;
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
	 $scope.isCollapsed = false;
	 $scope.cats = [];
	 $scope.menu_class = 'right_slide_no_visible';
	 $scope.trigger_class = 'glyphicon-chevron-left';
	 //getItems();
	$rootScope.toggle_menu_der = function(){
		if($scope.menu_class == 'right_slide_no_visible'){
			$scope.menu_class = 'right_slide_visible'
			$scope.trigger_class = 'glyphicon-chevron-right';
		}else{
			$scope.menu_class = 'right_slide_no_visible'
			$scope.trigger_class = 'glyphicon-chevron-left';
		}
	}
	$rootScope.abrir_menu_der = function(){
		$scope.menu_class = 'right_slide_visible'
		$scope.trigger_class = 'glyphicon-chevron-right';
	}
	$rootScope.cerrar_menu_der = function(){
		$scope.menu_class = 'right_slide_no_visible'
		$scope.trigger_class = 'glyphicon-chevron-left';
	}
	/*function getItems(){
    	tabla['categorias'].getAll(getItemsSuccess,errorCallback);
    };
	function getItemsSuccess(data){
        $scope.cats = data;
        $scope.$apply(); 
    };
	function errorCallback(data){
        debug.info("Error");
    };
	$scope.ver_cat = function(categoria){
		$location.path('/cat/'+categoria);
	}*/
 });
 app.directive('menuCat', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/menuCat.html';

    return directive;
});
app.directive('eltop', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/top.html';

    return directive;
});



app.directive('menuCliente', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/menuCliente.html';

    return directive;
});
