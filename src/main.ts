import Game from "./Wolfie2D/Loop/Game";
import SplashScreen from "./game/Scenes/SplashScreen";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 214, g: 179, b: 179},   // The color the game clears to
        inputs: [
            {name: "forward", keys: ["w"]},
            {name: "backward", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "interact", keys: ["j"]},
            {name: "place", keys: ["k"]},
            {name: "el1", keys: ["1"]},
            {name: "el2", keys: ["2"]},
            {name: "el3", keys: ["3"]},
            {name: "el4", keys: ["4"]},
            {name: "el5", keys: ["5"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();

function runTests(){};