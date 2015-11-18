(function()
{
	'use strict';

    var app = angular.module('incidentTool',['ngMessages','ngCookies']);

    app.config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.config(['$locationProvider', function($locationProvider){
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }]);

    app.factory('APIService', ['$http', function($http)
    {
      return {
        post: function(args)
        {
          return $http({ method: 'POST', url: args.url, data: args.data, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, cache: args.cache });
        },
        get: function(args)
        {
          return $http({ method: 'GET', url: args.url });
        }
      };
    }]);

    //app.factory('manifest', ['$http', function($http)
    //{
    //    return $http.get('./manifest.json');
    //}]);

    app.controller('IncidentController', ['$scope','$http','$templateCache','$location','$cookies','$filter','APIService', function($scope, $http, $templateCache, $location, $cookies, $filter, APIService)
    {
    		$scope.elements = config.form.elements;

    		$scope.manifest = function()
    		{
          $http.get('./manifest.json')
          .success(function(data)
          {
              $scope.version = data.version;
          });
    		};
    		$scope.manifest();

        $scope.state = {};
        $scope.state.time = $filter('date')(new Date(),'hh:mm');
        $scope.state.date = $filter('date')(new Date(),'yyyy-MM-dd');
        $scope.state.datetime = $scope.state.date + ' ' + $scope.state.time;

        $scope.data = [];

        $scope.params = $location.search();
        $cookies.put('id',($scope.params.id) ? $scope.params.id : $cookies.get('id'));
        $scope.status = '';

    		if($scope.form === 'update')
    		{
    			for (var key in $scope.elements)
    			{
    				for (var name in $scope.state)
    				{
    					if($scope.elements[key].name === name) $scope.elements[key].value = $scope.state[$scope.elements[key].name];
    				}
    			}
    		}

        $scope.object = function(args)
        {
          $scope.form = args.form;
          if(args.id)
          {
            $cookies.put('id',args.id);
            $scope.fetch({ type: 'record' }, function(data)
            {
              $scope.state = data;
              console.log("$scope.state",$scope.state);
            });
          }
          else if($scope.form === 'create')
          {
            $scope.state.time = $filter('date')(new Date(),'hh:mm');
            $scope.state.date = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.state.datetime = $scope.state.date + ' ' + $scope.state.time;
            $cookies.remove('id');
            for(var key in $scope.elements)
            {
              delete $scope.state[$scope.elements[key].name];
            }
            delete $scope.state._id;
            delete $scope.state.log;
          }
        };

        //$scope.state.time = new Date($scope.state.time);
        //$scope.state.date = new Date($scope.state.date);

        $scope.reload = function() { window.location.reload(); };
        $scope.submit = function()
        {
          if($scope.state.timeline)
          {
            if(!$scope.state.log) $scope.state.log = {};
            if(!$scope.state.log.entries) $scope.state.log.entries = [];

            $scope.state.time = $filter('date')(new Date(),'hh:mm');
            $scope.state.date = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.state.datetime = $scope.state.date + ' ' + $scope.state.time;

            $scope.state.log.entry = {
              'date' : $scope.state.datetime,
              'text' : $scope.state.timeline
            };

            if($scope.state.log.entries.length > 0)
            {
              var entry = $scope.state.log.entries.pop();

              if(entry.text != $scope.state.timeline)
              {
                $scope.state.log.entries.push(entry);
                $scope.state.log.entries.push($scope.state.log.entry);
              }
              else
              {
                $scope.state.log.entries.push(entry);
              }
            }
            else
            {
              $scope.state.log.entries.push($scope.state.log.entry);
            }
          }

          angular.forEach($scope.incident.$error, function(error)
          {
            angular.forEach(error, function(field) { field.$setTouched(); });
          });

          if(($scope.incident.$submitted === true) && ($scope.incident.$valid === true))
          {
            $scope.insert();
          }
        };

        $scope.insert = function(args)
        {
          var request = $cookies.get('id') ? ('insert?id=' + $cookies.get('id')) : 'insert';

          APIService.post({ url: 'http://' + window.location.hostname + ':8080/' + request, data: 'data=' + JSON.stringify($scope.state), cache: $templateCache })
          .success(function(response)
          {
            $scope.status = response.data;
          })
          .error(function(response)
          {
            $scope.status = response;
          });
          $scope.reload();
        };

        $scope.fetch = function(args, cb)
        {
          var request = args.id !== null ? ('fetch?id=' + $cookies.get('id')) : 'fetch';

          APIService.get({ url: 'http://' + window.location.hostname + ':8080/' + request })
          .success(function(data)
          {
            if(args.type === 'record')
            {
              cb(data[0]);
            }
            else if(args.type === 'records')
            {
              cb(data);
            }
          });
        };

        $scope.fetch({ id: null, type: 'records' }, function(data)
        {
          $scope.data = data;
          console.log("$scope.data",$scope.data);
        });
    }]);
})();

