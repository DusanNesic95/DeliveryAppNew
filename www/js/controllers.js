angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {
  $("#firstOpt").click(function() {
    localStorage.setItem('type', 'deliver');
    window.location="#/chats";
  });

  $("#secondOpt").click(function() {
    localStorage.setItem('type', 'receiver');
    window.location="#/chats";
  });
})

.controller('ChatsCtrl', function($scope) {
  var lat = "";
  var long = "";
  $.getJSON('//ip-api.com/json?callback=?', function(data) {
    lat = data.lat;
    long = data.long;
  });

  console.log(lat);
  console.log(long);

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
        latitude : $scope.lat,
        longitude : $scope.long,
        role : type
      }

      alert($scope.lat);
      alert($scope.long);

      $.post('http://http://dusannesicdevelopment.sytes.net/deliveryapp/addUserService.php', JSON.stringify(object), function(response) {
        alert("response");
        if (response != null) {
          localStorage.setItem('array', response);
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
