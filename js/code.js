// Canvas
var canvas;
// Canvas Context
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

// Images references
var playerImg, floorImg, mountainImg, boxImg, bounceImg, ladderImg, spikesImg, doorImg, switchImg, flagImg, gemImg, padImg, greyImg, endFlagImg;
// Sounds references
var collectSound, bounceSound, deathSound, finishSound, jumpSound, switchSound, menuSound, checkpointSound;

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
    // Pause, only during game, stops time, go to menu
    onPause: 3,
    // Playing section, can pause with Esc and reset with R
    onGame: 4,
    // Finish section that shows score and goes to menu
    onFinish: 5
};

// Scores file
var jsonScoreFile = null;

// Player state (initial player state set to menu)
var playerState = states.onMenu;

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

// Loads sounds from media/sound
function LoadSounds ()
{
    collectSound = new Sound("./media/sounds/collectSound.wav");
    bounceSound = new Sound("./media/sounds/bounceSound.wav");
    jumpSound = new Sound("./media/sounds/jumpSound.wav");
    deathSound = new Sound("./media/sounds/deathSound.wav");
    switchSound = new Sound("./media/sounds/switchSound.wav");
    finishSound = new Sound("./media/sounds/finishSound.wav");
    menuSound = new Sound("./media/sounds/menuSound.wav");
    checkpointSound = new Sound("./media/sounds/checkpointSound.wav");
}

// Loads images from media/images
function LoadImages ()
{
    floorImg = new Image();
    floorImg.src = "./media/images/wall.png";

    mountainImg = new Image();
    mountainImg.src = "./media/images/mountain.png";

    boxImg = new Image();
    boxImg.src = "./media/images/box.png";

    bounceImg = new Image();
    bounceImg.src = "./media/images/bouncing.png";

    ladderImg = new Image();
    ladderImg.src = "./media/images/ladder.png";

    spikesImg = new Image();
    spikesImg.src = "./media/images/spikes.png";

    doorImg = new Image();
    doorImg.src = "./media/images/door.png";

    switchImg = new Image();
    switchImg.src = "./media/images/lever.png";

    flagImg = new Image();
    flagImg.src = "./media/images/flag.png";

    gemImg = new Image();
    gemImg.src = "./media/images/gem.png";

    padImg = new Image();
    padImg.src = "./media/images/pad.png";

    greyImg = new Image();
    greyImg.src = "./media/images/grey.png";

    endFlagImg = new Image();
    endFlagImg.src = "./media/images/endFlag.png";

    playerImg = new Image();
    playerImg.src = "./media/images/player_spritesheet.png";
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

    // Initialize background
    background.Start();

    // Initialize player
    player.Start();

    // Create and Initialize camera
    camera = new Camera(player);
    camera.Start();

    // First call to the game loop
    Loop();
}

// Loads the game data and creates the level, resets evethings
function LoadGame ()
{
    // Parses JSON to get data and build level
    ParseJSON();

    // Sets player to starting position
    Reset();

    // Starts countdown (timer to add to score later)
    StartTimer();
}

// Parses the json file level to create the level
function ParseJSON ()
{
    // Get json file as a single string
    var jsonFile = JSON.stringify(level);
    // Parses that string
    var levelData = JSON.parse(jsonFile);

    // Creates level from parsed json going through every element of that json object
    for (var i = 0; i < levelData.length; i++)
    {
        // Depending on the type set on the json it creates different objects on given coordinates, size and additional data
        switch (levelData[i].type) {
            // 4 bounding wall (2 upper, 2 sides)
            case "wall":
                var wall = NewWall({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height}, levelData[i].friction);
                wall.Start();
                platforms.push(wall);
                break;
            // Normal platforms
            case "floor":
                var floor = NewFloor({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                floor.Start();
                platforms.push(floor);
                break;
            // Blocks without friction (so the player can't climb them)
            case "block":
                var block = NewBlock({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                block.Start();
                platforms.push(block);
                break;
            // Boxes with friction so the player can push them, kinetic objects
            case "box":
                var box = NewBox({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                box.Start();
                platforms.push(box);
                break;
            // Switches open doors with the same id
            case "switch":
                var lever = NewSwitch({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height}, levelData[i].id );
                lever.Start();
                platforms.push(lever);
                break;
            // Doors are opened when the corresponding switch is activated
            case "door":
                var door = NewDoor({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height}, levelData[i].id );
                door.Start();
                doors.push(door);
                break;
            // Spikes that kill the player on contact
            case "spikes":
                var spikes = NewSpikes({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                spikes.Start();
                platforms.push(spikes);
                break;
            // Platforms with high restitution that allow the player to bounce
            case "bounce":
                var bounce = NewBounce({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                bounce.Start();
                platforms.push(bounce);
                break;
            // Ladders with friction that allow the player to climb them due
            case "ladder":
                var ladder = NewLadder({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                ladder.Start();
                platforms.push(ladder);
                break;
            // Only one playerspawn (initial spawn)
            case "playerSpawn":
                playerSpawn.xPos = levelData[i].x;
                playerSpawn.yPos = levelData[i].y;
                break;
            // Flag that sets the player spawn to its current position
            case "checkpoint":
                var checkpoint = NewCheckpoint({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                checkpoint.Start();
                checkpoints.push(checkpoint);
                break;
            // Collectible that adds points on contact
            case "gem":
                var gem = NewGem({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                gem.Start();
                collectables.push(gem);
                break;
            // Only one end (player finishes level here)
            case "endPoint":
                var endPoint = NewEndPoint({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                endPoint.Start();
                platforms.push(endPoint);
                break;
            default:
                break;
        }
    }
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

    player.position.x = 0;
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
    if (input.isKeyPressed(KEY_LEFT))
        player.moveLeft = true;

    if (input.isKeyPressed(KEY_RIGHT))
        player.moveRight = true;

    // Jump key
    if (input.isKeyPressed(KEY_UP))
        player.Jump();

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

// Draws everything depending on the player state
function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background (with the parallax)
    background.Draw(ctx);

    // camera transform: translate
    ctx.save();
    ctx.translate(-camera.position.x, -camera.position.y);

    // Depending on the player state
    switch (playerState)
    {
        case states.onMenu:
            DrawMenu ();
            break;
        case states.onHelp:
            DrawHelp ();
            break;
        case states.onScore:
            DrawScore ();
            break;
        // We draw the game behind the pause section
        case states.onPause:
            DrawGame ();
            DrawPause ();
            break;
        case states.onGame:
            DrawGame ();
            break;
        // We draw the game behind the finish section
        case states.onFinish:
            DrawGame ();
            DrawFinish ();
            break;
        default:
            break;
    }
}

// Draws the game
function DrawGame ()
{
    // Debug draw (dont need it anymore)
    // DrawWorld(world);

    // draw the platforms
    for (var i = 0; i < platforms.length; i++)
        platforms[i].Draw(ctx);

    // draw the checkpoints
    for (var i = 0; i < checkpoints.length; i++)
        checkpoints[i].Draw(ctx);

    // draw the doors
    for (var i = 0; i < doors.length; i++)
        doors[i].Draw(ctx);

    // draw the collectables
    for (var i = 0; i < collectables.length; i++)
        collectables[i].Draw(ctx);

    // draw the player
    player.Draw(ctx);

    // camera transform: restore
    ctx.restore();


    // draw the player score and the countdown timer
    ctx.fillStyle = "cyan";
    ctx.font = "900 30px CaviarDreams";
    ctx.fillText('Gems: ' + player.score, canvas.width * 0.87, 30);
    ctx.fillText('Countdown: ' + timer, canvas.width * 0.65, 30);

    // draw the FPS
    ctx.fillStyle = "white";
    ctx.font = "600 10px CaviarDreams";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
}

// Draws the world on debug
function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

// Draws the pause section
function DrawPause ()
{
    // white screen
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;

    // Pause text
    ctx.fillStyle = "black";
    ctx.font = "700 40px CaviarDreams";
    ctx.fillText("Pause", canvas.width * 0.435, canvas.height * 0.3);

    // Hover on menu text, sets the text color
    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.5, 75, 30)) ctx.fillStyle = "turquoise";

    // Menu text
    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Menu", canvas.width * 0.45, canvas.height * 0.5);
}

// Draws the menu section
function DrawMenu ()
{
    ctx.restore();

    // Game Title
    ctx.fillStyle = "white";
    ctx.font = "700 70px CaviarDreams";
    ctx.fillText("Skylight", canvas.width * 0.38, canvas.height * 0.2);

    // Hover on play
    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.5, 65, 30)) ctx.fillStyle = "turquoise";

    ctx.font = "700 30px CaviarDreams";
    // Play Text
    ctx.fillText("Play", canvas.width * 0.45, canvas.height * 0.5);

    // Hover on help
    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.6, 65, 30)) ctx.fillStyle = "turquoise";
    else ctx.fillStyle = "white";

    // Help Text
    ctx.fillText("Help", canvas.width * 0.45, canvas.height * 0.6);

    // Hover on scores
    if(MouseCheck(canvas.width * 0.44 , canvas.height * 0.7, 90, 30)) ctx.fillStyle = "turquoise";
    else ctx.fillStyle = "white";

    // Scores Text
    ctx.fillText("Scores", canvas.width * 0.44, canvas.height * 0.7);
}

// Draws help section
function DrawHelp ()
{
    ctx.fillStyle = "white";
    ctx.font = "700 30px CaviarDreams";

    // Move text and images
    ctx.fillText("Move and Jump with the arrow keys or WASD", canvas.width * 0.25, canvas.height * 0.1);
    ctx.drawImage(padImg, canvas.width * 0.2, canvas.height * 0.04, 50, 50);
    ctx.drawImage(padImg, canvas.width * 0.75, canvas.height * 0.04, 50, 50);

    // Boxes text and images
    ctx.fillText("Push boxes", canvas.width * 0.45, canvas.height * 0.2);
    ctx.drawImage(boxImg, canvas.width * 0.4, canvas.height * 0.13, 50, 50);
    ctx.drawImage(boxImg, canvas.width * 0.58, canvas.height * 0.13, 50, 50);

    // Bouncing platforms text and images
    ctx.fillText("Bounce on this platforms", canvas.width * 0.38, canvas.height * 0.3);
    ctx.drawImage(bounceImg, canvas.width * 0.38, canvas.height * 0.32, 350, 10);

    // Doors and switches text and images
    ctx.fillText("Open doors with levers", canvas.width * 0.39, canvas.height * 0.4);
    ctx.drawImage(switchImg, canvas.width * 0.33, canvas.height * 0.33, 50, 50);
    ctx.drawImage(doorImg, canvas.width * 0.69, canvas.height * 0.33, 30, 70);

    // Ladders text and images
    ctx.fillText("Climb up ladders", canvas.width * 0.42, canvas.height * 0.5);
    ctx.drawImage(ladderImg, canvas.width * 0.37, canvas.height * 0.42, 50, 70);
    ctx.drawImage(ladderImg, canvas.width * 0.63, canvas.height * 0.42, 50, 70);

    // Spikes text and images
    ctx.fillText("Don't fall into the spikes", canvas.width * 0.39, canvas.height * 0.6);
    ctx.drawImage(spikesImg, canvas.width * 0.38, canvas.height * 0.6, 350, 30);

    // Gems text and images
    ctx.fillText("Collect gems to gain score", canvas.width * 0.37, canvas.height * 0.7);
    ctx.drawImage(gemImg, canvas.width * 0.33, canvas.height * 0.64, 50, 50);
    ctx.drawImage(gemImg, canvas.width * 0.67, canvas.height * 0.64, 50, 50);

    // Checkpoints text and images
    ctx.fillText("Touch Checkpoints to respawn there when dead", canvas.width * 0.25, canvas.height * 0.8);
    ctx.drawImage(flagImg, canvas.width * 0.2, canvas.height * 0.75, 50, 70);
    ctx.drawImage(flagImg, canvas.width * 0.8, canvas.height * 0.75, 50, 70);

    // Hover on back text
    if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30)) ctx.fillStyle = "turquoise";

    // Back text
    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Back", canvas.width * 0.48, canvas.height * 0.95);

    // Keys notes
    ctx.fillStyle = "turquoise";
    ctx.fillText("Press R to respawn", canvas.width * 0.05, canvas.height * 0.95);
    ctx.fillText("Press Esc to pause the game", canvas.width * 0.65, canvas.height * 0.95);

}

// Draws the finish section
function DrawFinish ()
{
    // white screen
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;

    // Final score text
    ctx.fillStyle = "black";
    ctx.font = "700 40px CaviarDreams";
    ctx.fillText("Gems + Time Left in seconds", canvas.width * 0.3, canvas.height * 0.4);
    ctx.fillText("Score = " + finalScore, canvas.width * 0.3, canvas.height * 0.5);

    // Hover menu back text
    if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30)) ctx.fillStyle = "turquoise";

    // Menu text
    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Menu", canvas.width * 0.48, canvas.height * 0.95);
}

// Draws the scores section
function DrawScore ()
{
    // When score fill variable is null
    if(jsonScoreFile == null)
    {
        // Get the parsed score
        jsonScoreFile = ParseScore ();

        if (jsonScoreFile == null)
        {
            jsonScoreFile = JSON.parse(window.localStorage.getItem('../json/score.json'));
        }

    }

    // Sorts by score
    jsonScoreFile.sort(function(a, b) {
        return a.score < b.score;
    });
    jsonScoreFile.sort();

    // Get lenght
    var count = Object.keys(jsonScoreFile).length;

    // If the json file has at least a score saved
    if(count > 0)
    {
        ctx.fillText("Rank -  Date - Score", canvas.width * 0.1, canvas.height * 0.1  );
        // Loop through every score until limit has been reached (7 because that's the space we have)
        for (var i = 0; i < count && i < 7; i++)
        {
            // Get time and score to display it one after the other
            ctx.fillText(i+1 + " - " + jsonScoreFile[i].time + "   -   " + jsonScoreFile[i].score, canvas.width * 0.1, canvas.height * ( 0.1 * i + 0.2)   );
        }
    }
    // if no scores then display that no scores have been saved
    else ctx.fillText( "No scores saved", canvas.width * 0.4, canvas.height * 0.5   );

    // Back text hover
    if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30)) ctx.fillStyle = "turquoise";

    // Back text
    ctx.fillText("Back", canvas.width * 0.48, canvas.height * 0.95);
}

// Returns parsed score from file
function ParseScore ()
{
    return JSON.parse(localStorage.getItem('../json/score.json'));
}

// Creates a score and puts it into the json file
function CreateScore (newScore)
{
    // Get the json object
    var jsonFile = ParseScore ();

    // Get Date (using it to note down the time in which the player completed the level)
    var d = new Date();

    // Create a score with the time and the provided new score
    var obj= {
        time:  d.getHours() + ":" + d.getMinutes() + "  " + d.getDate() + "/" + d.getMonth() + "/" +  d.getFullYear(),
        score: newScore
    };

    // Push it into the json object
    jsonFile.push(obj);

    // Pushes the json object into the file
    localStorage.setItem('../json/score.json', JSON.stringify(jsonFile));

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

    // Plays sound
    this.play = function(){
        this.sound.play();
    }

    // Stops sound
    this.stop = function(){
        this.sound.pause();
    }
}
