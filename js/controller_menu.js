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
	 /*$rootScope.$watch('actualizar.categorias', function(){
	 	debug.info("controller_menu_actualizar_cat");
		if($rootScope.actualizar.categorias){
			getItems();
		}
	});*/
	$rootScope.$watch('globals.logueado', function(newValue, oldValue) {
		if(newValue){
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
		//debug.info("getitemsCat");
		ApiService.getData('categorias').then(function(data){
			$scope.cats =data;
			//$rootScope.actualizar.categorias = false;
		});

    	/*DBService.tabla['categorias'].getAll(
			function (data){
				$scope.cats = data;
				$scope.$apply();
				$rootScope.actualizar.categorias = false;
			},
			function (data){
				debug.info("Error");
			}
		);*/

    };

	$scope.buscar = function(){
		if($scope.searchTerm.length > 0){
			$location.path('/buscar/'+$scope.searchTerm);
			$rootScope.view_open_menu();
			$rootScope.cerrar_menu_iz();
			$rootScope.cerrar_menu_der();
		}
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
 app.directive('menuCat', function() {
 var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'templates/menuCat.html';

    return directive;
});