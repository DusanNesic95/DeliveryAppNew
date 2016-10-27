var postUrlProduction = "http://dusannesicdevelopment.sytes.net/deliveryapp/addUserService.php";
var postUrlDevelopment = "http://localhost:90/deliveryapp/addUserService.php";

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {
  $("#firstOpt").click(function() {
    localStorage.setItem('type', 'customer');
    window.location="#/chats";
  });

  $("#secondOpt").click(function() {
    localStorage.setItem('type', 'deliveryBoy');
    window.location="#/chats";
  });

  $(function () {
    var body = $('#logoFirst');
    var backgrounds = [
      'url(img/soda1.png)',
      'url(img/water.png)',
      'url(img/chips.png)',
      'url(img/chicken.png)',
      'url(img/ice.png)',
      'url(img/cola.png)',
      'url(img/mix.png)',
      'url(img/peanut.png)',
      'url(img/sona.png)',
      'url(img/meat.png)'];
    var current = 0;

    function nextBackground() {
        body.css(
            'background',
        backgrounds[current = ++current % backgrounds.length]);

        setTimeout(nextBackground, 5000);
    }
    setTimeout(nextBackground, 5000);
    body.css('background', backgrounds[0]);
  });
})

.controller('ChatsCtrl', function($scope) {
  $scope.bgimg = "img/zutapozadina.png";
  $.getJSON('http://ip-api.com/json?callback=?', function(data) {
    localStorage.setItem('lat', data.lat);
    localStorage.setItem('long', data.lon);
  });

  $("#submit").click(function() {
    var type = localStorage.getItem('type');
    name = $("#name").val();
    number = $("#number").val();
    if (name == "" || number == "") {
      $("#emptyFields").delay(200).hide(0, function() {
          $("#emptyFields").fadeIn().delay(1300).fadeOut(300);
      });
    } else {
      var object = {
        name : name,
        number : number,
        latitude : localStorage.getItem('lat'),
        longitude : localStorage.getItem('long'),
        role : type
      }
      $.post(postUrlProduction, JSON.stringify(object), function(response) {
        if (response != null) {
          localStorage.setItem('currentUser', JSON.stringify(object));
          localStorage.setItem('array', response);
          if (type == "deliveryBoy") {
            window.location="#/tab/account";
          } else if (type == "customer") {
            window.location="#/tab/list";
          }
        } else {
          alert("Internet connection problem!");
        }
      });
    }
  });

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ListCtrl', function($scope) {
  $scope.object = JSON.parse(localStorage.getItem('currentUser'));
  $scope.lat = parseFloat($scope.object.latitude);
  $scope.long = parseFloat($scope.object.longitude);
  var map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: $scope.lat, lng: $scope.long},
    zoom: 10
  });
  var center = new google.maps.LatLng($scope.lat, $scope.long);
  map.setCenter(center);

  $scope.doRefresh = function() {
    if ($scope.object != null) {
      $.post(postUrlProduction, JSON.stringify($scope.object), function(response) {
        if (response != null) {
          localStorage.setItem('array', response);
          window.location.reload();
        } else {
          alert("Internet connection problem!");
        }
      });
    }
  }

  $scope.bgimg = "img/zutapozadina.png";
  $scope.settings = {
    enableFriends: true
  };
  setTimeout(function() {
    var data = localStorage.getItem('array');
    if (data != null && data != "") {
      var array = JSON.parse(data);
      var trHTML = '';
      for (var i = 0; i < array.length; i++) {
        trHTML += '<tr><td>' + array[i].name + '</td><td>' + array[i].number + '</td></tr>';
        var posLat = parseFloat(array[i].latitude);
        var posLng = parseFloat(array[i].longitude);
        var position = {lat: posLat, lng: posLng};
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: array[i].name
        });
      }
      $('#personTable').append(trHTML);
    }
    localStorage.setItem('array', "");
  }, 1000);

  $("#listView").click(function() {
    $("#map").hide();
    $(this).hide();
    $("#mapView").show();
    $("#personsList").show();
  });

  $("#mapView").click(function() {
    $("#personsList").hide();
    $(this).hide();
    $("#map").show();
    google.maps.event.trigger(map, 'resize');
    $("#listView").show();
    $("#listView").css("margin-left: 5% !important;");
  });
})

.controller('AccountCtrl', function($scope) {
  $scope.object = JSON.parse(localStorage.getItem('currentUser'));
  $scope.lat = parseFloat($scope.object.latitude);
  $scope.long = parseFloat($scope.object.longitude);
  var map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: $scope.lat, lng: $scope.long},
    zoom: 10
  });
  var center = new google.maps.LatLng($scope.lat, $scope.long);
  map.setCenter(center);

  $scope.doRefresh = function() {
    if ($scope.object != null) {
      $.post(postUrlProduction, JSON.stringify($scope.object), function(response) {
        if (response != null) {
          localStorage.setItem('array', response);
          window.location.reload();
        } else {
          alert("Internet connection problem!");
        }
      });
    }
  }

  $scope.bgimg = "img/zutapozadina.png";
  $scope.settings = {
    enableFriends: true
  };
  setTimeout(function() {
    var data = localStorage.getItem('array');
    if (data != null && data != "") {
      var array = JSON.parse(data);
      var trHTML = '';
      for (var i = 0; i < array.length; i++) {
        trHTML += '<tr><td>' + array[i].name + '</td><td>' + array[i].number + '</td></tr>';
        var posLat = parseFloat(array[i].latitude);
        var posLng = parseFloat(array[i].longitude);
        var position = {lat: posLat, lng: posLng};
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: array[i].name
        });
      }
      $('#personTable').append(trHTML);
    }
    localStorage.setItem('array', "");
  }, 1000);

  $("#listView").click(function() {
    $("#map").hide();
    $(this).hide();
    $("#mapView").show();
    $("#personsList").show();
  });

  $("#mapView").click(function() {
    $("#personsList").hide();
    $(this).hide();
    $("#map").show();
    google.maps.event.trigger(map, 'resize');
    $("#listView").show();
    $("#listView").css("margin-left: 5% !important;");
  });
});
