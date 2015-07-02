var AUTHENDPOINT = "https://databox.me/";
var PROXY = "https://rww.io/proxy.php?uri={uri}";
var TIMEOUT = 5000;
var DEBUG = true;
// Namespaces
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var PIM = $rdf.Namespace("http://www.w3.org/ns/pim/space#");
var UI = $rdf.Namespace("http://www.w3.org/ns/ui#");
var DCT = $rdf.Namespace("http://purl.org/dc/terms/");
var LDP = $rdf.Namespace("http://www.w3.org/ns/ldp#");
var SOLID = $rdf.Namespace("http://www.w3.org/ns/solid/app#");
var VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
var FAV = $rdf.Namespace("http://www.eclap.eu/schema/eclap/");

var scope = {};
var gg;

$rdf.Fetcher.crossSiteProxyTemplate=PROXY;

var App = angular.module('HelloWorld', [
    'lumx'
]);

App.controller('Main', function($scope, $http, $timeout, LxNotificationService, LxProgressService, LxDialogService) {

    // save app configuration if it's the first time the app runs
    $scope.initApp = function() {
      $scope.init();
    };

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
            LxNotificationService.notify('Login Successful!');
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

    $scope.save = function() {
      alert('Coming soon...');
    };

    $scope.logout = function() {
      $scope.init();
    };

    // set init variables
    $scope.init = function() {
        $scope.initialized = true;
        $scope.loggedIn = false;
        $scope.loginTLSButtonText = "Login";
        // display elements object
        $scope.show = {
        };

        // user model
        $scope.my = {
            config: {
                workspaces: [],
                availableWorkspaces: []
            }
        };

        // chosen storage URI for the app workspace
        $scope.storageURI = {};

    };

    $scope.app = {};
    $scope.initApp();

});
