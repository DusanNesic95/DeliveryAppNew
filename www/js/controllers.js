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
  $.getJSON('//ip-api.com/json?callback=?', function(data) {
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
      console.log(object);
      $.post('http://dusannesicdevelopment.sytes.net/deliveryapp/addUserService.php', JSON.stringify(object), function(response) {
        if (response != null) {
          localStorage.setItem('array', response);
          window.location="#/tab/account"
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
