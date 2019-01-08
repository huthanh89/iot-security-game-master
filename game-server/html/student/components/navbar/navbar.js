//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){

  let tour = new Tour({
    container: "body",
    debug:      true,
    orphan:     true,
    storage:    false,
    backdrop:   true,
    steps: [
      {
        element: "#gameboard",
        title:   "Gameboard",
        content: "This is the main GameBoard. This is where your missions, which are indicated by Circles, will be displayed. To start a mission, click on an unlocked Circle. Unlocked Circles are yellow, locked Circles are gray, and completed Circles are blue. And that's it! Click on the center circle of the rings to begin the game. Good luck and have fun!"
      },
      {
        element: "#chat",
        title:   "Chat",
        content: "In the Chat panel, you can send messages to other players. Several channels are available, such as a global chat and team chat.  You can also send messages directly to specific players or your instructor. Remember to keep your communications civil!"
      },
      {
        element: "#three",
        title: "Step 3",
        content: "Content for step 3"
      }
    ]
  });

  // Initialize the tour
  tour.init();

  $scope.tour = function(){
    tour.restart();
  };

  $scope.startTour = function(){
    tour.start();
  }

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('navbar', {
  templateUrl: 'student/components/navbar/navbar.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//