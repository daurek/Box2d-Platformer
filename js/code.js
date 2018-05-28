// Loader.js loads assets (images, sounds, json) and creates the levels
// Renderer.js draws everything (images, text)
// Input.js takes care of both Mouse and Keyboard input
// Camera.js takes care of camera movement
// Code.js takes care of game logic and loop

// Canvas and context
var canvas;
var ctx;
// PI value
var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

// FPS counter
var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// Sound volume
var soundVolume = 0.1;

// Game Camera
var camera;

// GameObject arrays
// Static objects
var platforms = [];
// Checkpoints (their body has to be deleted, like a trigger)
var checkpoints = [];
// Collectables (gems, they have to be removed from the array)
var collectables= [];
// Doors (they have to be removed from the array when the corresponding switch is activated)
var doors = [];

// Player spawn assigned later on the JSON file
var playerSpawn = {
  xPos : null,
  yPos : null
};

// Timer (countdown, the remaining time in seconds is added to the final score)
var timer = 03 + ":" + 00;
// Player gems + remaining time in seconds, this score goes to score.json when the level is finished
var finalScore;

// Game states
var states = {
    // Menu section (he can play, go to help or check the scores)
    onMenu: 0,
    // Help section (check what each item does)
    onHelp: 1,
    // Score section (check the highest scores, saved on json)
    onScore: 2,
    // Settings section
    onSettings: 3,
    // Pause, only during game, stops time, go to menu
    onPause: 4,
    // Playing section, can pause with Esc and reset with R
    onGame: 5,
    // Finish section that shows score and goes to menu
    onFinish: 6,
    // Levels section
    onLevels: 7
};

var currentLevel = 1;
var levelCount;

// Scores file
var jsonScoreFile = null;

// Player state (initial player state set to menu)
var playerState = states.onMenu;

var jsonFileScore = null;

// Sets refresh, gets canvas and context, loads media
function Init ()
{

    // Screen refresh
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    // Get canvas
    canvas = document.getElementById("my_canvas");

    // If the canvas has a context
    if (canvas.getContext)
    {
        // Get the 2D Context
        ctx = canvas.getContext('2d');
        // Load Sounds
        LoadSounds ();
        // Load Images
        LoadImages ();
        // When the player image loads start the game
        playerImg.onload = Start();

    }
}

// Start
function Start ()
{

    // Setup keyboard events
    SetupKeyboardEvents();

    // Setup mouse events
    SetupMouseEvents();

    // Initialize Box2D
    PreparePhysics(ctx);

    // Load levels json
    jsonLevels = JSON.parse(JSON.stringify(levels));
    levelCount = jsonLevels.length;

    for (var i = 1; i <= levelCount; i++)
    {
        var button = { name: i, xPos:  i/10, yPos:  0.1, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
        levelsButtons.push(button);
    }


    // Initialize background
    background.Start();

    // Initialize player
    player.Start();

    // Create and Initialize camera
    camera = new Camera(player);
    camera.Start();

    // Just for testing purposes (if the game is set to start on game then load everything)
    if (playerState == states.onGame) LoadGame();

    // First call to the game loop
    Loop();
}

// Loads the game data and creates the level, resets evethings
function LoadGame ()
{

    // Parses JSON to get data and build level
    ParseJSON(currentLevel);

    // Sets player to starting position
    Reset();

    // Starts countdown (timer to add to score later)
    StartTimer();
}

// Goes to the next level
function NextLevel()
{
    ClearLevel();
    currentLevel++;
    LoadGame();
}

// Resets the player to the player spawn (can be set by a checkpoint)
function Reset ()
{
  // Destroy players body, set it to the spawn point and respawn
  world.DestroyBody(player.body);
  player.position.x = playerSpawn.xPos;
  player.position.y = playerSpawn.yPos;
  player.Start();

}

// Cleans every array and body from the level, resets score and timer
function ClearLevel ()
{
    // Destroy bodies
    for (var i = 0; i < platforms.length; i++) {
        world.DestroyBody(platforms[i].body);
    }

    for (var i = 0; i < checkpoints.length; i++) {
        world.DestroyBody(checkpoints[i].body);
    }

    for (var i = 0; i < collectables.length; i++) {
        world.DestroyBody(collectables[i].body);
    }

    for (var i = 0; i < doors.length; i++) {
        world.DestroyBody(doors[i].body);
    }

    // Clear arrays
    platforms = [];
    checkpoints = [];
    collectables= [];
    doors = [];

    // Reset variables
    player.score = 0;
    timer = 03 + ":" + 00;

    player.position.x = 1000;
    player.position.y = 0;


}

// Game Loop
function Loop ()
{
    // Refreshes frames
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }

    // Transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // Update the input data
    input.update();

    // Game logic
    Update();

    // Draw the game
    Draw();

    // Reset input data
    input.postUpdate();
}

// Game Update
function Update ()
{
    // Depending on the player state
    switch (playerState)
    {
        case states.onPause:
            CheckPause ();
            break;
        case states.onGame:
            UpdateGame ();
            break;
        default:
            break;
    }

    // camera update
    camera.Update(deltaTime);
}

// Updates on game, not paused
function UpdateGame ()
{
    // update physics
    // Step(timestep , velocity iterations, position iterations)
    world.Step(deltaTime, 8, 3);
    world.ClearForces();

    // player input logic
    if (input.isKeyPressed(KEY_LEFT) || input.isKeyPressed(KEY_A))
        player.moveLeft = true;

    if (input.isKeyPressed(KEY_RIGHT) || input.isKeyPressed(KEY_D))
        player.moveRight = true;

    // Jump key
    if (input.isKeyPressed(KEY_UP) || input.isKeyPressed(KEY_W))
        player.Jump();

    // Shooting key
    if (input.isKeyPressed(KEY_Q))
        player.Shoot();

    // Reset game key
    if (input.isKeyPressed(KEY_R))
        Reset();

    // player update
    player.Update(deltaTime);

    // Updates the level objects
    UpdateLevel ();

    // Checking if the player paused the game
    CheckPause ();
}

// Updates when game is paused
function CheckPause ()
{
    // Toggles pause on press
    if (input.isKeyDown(KEY_ESCAPE))
    {
       if (playerState == states.onGame) playerState = states.onPause;
       else playerState = states.onGame;
    }
}

// Checks if an object has to be deleted or cleared
function UpdateLevel ()
{
    // If a door is marked as open then delete it (both body and array position (img))
    for (var i = 0; i < doors.length; i++) {
        if(doors[i].open)
        {
            world.DestroyBody(doors[i].body);
            doors.splice(i, 1);
            break;
        }
    }

    // If a collectible is marked as taken then delete it (both body and array position (img))
    for (var i = 0; i < collectables.length; i++) {
        if(collectables[i].taken)
        {
            world.DestroyBody(collectables[i].body);
            collectables.splice(i, 1);
            break;
        }
    }

    // If a checkpoint is marked as checked then delete the body but not the array position (we still want the image))
    for (var i = 0; i < checkpoints.length; i++) {
        if(checkpoints[i].checked && !checkpoints[i].destroyed)
        {
            checkpoints[i].destroyed = true;
            world.DestroyBody(checkpoints[i].body);
        }
    }
}

// Timer that calls itself (countdown)
function StartTimer()
{
    // If the game is on pause then recall the timer and return
    if(playerState == states.onPause)
    {
        setTimeout(StartTimer, 1000);
        return;
    }

    // Split the timer into 2 strings
    var timeArray = timer.split(/[:]+/);
    // Minutes
    var m = timeArray[0];
    // Get the seconds in formated string
    var s = CheckSecond((timeArray[1] - 1));
    // substract a minute if its 59 seconds
    if(s==59){m-=1}
    // stop the timer when its finished
    if(m<0) return;
    // Update timer string
    timer = m + ":" + s;
    // If the game is on game (to delete timers when out of game))
    if(playerState == states.onGame)
    // Recall timer in a second
    setTimeout(StartTimer, 1000);
}

// Return formated second
function CheckSecond(sec)
{
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"}; // go around to 59
    return sec; // return the second
}

// Loads, plays and stops a sound
function Sound (src)
{
    // Loads sound
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    //this.sound.volume = soundVolume;
    // Plays sound
    this.play = function(){
        this.sound.volume = soundVolume;
        this.sound.play();
    }

    // Stops sound
    this.stop = function(){
        this.sound.pause();
    }
}

// FB.login(function (response)
// {
//     ValidateUser();
// }, {scope: 'public_profile, email '});
//
// function ValidateUser ()
// {
//     FB.getLoginStatus(function(response)
//     {
//         statusChangeCallback(response);
//     });
// }
