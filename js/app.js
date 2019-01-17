'use strict';
var app = angular.module('GSP', ['ngRoute', 'ui.bootstrap', 'ngAnimate','mn']);
app.value('http_defaults', {
    timeout: 40000
});
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/crearOrden/:idCarrito', {
    templateUrl: 'templates/crear_orden.html'
  })
   .when('/carrito/:idCarrito', {
    templateUrl: 'templates/carrito.html'
  })
   .when('/config', {
    templateUrl: 'templates/config.html'
  })
  .when('/cambiarPw', {
    templateUrl: 'templates/cambiarPw.html'
  })
   .when('/login', {
    templateUrl: 'templates/login.html'
  })
  .when('/olvido_pw', {
    templateUrl: 'templates/olvido_pw.html'
  })
  .when('/', {
    templateUrl: 'templates/main.html'
  })
  .when('/cat/:catId', {
    templateUrl: 'templates/cat.html'
  })
  .when('/producto/:prodId', {
    templateUrl: 'templates/producto.html'
  })
  .when('/buscar/:searchTerm', {
    templateUrl: 'templates/buscar.html'
  })
  .when('/verCotizaciones/', {
    templateUrl: 'templates/cotizaciones.html'
  })
  .when('/verCotizacion/:id', {
    templateUrl: 'templates/cotizacion.html'
  })
  .when('/verMensajes', {
    templateUrl: 'templates/mensajes.html'
  })
  .when('/verMensaje/:msgId', {
    templateUrl: 'templates/mensaje.html'
  })
  .when('/ambiente/:ambId', {
    templateUrl: 'templates/ambiente.html'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode({
	  enabled: true
	});
});


app.config(function($httpProvider) {//Arreglo de serializacion de datos posteados, para que funcione bien en php
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
app.filter('nl2br', ['$sce', function($sce) {
    return function(msg) {
        var breakTag = '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
}]);