	app.run(function($rootScope, $location, ApiService, $window, $q, DBService,$timeout) {
			debug.info("RUN");
			if(window._cordovaNative){
				document.addEventListener("online", function(){
					$rootScope.online = true;
					//debug.info("online");
					$rootScope.$apply();
				}, false);
				document.addEventListener("offline", function(){
					$rootScope.online = false;
					//debug.info("offline");
					$rootScope.$apply();
				}, false);

				document.addEventListener("deviceready", function(){$rootScope.version = AppVersion.version;}, false);
				$rootScope.test = false;
			}else{
				$rootScope.test = true;
				$rootScope.online = navigator.onLine;
				$window.addEventListener("offline", function () {
					//debug.info("offline");
					$rootScope.$apply(function() {
						$rootScope.online = false;
						$rootScope.$apply();
					});
				}, false);
				$window.addEventListener("online", function () {
					//debug.info("online");
					$rootScope.$apply(function() {
						$rootScope.online = true;
						$rootScope.$apply();
					});
				}, false);
			}
			$rootScope.globals = {};
			$rootScope.globals.db = false;
			$rootScope.globals.logueado = false;
			$rootScope.globals.loading = false;
			$rootScope.globals.inner_loader = true;
			$rootScope.globals.data_inicializada = false;
			$rootScope.globals.hizoEncuesta = false;
			$rootScope.globals.sucursalSel = 0;
			$rootScope.globals.msgCount = 0;
			$rootScope.globals.menuClienteTab = 0;
			$rootScope.globals.msgConn = [];
			$rootScope.actualizar = {categorias:false, ambientes:false, mensajes:false, encuestas:false};
			$rootScope.img_url = img_url;
			$rootScope.tipoAmbiente = [];
			if(localStorage.getItem("userid") != null && localStorage.getItem('empresa') != null && localStorage.getItem('sucursales') != null && localStorage.getItem('token') != null){//ya esta logueado
				debug.info("LOGUEADO DE ANTEMANO");
				$rootScope.$broadcast('globals.logueado', true);
				$rootScope.globals.logueado = true;
				$rootScope.globals.loading = false;
				$rootScope.empresa = localStorage.getItem('empresa');
				$rootScope.userName = localStorage.getItem('userName');
			}
			DBService.install_db().then(function(response){
				$rootScope.globals.db = response;
			});
			if($rootScope.globals.logueado){
				$rootScope.$watch('globals.db', function(){
					if($rootScope.globals.db){
						/*if($rootScope.test){
							debug.info("no Sync - TEST MODE");
							//debug.info("INICIO SIN CARGAR DATOS");
							$rootScope.globals.data_inicializada = true;
							$rootScope.actualizar.categorias = true;
							$rootScope.actualizar.ambientes = true;
							$rootScope.actualizar.mensajes = true;
							$rootScope.actualizar.encuestas = true;
						}else{*/
							//ApiService.inicializar_datos(false).then(function(data){
								//debug.info("asyncFinished");
								$rootScope.globals.data_inicializada = true;
								//$rootScope.actualizar.categorias = true;
								//debug.info("actualizar_cat_run");
								$rootScope.actualizar.ambientes = true;
							//});
						//}

					}

				});
			}
			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				// redirect to login page if not logged in
				if ($location.path() !== '/olvido_pw' && $location.path() !== '/login' && !$rootScope.globals.logueado) {
					$location.path('/login');
				}
				if ($location.path() !== '/cambiarPw' && $rootScope.globals.cambiarpw && $rootScope.globals.logueado) {
					//debug.info($rootScope.globals.cambiarpw
					$location.path('/cambiarPw');
				}
			});
	});
