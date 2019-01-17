// JavaScript Document
app.factory('ApiService',function ($http, http_defaults, $q, $location, $rootScope, DBService) {
        var service = {};
        service.getData = function(tipo, vars, borrarTabla){
			//debug.info(tipo);
			if(typeof(borrarTabla) ===  'undefined'){
				borrarTabla = false;
			}
			var def = $q.defer();
			var url = '';
			var id_tipo = 0;
			var ts = 0;
			switch(tipo){

				case 'categoria':
					id_tipo = 0;
					url = api_url+'/'+tipo+'/'+vars.id;
					borrarTabla = true;
				break;
				case 'categorias':
					id_tipo = 0;
					url = api_url+'/'+tipo;
					borrarTabla = true;
				break;
				case 'productos':
					id_tipo = 7;
					url = api_url+'/'+tipo;
				break;
				case 'producto':
					id_tipo = 0;
					url = api_url+'/'+tipo+'/'+vars.id;
				break;
				case 'productos_cat':
					id_tipo = 0;
					url = api_url+'/'+tipo+'/'+vars.id+'/'+vars.page;
				break;
				case 'productos_ambiente':
					id_tipo = 0;
					url = api_url+'/'+tipo+'/'+vars.id+'/'+vars.page;
				break;
				case 'sucursal':
					id_tipo = 0;
					url = api_url+'/'+tipo;
				break;
				case 'sucursal_actual':
					id_tipo = 0;
					url = api_url+'/'+tipo;
				break;
				case 'tipoambiente':
					id_tipo = 0;
					url = api_url+'/'+tipo;
				break;
				case 'ambientes':
					id_tipo = 0;
					url = api_url+'/'+tipo;
				break;
				case 'ambientes_fp':
					id_tipo = 0;
					url = api_url+'/'+tipo+'/'+vars.fp;
				break;
				case 'mensajes':
					id_tipo = 8;
					url = api_url+'/'+tipo;
				break;
				case 'encuestas':
					id_tipo = 0;
					url = api_url+'/'+tipo;
				break;
			}
			/*ts = localStorage.getItem('actualiza_'+id_tipo);
			if(ts == null || borrarTabla){
				ts = 0;
			}
			url = url+'/'+ts;*/

			var respuesta = {};
			var valores = [];
			$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
			//$rootScope.globals.loading = true;
			$http.get(url, http_defaults)
			.success(function(response) {
				service.updateCredentials(response, id_tipo).then(function(data){
					if(data.success){
						respuesta.success = true;
						respuesta.mensaje = "Se actualizó la tabla "+tipo;
						/*if(tipo == 'ambientes'){
							debug.info(data.data[tipo]);
						}*/
						/*if(borrarTabla){
							DBService.tabla[tipo].clear();
						}*/
						//debug.info(tipo);
						if(tipo == 'mensajes'){
							angular.forEach(data.data[tipo], function(value, key) {
								//debug.info(value);
								DBService.tabla[tipo].put(value, function(){
									//debug.info("OK");
								}, function(error){debug.info("ERROR - "+error);});
							/*	valores.push(value);*/
							});
						}
						valores = data.data[tipo];
						/*if(tipo == 'categorias'){
							$rootScope.actualizar.categorias = true;
						}
						if(tipo == 'ambientes'){
							$rootScope.actualizar.ambientes = true;
						}
						if(tipo == 'mensajes'){
							$rootScope.actualizar.mensajes = true;
						}
						if(tipo == 'encuestas'){
							$rootScope.actualizar.encuestas = true;
						}*/
					}
					def.resolve(valores);
				});
			}).error(function(response) { // optional
				//debug.info(response);
				 respuesta.success = false;
				 	if(response == null || response.error == null){
						respuesta.mensaje = "ERROR. No se pudo conectar al API, tipo '"+tipo+"'";
					}else{
						respuesta.mensaje = response.error;

					}
					debug.error(respuesta);
					$rootScope.globals.msgConn.push({type:'danger', msg: respuesta});
					$rootScope.globals.loading = false;
				 def.resolve(respuesta);
			});
			return def.promise;
		};
		service.agregar_carrito = function(arr_producto){
			//debug.info("agregar carrito");
			var def = $q.defer();
			DBService.carrito_actual().then(function(data){
				//debug.info(service.carritoActual);
				var vars = {};
				/*vars.id = a_producto;
				//debug.info(ApiService);
				service.getData('producto', vars).then(function(data1){*/
					var agregar_carrito_ok = function (data){
						//service.actualizarCarrito();
						def.resolve(data);
					}
					DBService.tabla['productos'].put(arr_producto, function(){
						DBService.buscarProductoCarrito(arr_producto.id, DBService.carritoActual.id).then(function(data){
							//var cant = 1;
							//debug.info(service.carritoActual.id);
							datos = {id_user:localStorage.getItem('userid'),id_carrito:DBService.carritoActual.id, cant:1, id_producto:arr_producto.id, precio:arr_producto.precio_base};
							if(data.length > 0){
								datos.cant = 1+data[0].cant;
								datos.id = data[0].id;
							}
							DBService.tabla['carrito_lineas'].put(datos, agregar_carrito_ok);
						});
					});

				//});
			});
			return def.promise;
		};
		/*service.infoProducto = function(id_producto){
			//debug.info("infoProducto");
			var def = $q.defer();
			var onsuccess = function(data){
				def.resolve(data);
			}
			var onerror = function(data){
				debug.error(data);
				def.resolve(false);
			}
			service.tabla['productos'].get(id_producto, onsuccess, onerror);
			return def.promise;

		}*/
		//**PUT DATA*/
		service.putData = function(tipo, vars){
			//debug.info(tipo);
			var def_put = $q.defer();
			var respuesta = {};
			DBService.tabla[tipo].getAll(
				function(data){
					filtrados = filtrar(data, 'actualizar', true, '=');
					var cant = filtrados.length;
					var cont = 0;
					if(cant > 0){
						angular.forEach(filtrados, function(dato, key) {
							var url = '';
							switch(tipo){
								case 'carrito':
									url = api_url+'/putCarrito';
								break;
								case 'cliente':
									url = api_url+'/putCliente';
								break;
								case 'recorrido':
									url = api_url+'/putRecorrido';
								break;
								case 'recorrido_click':
									url = api_url+'/putRecorridoClick';
								break;
								case 'mensajes_leidos':
									url = api_url+'/putMensajeVisto';
								break;
								case 'encuestas_respuestas':
									url = api_url+'/putEncuestaRespuesta';
								break;
							}
							//debug.info(url);
							if(tipo == 'carrito'){
								//debug.info("put carrito");
								if(dato.recorrido_id_web != null){
									DBService.lineasCarrito(dato.id).then(function(carrito_lineas){
										//dato.lineas = [];
										dato.lineas = carrito_lineas;
										//debug.info(dato);
										if($rootScope.globals.logueado && dato.lineas.length > 0){
											$http.post(url, dato, http_defaults).success(function(response) {
												//debug.info(response);
												service.updateCredentials(response, 0)
												.then(function(data1){
													dato.ts_update = ts();
													dato.id_web = parseInt(data1.data.carrito);
													dato.actualizar = false;
													if(dato.id_web != 0 && typeof(dato.id_web) != 'undefined'){
														DBService.tabla[tipo].remove(dato.id,
															function(){
																DBService.borrarLineasCarrito(dato.id);
																cont++;
																if(cont == cant){
																	def_put.resolve(true);
																}
															},
															function(){debug.info("ERROR");}
														);
													}else{
														cont++;
														if(cont == cant){
															def_put.resolve(true);
														}
													}
												});

											}).error(function(response) { // optional
												debug.info("ERROR");
												respuesta = "Error de escritura de datos de "+tipo;
												$rootScope.globals.msgConn.push({type:'danger', msg: respuesta});
												debug.info(response);
												//service.Logout();
											});
										}else{
											if(dato.lineas.length == 0){
												DBService.tabla[tipo].remove(dato.id,
													function(){
														DBService.borrarLineasCarrito(dato.id);
														cont++;
														if(cont == cant){
															def_put.resolve(true);
														}
													},
													function(){debug.info("ERROR");}
												);
											}else{
												cont++;
												if(cont == cant){
													def_put.resolve(true);
												}
											}
										}
									});
								}else{
									def_put.resolve(true);
								}
								//dato.lineas = ;
							}else{//para los que no son carrito
								dato.sucursal = $rootScope.globals.sucursalSel;
								$http.post(url, dato, http_defaults).success(function(response) {
									//debug.info(response);
									service.updateCredentials(response, 0).then(function(data1){
										if(tipo == 'cliente' && parseInt(data1.data.cliente) != 0){
											dato.id_web = parseInt(data1.data.cliente);
											dato.actualizar = false;
											//debug.info(dato);
											//debug.info(dato);
										}
										if(tipo == 'recorrido' && parseInt(data1.data.recorrido) != 0){
											dato.id_web = parseInt(data1.data.recorrido);
											dato.actualizar = false;
										}
										if((tipo == 'recorrido_click' && parseInt(data1.data.recorrido_click) != 0) || tipo == 'encuestas_respuestas' || tipo == 'mensajes_leidos'){
											DBService.tabla[tipo].remove(dato.id,
												function(){
													//debug.info("OK - "+tipo+" - "+dato.id)
													cont++;
													if(cont == cant){
														def_put.resolve(true);
													}
												},
												function(){debug.info("ERROR");}
											);
										}else{
											DBService.tabla[tipo].put(dato, function(){
												cont++;
												if(cont == cant){
													def_put.resolve(true);
												}
											}, function(){debug.info("ERROR");});
										}

									});

								}).error(function(response) { // optional
									respuesta = "Error de escritura de datos de "+tipo;
									$rootScope.globals.msgConn.push({type:'danger', msg: respuesta});
									 debug.info(response);
									 //service.Logout();
								});
							}
						},
						function(){
							debug.info("ERROR");
						});
					}else{
						def_put.resolve(true);
					}
				},
				function(data){
					debug.info("ERROR");
				}
			);
			return def_put.promise;
		};
		service.actualizar_datos = function(){
			var def_ad = $q.defer();
			//service.inicializar_datos(false).then(function(){
				service.putDatos()
				.then(function(){
					def_ad.resolve(true);
				});
			//});
			return def_ad.promise;
		}
		service.putDatos = function(){
			//debug.info("PUT DATOS");
			var def = $q.defer();
			service.putData('mensajes_leidos', {})
			.then(function(){
				//debug.info("mensajes_leidos completed");
				DBService.actualizarClientes()
				.then(function(){
					//debug.info("actualizarClientes completed");
					service.putData('cliente',{})
					.then(function(){
						debug.info("putData Clientes completed");
						DBService.clientesRecorridos()
						.then(function(){
							//debug.info("Clientes recorridos completed");
							DBService.actualizarRecorridos()
							.then(function(){
								//debug.info("actualizarRecorridos completed");
								service.putData('recorrido', {})
								.then(function(){
									//debug.info("putdata recorridos completed");
									DBService.actualizarCarritos()
									.then(function(){
										//debug.info("actualizarcarritos completed");
										service.putData('carrito', {})
										.then(function(){
											//debug.info("putdata Carritos completed");
											DBService.actualizarEncuestas()
											.then(function(){
												//debug.info("Actualizar Encuestas completed");
												service.putData('encuestas_respuestas', {})
												.then(function(){
													//debug.info("putdata encuestas_respuestas completed");
													DBService.actualizarRecorridoClick()
													.then(function(){
														//debug.info("actualizar recorridos click completed");
														service.putData('recorrido_click', {})
														.then(function(){
															//debug.info("putdata recorrido Click completed");
															DBService.borrarRecorridos();
															DBService.borrarClientes();
															def.resolve(true);
														});//recorrido_click PUTDATA
													});//ActualizarRecorridoClick
												});//encuestas PUTDATA
											});//Actualizar Encuestas
										});//carrito PUTDATA
									});//actualizarCarritos
								});//recorrido PUTDATA
							});//actualizarRecorridos
						});//clientesRecorridos
					});//cliente PUT DATA
				});//actualizar clientes
			});//Mensajes leidos
			return def.promise;
		}
		service.inicializar_datos = function(borrarTabla){
			var def = $q.defer();
			debug.info("inicializar_datos");
			/*service.getData('categorias',{}, borrarTabla)
			.then(function(data){return service.getData('mensajes',{}, borrarTabla)})
			.then(function(data){return service.getData('productos',{}, borrarTabla)})
			.then(function(data){return service.getData('sucursal',{}, borrarTabla)})
			.then(function(data){return service.getData('tipoambiente',{}, borrarTabla)})
			.then(function(data){return service.getData('ambientes',{}, borrarTabla)})
			.then(function(data){return service.getData('encuestas',{}, borrarTabla)})
			.then(function(data){$rootScope.globals.data_inicializada = true; $rootScope.globals.loading = false; def.resolve(true)});*/
			return def.promise;

		}
		service.CambiarPw = function (pw) {
			var def = $q.defer();
			var respuesta = {};
			var datos = { pw: pw};
			$http.post(api_url+'/cambiarPw', datos, http_defaults).success(function(response) {
				//debug.info(response);
				service.updateCredentials(response, 0).then(function(data){
					def.resolve(data);
				});
			}).error(function(response) { // optional
				 respuesta.success = false;
				 	if(reponse == null || response.error == null){
						respuesta.mensaje = "ERROR. No se pudo verificar su usuario";
					}else{
						respuesta.mensaje = response.error;
					}
				$rootScope.globals.msgConn.push({type:'danger', msg: "Error en cambio de contraseña"});
				 def.resolve(respuesta);
			});
			return def.promise;
        };
		service.Login = function (email, password, callback) {
			var def = $q.defer();
			var respuesta = {};
			var datos = { password: password, email: email };
			$http.post(api_url+'/login', datos, http_defaults).success(function(response) {
				debug.info(response);
				debug.info("LOGIN");
				if(response.error != null){
					debug.info("LOGIN ERROR");
					respuesta.mensaje = response.error;
					respuesta.success = false;
					def.resolve(respuesta);
				}else{
					debug.info("LOGIN OK");
					service.updateCredentials(response, 0).then(function(data){
						//service.inicializar_datos(false/*true*/);
						def.resolve(data);
					});
				}
			}).error(function(response) { // optional
				 respuesta.success = false;
				 	if(response == null || response.error == null){
						respuesta.mensaje = "ERROR. No se pudo verificar su usuario";
					}else{
						respuesta.mensaje = response.error;
					}
				$rootScope.globals.msgConn.push({type:'danger', msg: "Error de Validación de Usuario"});
				 def.resolve(respuesta);
			});
			return def.promise;
        };
 		service.updateCredentials = function(credentials_up, tipo){
			var def_cred = $q.defer();
			var respuesta = {};
			//debug.info("credentials_update");
			//debug.info(credentials_up);
			if(credentials_up.userid != null && credentials_up.token != null != null && credentials_up.sucursales != null){
				//debug.info("UPDATE_CREDENTIALS - "+credentials_up.token);

				localStorage.setItem('token', credentials_up.token);
				localStorage.setItem('userid', credentials_up.userid);
				localStorage.setItem('userName', credentials_up.nombreUser);
				$rootScope.userName = credentials_up.nombreUser;
				//debug.info(credentials_up.cambiarpw);
				if(credentials_up.cambiarpw == 1){
					$rootScope.globals.cambiarpw = true;
				}else{
					$rootScope.globals.cambiarpw = false;
				}
				//debug.info($rootScope.globals.cambiarpw);
				$rootScope.empresa = 2;
				localStorage.setItem('empresa', 2);
				//debug.info(JSON.stringify(credentials_up.sucursales));
				localStorage.setItem('sucursales', JSON.stringify(credentials_up.sucursales));
				if(tipo != 0){
					localStorage.setItem('actualiza_'+tipo, credentials_up.ts);
				}else{
					localStorage.setItem('actualiza_'+tipo, 0);
				}
				respuesta.success = true;
				respuesta.data = credentials_up;
			}else{
				respuesta.success = false;
				respuesta.mensaje = "ERROR. No se pudo verificar su usuario";
				$rootScope.globals.msgConn.push({type:'danger', msg: "Error de Validación de Usuario"});
				//$rootScope.globals.logueado = false;
				debug.info("UPDATE CRED ERROR");
				debug.info(respuesta);
				//VAMOS A PASARLO A UN SILENT ERROR a menos que especificamente sea un error de validacion
				if(credentials_up.error != null){
					service.Logout();
				}
				//return false;

			}
			def_cred.resolve(respuesta);
			return def_cred.promise;

		};
        service.Logout = function () {
			debug.info("LOGOUT");
			localStorage.removeItem('token');
			localStorage.removeItem('userid');
			localStorage.removeItem('cambiarpw');
			localStorage.removeItem('empresa');
			localStorage.removeItem('sucursales');
			localStorage.removeItem('actualiza_0');
			localStorage.removeItem('actualiza_1');
			localStorage.removeItem('actualiza_6');
			localStorage.removeItem('actualiza_7');
			localStorage.removeItem('actualiza_8');
			DBService.finalizarRecorridoOk();
			$location.path('/login');
			$rootScope.globals.logueado = false;
			$rootScope.globals.loading = false;
			$rootScope.globals.data_inicializada = false;
        };

        return service;
    });