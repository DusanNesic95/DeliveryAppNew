var postUrlProduction = "http://dusannesicdevelopment.sytes.net/deliveryapp/addUserService.php";
var postUrlDevelopment = "http://192.168.0.108/deliveryapp/addUserService.php";
var postUrlMessageProduction = "http://dusannesicdevelopment.sytes.net/deliveryapp/addMessageService.php";
var postUrlMessageDevelopment = "http://192.168.0.108/deliveryapp/addMessageService.php";
var postUrlGetMessagesProduction = "http://dusannesicdevelopment.sytes.net/deliveryapp/getMessages.php";
var postUrlGetMessagesDevelopment = "http://192.168.0.108/deliveryapp/getMessages.php";

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
};

function sendMessage(nameTo, numberTo) {
  localStorage.setItem('nameTo', nameTo);
  localStorage.setItem('numberTo', numberTo);
  window.location="#/tab/inbox";
};

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
      localStorage.setItem('nameFrom', name);
      localStorage.setItem('numberFrom', number);
      var object = {
        username : name,
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

.controller('InboxCtrl', function($scope, $stateParams) {
  $scope.bgimg = "img/zutapozadina.png";
  $scope.nameFrom = localStorage.getItem('nameFrom');
  $scope.numberFrom = localStorage.getItem('numberFrom');
  $scope.nameTo = localStorage.getItem('nameTo');
  $scope.numberTo = localStorage.getItem('numberTo');

  $("#sendBtn").click(function() {
    var textMessage = $("#inputArea").val();
    var object = {
      nameFrom : $scope.nameFrom,
      numberFrom : $scope.numberFrom,
      nameTo : $scope.nameTo,
      numberTo : $scope.numberTo,
      text : textMessage
    }
    $.post(postUrlMessageProduction, JSON.stringify(object), function(response) {
      $("#inputArea").val("");
      window.location="#/tab/messages";
    });
  });
})

.controller('MessagesCtrl', function($scope, $stateParams) {
  $scope.bgimg = "img/zutapozadina.png";

  var name = localStorage.getItem('nameFrom');
  var number = localStorage.getItem('numberFrom');
  var object = {
    nameTo : name,
    numberTo : number
  }
  $.post(postUrlGetMessagesProduction, JSON.stringify(object), function(response) {
    if (response != null) {
      var array = JSON.parse(response)
      if (array.length != 0) {
        for (var i = 0; i < array.length; i++) {
          var message = '';
          message += '<div class="eachMessage"><p class="messageName">' + array[i].nameFrom + '</p><p class="messageNumber">' + array[i].numberFrom + '</p><p class="messageText">' + array[i].text + '</p></div>';
          $('#messagesList').append(message);
        }
      } else {
        $("#noMessages").show();
      }
    } else {
      alert("Internet connection problem!");
    }
  });
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

  $scope.deg2rad = function(deg) {
    return deg * (Math.PI/180)
  };

  $scope.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
     var R = 6371; // Radius of the earth in km
     var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
     var dLon = $scope.deg2rad(lon2-lon1);
     var a =
       Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) *
       Math.sin(dLon/2) * Math.sin(dLon/2)
       ;
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     var d = R * c; // Distance in km
     return d;
  };

  setTimeout(function() {
    var data = localStorage.getItem('array');
    if (data != null && data != "") {
      var array = JSON.parse(data);
      var trHTML = '';
      for (var i = 0; i < array.length; i++) {
        var distanceDecimal = $scope.getDistanceFromLatLonInKm($scope.lat, $scope.long, array[i].latitude, array[i].longitude);
        var distance = Math.round(distanceDecimal * 100) / 100;
        var username = "'" + array[i].username + "'";
        var number = array[i].number;
        trHTML += '<tr><td>' + array[i].username + '</td><td>' + number + '</td><td>' + distance + '</td><td><a onclick="sendMessage(' + username + ',' + number + ')" style="text-decoration: none !important; color: rgb(164, 153, 123) !important;">Send</a></td></tr>';
        var posLat = parseFloat(array[i].latitude);
        var posLng = parseFloat(array[i].longitude);
        var position = {lat: posLat, lng: posLng};
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: array[i].username
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

  $("#inboxBtn").click(function() {
    window.location="#/tab/messages";
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

  $scope.deg2rad = function(deg) {
    return deg * (Math.PI/180)
  }

  $scope.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
     var R = 6371; // Radius of the earth in km
     var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
     var dLon = $scope.deg2rad(lon2-lon1);
     var a =
       Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) *
       Math.sin(dLon/2) * Math.sin(dLon/2)
       ;
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     var d = R * c; // Distance in km
     return d;
  }

  setTimeout(function() {
    var data = localStorage.getItem('array');
    if (data != null && data != "") {
      var array = JSON.parse(data);
      var trHTML = '';
      for (var i = 0; i < array.length; i++) {
        var distanceDecimal = $scope.getDistanceFromLatLonInKm($scope.lat, $scope.long, array[i].latitude, array[i].longitude);
        var distance = Math.round(distanceDecimal * 100) / 100;
        var username = "'" + array[i].username + "'";
        var number = array[i].number;
        trHTML += '<tr><td>' + array[i].username + '</td><td>' + number + '</td><td>' + distance + '</td><td><a onclick="sendMessage(' + username + ',' + number + ')" style="text-decoration: none !important; color: rgb(164, 153, 123) !important;">Send</a></td></tr>';
        var posLat = parseFloat(array[i].latitude);
        var posLng = parseFloat(array[i].longitude);
        var position = {lat: posLat, lng: posLng};
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: array[i].username
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

  $("#inboxBtn").click(function() {
    window.location="#/tab/messages";
  });
});
