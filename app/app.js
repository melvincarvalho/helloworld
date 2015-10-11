var AUTHENDPOINT = "https://databox.me/";

/**
 * The main app
 */
var App = angular.module('HelloWorld', [
  'lumx'
]);

App.controller('Main', function($scope, $http, LxNotificationService) {

  /**
   * Initialize app
   */
  $scope.initApp = function() {
    $scope.init();
  };

  /**
   * TLS Login with WebID
   */
  $scope.TLSlogin = function() {
    $scope.loginTLSButtonText = 'Logging in...';
    $http({
      method: 'HEAD',
      url: AUTHENDPOINT,
      withCredentials: true
    }).success(function(data, status, headers) {
      // add dir to local list
      var user = headers('User');
      if (user && user.length > 0 && user.slice(0,4) == 'http') {
        LxNotificationService.success('Login Successful!');
        $scope.loggedIn = true;
        $scope.user = user;
      } else {
        LxNotificationService.error('WebID-TLS authentication failed.');
        console.log('WebID-TLS authentication failed.');
      }
      $scope.loginTLSButtonText = 'Login';
    }).error(function(data, status, headers) {
      LxNotificationService.error('Could not connect to auth server: HTTP '+status);
      console.log('Could not connect to auth server: HTTP '+status);
      $scope.loginTLSButtonText = 'Login';
    });
  };

  /**
   * Logout
   */
  $scope.logout = function() {
    $scope.init();
    LxNotificationService.success('Logout Successful!');
  };

  /**
   * Initialize
   */
  $scope.init = function() {
    $scope.initialized = true;
    $scope.loggedIn = false;
    $scope.loginTLSButtonText = "Login";
  };


  /**
   * Main
   */
  $scope.initApp();

});
