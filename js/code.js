
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// images references
var playerImg, floorImg, mountainImg, boxImg, bounceImg, ladderImg, spikesImg, doorImg, switchImg, flagImg, gemImg, padImg;

// game camera
var camera;

// game objects
var platforms = [];
var checkpoints = [];
var collectables= [];
var doors = [];

var playerSpawn = {
  xPos : null,
  yPos : null
};

var reseting = false;
var onMenu = true;
var onPause = false;
var onHelp = false;

function Init ()
{
    // preparamos la variable para el refresco de la pantalla
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    canvas = document.getElementById("my_canvas");

    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        floorImg = new Image();
        floorImg.src = "./media/wall.png";

        mountainImg = new Image();
        mountainImg.src = "./media/mountain.png";

        boxImg = new Image();
        boxImg.src = "./media/box.png";

        bounceImg = new Image();
        bounceImg.src = "./media/bouncing.png";

        ladderImg = new Image();
        ladderImg.src = "./media/ladder.png";

        spikesImg = new Image();
        spikesImg.src = "./media/spikes.png";

        doorImg = new Image();
        doorImg.src = "./media/door.png";

        switchImg = new Image();
        switchImg.src = "./media/lever.png";

        flagImg = new Image();
        flagImg.src = "./media/flag.png";

        gemImg = new Image();
        gemImg.src = "./media/gem.png";

        padImg = new Image();
        padImg.src = "./media/pad.png";

        playerImg = new Image();
        playerImg.src = "./media/player_spritesheet.png";
        playerImg.onload = Start();
    }
}

function Start ()
{
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();

    // initialize Box2D
    PreparePhysics(ctx);

    // parse json to load level from data
    //ParseJSON();


    // init background
    background.Start();

    player.Start();

    // init camera
    camera = new Camera(player);
    camera.Start();

    // first call to the game loop
    Loop();
}

function LoadGame ()
{
    ParseJSON();

    Reset();

}

function ParseJSON ()
{
    // Get json file as a single string
    var jsonFile = JSON.stringify(level);
    //
    var levelData = JSON.parse(jsonFile);

    for (var i = 0; i < levelData.length; i++)
    {
        switch (levelData[i].type) {
            case "floor":
                var floor = NewFloor({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                floor.Start();
                platforms.push(floor);
                break;
            case "block":
                var block = NewBlock({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                block.Start();
                platforms.push(block);
                break;
            case "box":
                var box = NewBox({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                box.Start();
                platforms.push(box);
                break;
            case "switch":
                var lever = NewSwitch({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height}, levelData[i].id );
                lever.Start();
                platforms.push(lever);
                break;
            case "door":
                var door = NewDoor({x:  levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height}, levelData[i].id );
                door.Start();
                doors.push(door);
                break;
            case "spikes":
                var spikes = NewSpikes({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                spikes.Start();
                platforms.push(spikes);
                break;
            case "bounce":
                var bounce = NewBounce({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                bounce.Start();
                platforms.push(bounce);
                break;
            case "ladder":
                var ladder = NewLadder({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height} );
                ladder.Start();
                platforms.push(ladder);
                break;
            case "playerSpawn":
                playerSpawn.xPos = levelData[i].x;
                playerSpawn.yPos = levelData[i].y;
                break;
            case "checkpoint":
                var checkpoint = NewCheckpoint({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                checkpoint.Start();
                checkpoints.push(checkpoint);
                break;
            case "gem":
                var gem = NewGem({x: levelData[i].x, y: levelData[i].y, width: levelData[i].width, height: levelData[i].height});
                gem.Start();
                collectables.push(gem);
                break;
            default:
                break;
        }
    }
}

function Reset ()
{
  // Destroy players body, set it to the spawn point and respawn
  world.DestroyBody(player.body);
  player.position.x = playerSpawn.xPos;
  player.position.y = playerSpawn.yPos;
  player.Start();

  // Reduce score everytime player dies
  if(player.score > 0)
  {
      player.score -= 10;
  }
}

function ClearLevel ()
{
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

    platforms = [];
    checkpoints = [];
    collectables= [];
    doors = [];
    player.score = 0;


}

function Loop ()
{
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

    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // update the input data
    input.update();

    // Game logic -------------------
    Update();

    // Draw the game ----------------
    Draw();

    // reset input data
    input.postUpdate();
}

function Update ()
{
    if(!onMenu && !onHelp)
    {
        if(!onPause)
        {
            // update physics
            // Step(timestep , velocity iterations, position iterations)
            world.Step(deltaTime, 8, 3);
            world.ClearForces();

            // player logic
            if (input.isKeyPressed(KEY_LEFT))
                player.moveLeft = true;

            if (input.isKeyPressed(KEY_RIGHT))
                player.moveRight = true;

            if (input.isKeyPressed(KEY_UP))
                player.Jump();

            if (input.isKeyPressed(KEY_R))
                Reset();

            // player update
            player.Update(deltaTime);
            // camera update
            camera.Update(deltaTime);

            UpdateLevel ();
        }

        if (input.isKeyDown(KEY_ESCAPE))
        {
            if (!onPause) onPause = true;
            else onPause = false;
        }
    }

}

function UpdateLevel ()
{
    for (var i = 0; i < doors.length; i++) {
        if(doors[i].open)
        {
            world.DestroyBody(doors[i].body);
            doors.splice(i, 1);
            break;
        }
    }

    for (var i = 0; i < collectables.length; i++) {
        if(collectables[i].taken)
        {
            world.DestroyBody(collectables[i].body);
            collectables.splice(i, 1);
            break;
        }
    }

    for (var i = 0; i < checkpoints.length; i++) {
        if(checkpoints[i].checked && !checkpoints[i].destroyed)
        {
            checkpoints[i].destroyed = true;
            world.DestroyBody(checkpoints[i].body);
        }
    }
}


function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background (with the parallax)
    background.Draw(ctx);

    // camera transform: translate
    ctx.save();
    ctx.translate(-camera.position.x, -camera.position.y);


    // Playing the game
    if(!onMenu && !onHelp)
    {
        // draw the box2d world
        DrawWorld(world);

        DrawGame ();

        if(onPause)
        {
            DrawPause ();
        }

    }
    // On Menu
    else if(onMenu)
    {
        DrawMenu ();
    }
    else
    {
        DrawHelp ();

    }

}

function DrawGame ()
{
    // draw the platforms
    for (var i = 0; i < platforms.length; i++)
        platforms[i].Draw(ctx);

    for (var i = 0; i < checkpoints.length; i++)
        checkpoints[i].Draw(ctx);

    for (var i = 0; i < doors.length; i++)
        doors[i].Draw(ctx);

    for (var i = 0; i < collectables.length; i++)
        collectables[i].Draw(ctx);

    // draw the player
    player.Draw(ctx);

    // camera transform: restore
    ctx.restore();

    // draw the player score
    ctx.fillStyle = "cyan";
    ctx.font = "900 30px CaviarDreams";
    ctx.fillText('Gems: ' + player.score, canvas.width * 0.87, 30);

    // draw the FPS
    ctx.fillStyle = "white";
    ctx.font = "600 10px CaviarDreams";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
}

function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

function DrawPause ()
{
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "turquoise";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "black";
    ctx.font = "700 40px CaviarDreams";
    ctx.fillText("Pause", canvas.width * 0.435, canvas.height * 0.3);

    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.5, 75, 30)) ctx.fillStyle = "yellow";
    else ctx.fillStyle = "black";

    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Menu", canvas.width * 0.45, canvas.height * 0.5);
}

function DrawMenu ()
{
    ctx.restore();

    ctx.fillStyle = "white";
    ctx.font = "700 70px CaviarDreams";
    ctx.fillText("Skylight", canvas.width * 0.38, canvas.height * 0.2);

    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.5, 65, 30)) ctx.fillStyle = "turquoise";
    else ctx.fillStyle = "white";

    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Play", canvas.width * 0.45, canvas.height * 0.5);

    if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.6, 65, 30)) ctx.fillStyle = "turquoise";
    else ctx.fillStyle = "white";

    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Help", canvas.width * 0.45, canvas.height * 0.6);
}

function DrawHelp ()
{
    ctx.fillStyle = "white";
    ctx.font = "700 30px CaviarDreams";

    ctx.fillText("Move and Jump with the arrow keys or WASD", canvas.width * 0.25, canvas.height * 0.1);
    ctx.drawImage(padImg, canvas.width * 0.2, canvas.height * 0.04, 50, 50);
    ctx.drawImage(padImg, canvas.width * 0.75, canvas.height * 0.04, 50, 50);
    ctx.fillText("Push boxes", canvas.width * 0.45, canvas.height * 0.2);
    ctx.drawImage(boxImg, canvas.width * 0.4, canvas.height * 0.13, 50, 50);
    ctx.drawImage(boxImg, canvas.width * 0.58, canvas.height * 0.13, 50, 50);
    ctx.fillText("Bounce on this platforms", canvas.width * 0.38, canvas.height * 0.3);
    ctx.drawImage(bounceImg, canvas.width * 0.38, canvas.height * 0.32, 350, 10);
    ctx.fillText("Open doors with levers", canvas.width * 0.39, canvas.height * 0.4);
    ctx.drawImage(switchImg, canvas.width * 0.33, canvas.height * 0.33, 50, 50);
    ctx.drawImage(doorImg, canvas.width * 0.69, canvas.height * 0.33, 30, 70);
    ctx.fillText("Climb up ladders", canvas.width * 0.42, canvas.height * 0.5);
    ctx.drawImage(ladderImg, canvas.width * 0.37, canvas.height * 0.42, 50, 70);
    ctx.drawImage(ladderImg, canvas.width * 0.63, canvas.height * 0.42, 50, 70);
    ctx.fillText("Don't fall into the spikes", canvas.width * 0.39, canvas.height * 0.6);
    ctx.drawImage(spikesImg, canvas.width * 0.38, canvas.height * 0.6, 350, 30);
    ctx.fillText("Collect gems to gain score", canvas.width * 0.37, canvas.height * 0.7);
    ctx.drawImage(gemImg, canvas.width * 0.33, canvas.height * 0.64, 50, 50);
    ctx.drawImage(gemImg, canvas.width * 0.67, canvas.height * 0.64, 50, 50);
    ctx.fillText("Touch Checkpoints to respawn there when dead", canvas.width * 0.25, canvas.height * 0.8);
    ctx.drawImage(flagImg, canvas.width * 0.2, canvas.height * 0.75, 50, 70);
    ctx.drawImage(flagImg, canvas.width * 0.8, canvas.height * 0.75, 50, 70);

    if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30)) ctx.fillStyle = "turquoise";

    ctx.font = "700 30px CaviarDreams";
    ctx.fillText("Back", canvas.width * 0.48, canvas.height * 0.95);

    ctx.fillStyle = "turquoise";
    ctx.fillText("Press R to respawn", canvas.width * 0.05, canvas.height * 0.95);
    ctx.fillText("Press Esc to pause the game", canvas.width * 0.65, canvas.height * 0.95);

}
