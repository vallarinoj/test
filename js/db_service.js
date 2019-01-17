// JavaScript Document
app.service( 'DBService', [ '$rootScope', '$q', '$interval', '$uibModal', function( $rootScope, $q, $interval, $uibModal) {
   	var service = {};
	service.tabla = [];
	service.tablas_names = [];
	service.carritoActual = false;
	$rootScope.recorridoActual = false;
	$rootScope.segs = $rootScope.mins = 0;
	$rootScope.timer2 = 0;
	service.toggleRecorrido = function(){
		if($rootScope.recorridoActual){
			service.finalizarRecorrido();
		}else{
			service.iniciarRecorrido();
		}
	}

	service.timerStart = function (){
		//debug.info("start");
		$rootScope.segs = 1;
		$rootScope.timer2 = 1;
		$rootScope.timer = $interval(
			function(){
				$rootScope.segs++;
				$rootScope.timer2++;
				if($rootScope.timer2 >= 1200){//mas de 20 mins sin que suceda nada
					service.finalizarRecorridoOk();
				}
				if($rootScope.segs%60 == 0){
					$rootScope.mins++;
				}
			}
		, 1000);
	}
	service.finalizarRecorridos = function(){
		var def_recFin = $q.defer();
		service.tabla['recorrido'].getAll(
			function(todos_recorridos){
				//debug.info('actualizar_recorridos');
				recorridos_filtrados = filtrar(filtrar(todos_recorridos, 'tsFin', '', '!isset'), 'id', $rootScope.recorridoActual, '!=');
				var cont = 0;
				var cant = recorridos_filtrados.length;
				var timestamp = ts();
				if(cant > 0){
					angular.forEach(recorridos_filtrados, function(value, key){
						value.tsFin = timestamp;
						if(value.cliente_id_web != null || value.cliente_id == null){
							value.actualizar = true;
						}
						service.tabla['recorrido'].put(value,
							function(){
								cont++;
								if(cont >= cant){
									def_recFin.resolve(true);
								}
							},
							function(){
								debug.info("ERROR");
							}
						);

					});
				}else{
					def_recFin.resolve(true);
				}
			}
		);
		return def_recFin.promise;
	}
	service.actualizarClientes = function(){
		var def_c = $q.defer();
		service.tabla['cliente'].getAll(
			function(todos_clientes){
				clientes_filtrados = filtrar(todos_clientes, 'recorrido', $rootScope.recorridoActual, '!=');
				var cant = clientes_filtrados.length;
				var cont = 0;
				//debug.info(cant + " "+cont);
				if(cant > 0){
					angular.forEach(clientes_filtrados, function(value, key){
						value.actualizar = true;
						service.tabla['cliente'].put(value, function(){
							cont++;
							if(cont >= cant){
								def_c.resolve(true);
							}
						}
						);//put tabla cliente
					});//foreach
				}else{
					def_c.resolve(true);
				}

			}
		);
		return def_c.promise;
	}
	service.actualizarRecorridos = function(){
		var def1 = $q.defer();
		service.finalizarRecorridos().then(function(){
			service.tabla['recorrido'].getAll(
				function(todos_recorridos){
					//debug.info('actualizar_recorridos');
					recorridos_filtrados = filtrar(filtrar(todos_recorridos, 'id', $rootScope.recorridoActual, '!='), 'id_web',  '', '!isset');
					var cont = 0;
					var cant = recorridos_filtrados.length;
					var timestamp = ts();
					if(cant > 0){
						angular.forEach(recorridos_filtrados, function(value, key){
							value.actualizar = true;
							//debug.info(value);
							//debug.info(value.cliente_id);
							/*service.tabla['recorrido'].get(value.cliente_id,
								function(cliente_rec){
									value.cliente_id_web = cliente_rec.id_web;*/
							service.tabla['recorrido'].put(value,
								function(){
									cont++;
									if(cont >= cant){
										def1.resolve(true);
									}
								},
								function(){
									debug.info("ERROR");
								}
							);
								/*},
								function(){
									debug.info("ERROR");
								}
							);		*/
						});
					}else{
						//debug.info("Resolved sin actualizar");
						def1.resolve(true);
					}
				}
			);

		});

		return def1.promise;
	}
	service.actualizarCarritos = function(){
		debug.info("actualizarCarritos");
		var def_car = $q.defer();
		service.tabla['carrito'].getAll(
			function(todos_carritos){
				//debug.info('actualizar_recorridos');
				carritos_filtrados = filtrar(filtrar(/*filtrar(*/todos_carritos/*, 'id_web', '', '!isset')*/, 'id', service.carritoActual.id, '!='), 'recorrido_id_web', '', '!isset');
				var cont = 0;
				var cant = carritos_filtrados.length;
				if(cant > 0){
					//debug.info(carritos_filtrados);
					angular.forEach(carritos_filtrados, function(value, key){
						//if(){
						//debug.info(value.idRecorrido);
						service.tabla['recorrido'].get(value.idRecorrido,
							function(dato_recorrido){
								//debug.info(dato_recorrido);
								//debug.info(cont);
								//debug.info(cant);
								//if(value.id_web != null){
									value.recorrido_id_web = dato_recorrido.id_web;
									value.actualizar = true;
									service.tabla['carrito'].put(value,
										function(){
											cont++;
											if(cont >= cant){
												def_car.resolve(true);
											}
										},
										function(){
											debug.info("ERROR");
										}
									);/**/
								/*}else{
									cont++;
									if(cont >= cant){
										def_car.resolve(true);
									}
								}*/
							},
							function(){
								debug.info('ERROR');
							}
						);
					});
				}else{
					def_car.resolve(true);
				}
			}
		);
		return def_car.promise;
	}

	service.clientesRecorridos = function(){
		var def2 = $q.defer();
		service.tabla['recorrido'].getAll(
			function(todos_recorridos){
				recorridos_filtrados = filtrar(filtrar(filtrar(todos_recorridos, 'cliente_id_web', '', '!isset'), 'id', $rootScope.recorridoActual, '!='), 'cliente_id', '', 'isset');
				var cont = 0;
				var cant = recorridos_filtrados.length;
				var timestamp = ts();
				if(cant > 0){
					angular.forEach(recorridos_filtrados, function(value, key){
						value.tsFin = timestamp;
						service.tabla['cliente'].get(value.cliente_id,
							function(cliente_data){
								if(cliente_data.id_web != null){
									value.cliente_id_web = cliente_data.id_web;
									service.tabla['recorrido'].put(value,
										function(){
											cont++;
											if(cont >= cant){
												def2.resolve(true);
											}
										},
										function(){
											debug.info("ERROR");
										}
									);


								}else{
									cont++;
									//debug.info(cont+" "+cant);
									if(cont >= cant){
										def2.resolve(true);
									}
									def2.resolve(true);
								}
							},
							function(){

								debug.info("ERROR");
							}
						);
					});
				}else{
					def2.resolve(true);
				}
			}
		);
		return def2.promise;
	}
	service.actualizarRecorridoClick = function(){
		var def_click = $q.defer();
		service.tabla['recorrido_click'].getAll(
			function(todos_rec_click){
				//debug.info('actualizar_recorridos');
				//debug.info(todos_rec_click);
				rec_click_filtrados = filtrar(filtrar(todos_rec_click, 'recorrido', $rootScope.recorridoActual, '!='), 'recorrido_id_web', '', '!isset');
				//debug.info(rec_click_filtrados);
				var cont = 0;
				var cant = rec_click_filtrados.length;
				if(cant > 0){
					angular.forEach(rec_click_filtrados, function(value, key){
						//debug.info(value.recorrido);
						//debug.info(value);
						service.tabla['recorrido'].get(value.recorrido,
							function(dato_recorrido){
								//debug.info(dato_recorrido);
								if(dato_recorrido.id_web != null){
									//debug.info(dato_recorrido.id_web);
									value.recorrido_id_web = dato_recorrido.id_web;
									value.actualizar = true;
									service.tabla['recorrido_click'].put(value,
										function(){
											cont++;
											if(cont >= cant){
												def_click.resolve(true);
											}
										},
										function(){
											debug.info("ERROR");
										}
									);/**/
								}else{
									cont++;
									if(cont >= cant){
										def_click.resolve(true);
									}
								}
							},
							function(){
								debug.info('ERROR');
							}
						);
					});
				}else{
					def_click.resolve(true);
				}
			}
		);
		return def_click.promise;
	}
	service.actualizarEncuestas = function(){
		var def_encuesta = $q.defer();
		service.tabla['encuestas_respuestas'].getAll(
			function(todos_encuestas){
				//debug.info('actualizar_recorridos');
				encuestas_filtrados = filtrar(filtrar(todos_encuestas, 'recorrido', $rootScope.recorridoActual, '!='), 'recorrido_id_web', '', '!isset');
				var cont = 0;
				var cant = encuestas_filtrados.length;
				if(cant > 0){
					angular.forEach(encuestas_filtrados, function(value, key){
						//debug.info(value.recorrido);
						//debug.info(value);
						service.tabla['recorrido'].get(value.recorrido,
							function(dato_recorrido){
								//debug.info(dato_recorrido);
								if(dato_recorrido.id_web != null){
									//debug.info(dato_recorrido.id_web);
									value.recorrido_id_web = dato_recorrido.id_web;
									value.actualizar = true;
									service.tabla['encuestas_respuestas'].put(value,
										function(){
											cont++;
											if(cont >= cant){
												def_encuesta.resolve(true);
											}
										},
										function(){
											debug.info("ERROR");
										}
									);/**/
								}else{
									cont++;
									if(cont >= cant){
										def_encuesta.resolve(true);
									}
								}
							},
							function(){
								debug.info('ERROR');
							}
						);
					});
				}else{
					def_encuesta.resolve(true);
				}
			}
		);
		return def_encuesta.promise;
	}
	service.crearRecorrido = function(){
		var def = $q.defer();
		service.actualizarRecorridos().then(function(){
			var dato = {user:parseInt(localStorage.getItem('userid')), tsIni:ts()};
			if($rootScope.cliente.id != null){
				dato.cliente_id = $rootScope.cliente.id;
			}
			if($rootScope.cliente.id_web != null){
				dato.cliente_id_web = $rootScope.cliente.id_web;
			}
			service.tabla['recorrido'].put(dato, function(data){
				def.resolve(data);
			});
		});
		return def.promise;
	}
	service.recorridoActual = function(){
		var def = $q.defer();
		if($rootScope.recorridoActual != false){
			def.resolve($rootScope.recorridoActual);
		}else{
			service.crearRecorrido().then(function(data){
				$rootScope.recorridoActual = data;
				//service.timerStart();
				def.resolve(data);
			})
		}
		return def.promise;
	}
	service.iniciarRecorrido = function(){
		//debug.info("iniciar Recorrido");
		var def = $q.defer();
		if($rootScope.recorridoActual != false){
				def.resolve(true);
		}else{
			service.recorridoActual().then(function(data){
				//debug.info(data);
				$rootScope.recorridoActual = data;
				service.timerStart();
				def.resolve(true);
			});
		}
		return def.promise;
	}
	service.finalizarRecorrido = function(){
		if($rootScope.globals.hizoEncuesta){
			service.modalInstance = $uibModal.open({
			  templateUrl: 'templates/modalRecorrido.html',
			  controller: 'modalRecorridoController'
			});
		}else{
			service.modalInstance = $uibModal.open({
			  templateUrl: 'templates/modalEncuesta.html',
			  controller: 'modalRecorridoEncuestaController'
			});
		}
	}
	service.finalizarRecorridoOk = function(){
		service.actualizarRecorridos().then(function(){
			$interval.cancel($rootScope.timer);
			//debug.info("cancel");
			if($rootScope.recorridoActual != false){
				service.tabla['recorrido'].get($rootScope.recorridoActual, function(data){
					var recorrido = data;
					recorrido.tsFin = ts();
					if($rootScope.cliente.id != null){
						recorrido.cliente_id = $rootScope.cliente.id;
					}
					if($rootScope.cliente.id_web != null){
						recorrido.cliente_id_web = $rootScope.cliente.id_web;
					}
					if(recorrido.cliente_id_web != null || recorrido.cliente_id == null){
						recorrido.actualizar = true;
					}
					service.tabla['recorrido'].put(recorrido, function(){
						$rootScope.recorridoActual = false;
						service.carritoActual = false;
						$rootScope.cliente = {};
						$rootScope.mins = $rootScope.segs = 0;
						$rootScope.globals.hizoEncuesta = false;
						$rootScope.$apply();
						$rootScope.view_close_menu();
						//debug.info($rootScope.segs);
					});
				});
			}
		});
	}
	service.guardarRespuestaEncuesta = function(pregunta, respuesta){
		//debug.info("agregar_recorrido_click");
		if(!$rootScope.recorridoActual){
			debug.info("ERROR, no hay recorrido");
		}else{
			if(respuesta == null || pregunta == null){
				debug.info("ERROR, no estan todos los datos");
			}else{
				var dato ={};
				dato.pregunta = pregunta;
				dato.respuesta = respuesta;
				dato.recorrido = $rootScope.recorridoActual;
				dato.ts = ts();
				service.tabla['encuestas_respuestas'].put(dato,
					function(data){
						//debug.info(data);
					},
					function(){
						debug.info("ERROR");
					}
				);
			}

		}
	}
	service.agregar_recorrido_click = function(tipo, id){
		//debug.info("agregar_recorrido_click");
		if(!$rootScope.recorridoActual){
			debug.info("ERROR, no hay recorrido");
		}else{
			$rootScope.timer2 = 0;
			var dato = {};
			dato.tipo = tipo;
			dato.id_externo = id;
			dato.ts = ts();
			dato.recorrido = $rootScope.recorridoActual;
			service.tabla['recorrido_click'].put(dato,
				function(data){
					//debug.info(data);
				},
				function(){
					debug.info("ERROR");
				}
			);
		}
	}
	service.crear_carrito = function(){
		//debug.info("crear_carrito");
		var def = $q.defer();
		if(!service.carritoActual){
			//debug.info("crear_carrito_in");
			var val = {id_user:parseInt(localStorage.getItem('userid')), status:1,idRecorrido:$rootScope.recorridoActual, actualizar:false};
			service.tabla['carrito'].put(val, function(data){
				service.tabla['carrito'].get(data, function (data_car){
					service.carritoActual = data_car;
					def.resolve(data_car);
				}, function(){
					debug.info("ERROR");
				});
			})
		}else{
			def.resolve(service.carritoActual);
		}

		return def.promise;
	}
	service.borrarLineasCarrito = function(id_carrito){
		service.tabla['carrito_lineas'].getAll(
			function(carrito_lineas){
				filtrados = filtrar(carrito_lineas, 'id_carrito', id_carrito, '=');
				angular.forEach(filtrados,
					function(dato, key) {
						service.tabla['carrito_lineas'].remove(dato.id,
						function(){
							//debug.info("BORRADO");
						},
						function(){
							debug.info("ERROR");
						}
					);
				});
			},
			function(){
				debug.info("ERROR");
			}
		);
	}
	service.borrarRecorridos = function(){
		service.tabla['recorrido'].getAll(
			function(todos_recorridos){
				filtrados = filtrar(filtrar(todos_recorridos, 'id_web', '', 'isset'), 'id', $rootScope.recorridoActual, '!=');
				angular.forEach(filtrados,
				function(dato, key) {
					if(service.verificarRecorridoBorrar(dato.id)){
						service.tabla['recorrido'].remove(dato.id,
							function(){
								//debug.info("BORRADO");
							},
							function(){
								debug.info("ERROR");
							}
						);
					}
				});
			},
			function(){
				debug.info("ERROR");
			}
		);
	}
	service.verificarRecorridoBorrar = function(idRec){
		service.tabla['carrito'].getAll(
			function(carritos){
				filtrados = filtrar(carritos, 'idRecorrido', idRec, '=');
				if(filtrados.length > 0){
					return false;
				}
			}
		);
		service.tabla['cliente'].getAll(
			function(carritos){
				filtrados = filtrar(carritos, 'recorrido', idRec, '=');
				if(filtrados.length > 0){
					return false;
				}
			}
		);
		service.tabla['recorrido_click'].getAll(
			function(carritos){
				filtrados = filtrar(carritos, 'recorrido', idRec, '=');
				if(filtrados.length > 0){
					return false;
				}
			}
		);
		return true;

	}
	service.borrarClientes = function(){
		service.tabla['cliente'].getAll(
			function(todos_clientes){
				filtrados = filtrar(todos_clientes, 'id_web', '', 'isset');
				angular.forEach(filtrados,
					function(dato, key) {
						service.tabla['cliente'].remove(dato.id,
						function(){
							//debug.info("BORRADO");
						},
						function(){
							debug.info("ERROR");
						}
					);
				});
			},
			function(){
				debug.info("ERROR");
			}
		);
	}
	//debug.info("carrito"+service.carritoActual());
	service.carrito_actual = function(){
		//debug.info("carrito_actual");
		var def = $q.defer();
		service.iniciarRecorrido().then(function(){
			if(service.carritoActual == false){//si no tiene carrito actual
				service.crear_carrito().then(function(data){
					def.resolve(service.carritoActual);
				});
			}else{
				def.resolve(service.carritoActual);
			}
		});

		return def.promise;
	}
	service.otro_carrito = function(){
		var def = $q.defer();
		service.carritoActual = false;
		service.carrito_actual().then(function(data){
			def.resolve(data.id);
		});
		return def.promise;
	}
	service.carritos_recorrido = function(){
		//debug.info("Carritos_recorrido");
		var def = $q.defer();
		var carritos = [];
		service.tabla['carrito'].getAll(
			function(todos_carritos){

				var carritosRecorrido = [];
				//debug.info(todos_carritos);
				carritos_filtrados = filtrar(filtrar(todos_carritos, 'idRecorrido', $rootScope.recorridoActual, '='), 'id', service.carritoActual.id, '!=');
				//debug.info(service.carritoActual);
				//debug.info(carritos_filtrados);

				var cant = carritos_filtrados.length;

				var cont = 0;
				//debug.info(cant);
				if(cant > 0){
					//debug.info(carritos_filtrados);
					angular.forEach(carritos_filtrados, function(value, key){
						//debug.info(value);
						service.lineasCarrito(value.id).then(function(data){
							value.lineas = data;
							var cont_total = 0;
							var valor_total = 0;
							angular.forEach(data, function(value_linea, key_linea){
								cont_total += value_linea.cant;
								valor_total += (value_linea.cant * value_linea.precio);
							});
							value.cant_items = cont_total;
							value.valor_total = valor_total;
							carritosRecorrido.push(value);
							//debug.info(value);
							cont++;
							if(cont >= cant){
								//debug.info("resolvio");
								def.resolve(carritosRecorrido);
							}
						});

					});
				}else{
					//debug.info("resolvio con 0");
					def.resolve(carritosRecorrido);
				}


			}
		);

		return def.promise;
	}
	/*service.agregar_carrito = function(id_producto){
		//debug.info("agregar carrito");
		var def = $q.defer();
		service.carrito_actual().then(function(data){
			//debug.info(service.carritoActual);
			var vars = {};
			vars.id = id_producto;
			debug.info(ApiService);
			ApiService.getData('producto', vars).then(function(data1){
				var agregar_carrito_ok = function (data){
					//service.actualizarCarrito();
					def.resolve(data);
				}
				service.buscarProductoCarrito(id_producto, service.carritoActual.id).then(function(data){
					var cant = 1;
					//debug.info(service.carritoActual.id);
					datos = {id_user:localStorage.getItem('userid'),id_carrito:service.carritoActual.id, cant:1, id_producto:id_producto, precio:data1.precio_base};
					if(data.length > 0){
						datos.cant = 1+data[0].cant;
						datos.id = data[0].id;
					}
					service.tabla['carrito_lineas'].put(datos, agregar_carrito_ok);
				});

			});
		});
		return def.promise;
	}*/
	service.buscarProductoCarrito = function(id_producto, id_carrito){
		var def = $q.defer();
		var linea = [];
		service.lineasCarrito(id_carrito).then(function(data){
			linea = filtrar(data, 'id_producto', id_producto, '=');
			//debug.info(linea);
			def.resolve(linea);
		});
		return def.promise;
	}
	service.infoProducto = function(id_producto){
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

	}
	service.lineasCarrito = function(id_carrito){
		//debug.info("lineas Carrito");
		var def = $q.defer();
		var carritoLineas = [];
		var onSuccess = function(){
			//debug.info(carritoLineas);
			def.resolve(carritoLineas);
		}
		var onError = function(data){
			debug.error(data);
			def.resolve(false);
		}
		var onItem = function (item) {
			service.infoProducto(item.id_producto).then(function(data){
				item.producto = data;
				item.producto.existencias_bodega = data.existencias[$rootScope.bodegaActual];
				carritoLineas.push(item);
			});

		};
		service.tabla['carrito_lineas'].iterate(onItem, {
		  index: 'id_carrito',
		  keyRange: this.tabla['carrito_lineas'].makeKeyRange({only:id_carrito}),
		  order: 'ASC',
		  filterDuplicates: false,
		  writeAccess: false,
		  onEnd: onSuccess,
		  onError: onError
		});
		return def.promise;
	}
	service.borrarLineaCarrito = function(id){
		var def = $q.defer();
		var actualizar = function(data){
			def.resolve(true);
		}
		service.tabla['carrito_lineas'].remove(id, actualizar);
		return def.promise;
	}
	service.modLineaCarrito = function(id, cant){
		var def = $q.defer();
		function actualizar(data){
			def.resolve(data);
		}
		service.tabla['carrito_lineas'].get(id, onSuccess, onError);
		function onError(){
			def.resolve(false);
		}
		function onSuccess(data){
			var newCant = data.cant + cant;
			if(newCant == 0){
				service.tabla['carrito_lineas'].remove(id, actualizar);
			}else{
				data.cant = newCant;
				data.id = parseInt(data.id);
				service.tabla['carrito_lineas'].put(data, actualizar);
			}
		}

		return def.promise;
	}
	service.seleccionarCarrito = function(id){
		var def = $q.defer();
		service.tabla['carrito'].get(id, function(data){
			service.carritoActual = data;
			def.resolve(true);
		}, function(){
			debug.info("ERROR");
			def.resolve(false);
		});
		return def.promise;
	}
	service.guardarCliente = function(cliente){
		if(cliente.email != null){
			service.tabla['cliente'].getAll(
				function(clientes){
					clientes_filtrados = filtrar(clientes, 'email', cliente.email, '=');
					if(clientes_filtrados.length > 0){
						cliente.id = clientes_filtrados[0].id;
					}
				},
				function(data){
					debug.info("Error");
				}
			);
		}
		$rootScope.cerrar_menu_der();
		service.iniciarRecorrido().then(function(){
			cliente.recorrido = $rootScope.recorridoActual;
			service.tabla['cliente'].put(cliente,
				function(data){
					cliente.id = data;
					$rootScope.cliente = cliente;
				}
			);
		});
	}
	service.install_db = function() {
        var def = $q.defer();
		var cant = 0;
		var cont_tablas = 0;
		var nombre = '';
		nombre = 'mensajes_leidos';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});
		nombre = 'mensajes';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});
		nombre = 'recorrido_click';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});
		nombre = 'productos';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 9,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [
				{ name: 'categoria', unique: false}
			],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'categorias';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 7,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [
				{ name: 'hijo_de', unique: false}
			],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'carrito';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 8,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [
				{ name: 'id_user', unique: false},
				{name:'status', unique:false}
			],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'carrito_lineas';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 6,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [
				{ name: 'id_user', unique: false},
				{ name: 'id_carrito', unique: false},
				{ name: 'id_producto', unique: false}
			],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'recorrido';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 7,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [
				{ name: 'user', unique: false}
			],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'cliente';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 8,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'sucursal';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'tipoambiente';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
			},
			onError: function(error){ throw error; def.resolve(false); }
		});

		nombre = 'ambientes';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			indexes: [{ name: 'floor_plan', unique: false}],
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
				todas_tablas();
			},
			onError: function(error){ throw error;def.resolve(false); }
		});

		nombre = 'encuestas';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
				todas_tablas();
			},
			onError: function(error){ throw error;def.resolve(false); }
		});
		nombre = 'encuestas_respuestas';
		this.tablas_names.push(nombre);
		this.tabla[nombre] = new IDBStore({
			storeName: nombre,
			storePrefix: 'Db - ',
			dbVersion: 1,
			keyPath : 'id',
			autoIncrement: true,
			onStoreReady: function(){
				mensaje_tabla(this.storeName);
				todas_tablas();
			},
			onError: function(error){ throw error;def.resolve(false); }
		});


		function mensaje_tabla(tabla_name){
			//debug.info(cont_tablas, cant);
			//debug.info(tabla_name + " Creada");
		}
		function todas_tablas(){
			//debug.info("tablas_inicializadas");
			def.resolve(true);
		}
		return def.promise;
      }
	  	service.borrarDB = function(){
			var def = $q.defer();
			angular.forEach(this.tablas_names,function(value, key) {
				service.tabla[value].deleteDatabase();
			});
			def.resolve(true);
			return def.promise;
		}
	  return service;

 }]);