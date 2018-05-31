/// Draws everything (images, text, buttons)

// Texts
var gameTitle =      { name: "Skylight",                    xPos:  0.5,  yPos:  0.2,  px: 70, color: "white", font: "CaviarDreams", align:"center"};
    pauseText =      { name: "Pause",                       xPos:  0.5,  yPos:  0.2,  px: 40, color: "red",   font: "Roboto-Light", align:"center"};
    userName =       { name: "Not Connected",               xPos:  0.07, yPos:  0.97, px: 35, color: "white", font: "Roboto-Light", align:"left"  };
    mouseWheel =     { name: "Use the Mouse Wheel",         xPos:  0.5,  yPos:  0.2,  px: 30, color: "white", font: "Roboto-Light", align:"center"};
    finishText =     { name: "Gems + Time Left in seconds", xPos:  0.5,  yPos:  0.3,  px: 80, color: "green", font: "CaviarDreams", align:"center"};

// Help Texts
var helpTexts = [
    moveText =       { name: "Move and Jump with the arrow keys or WASD",       xPos:  0.5, yPos:  0.1, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    pushText =       { name: "Push boxes",                                      xPos:  0.5, yPos:  0.2, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    bounceText =     { name: "Bounce on this platforms",                        xPos:  0.5, yPos:  0.3, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    doorText =       { name: "Open doors with levers",                          xPos:  0.5, yPos:  0.4, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    ladderText =     { name: "Climb up ladders",                                xPos:  0.5, yPos:  0.5, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    spikesText =     { name: "Don't fall into the spikes",                      xPos:  0.5, yPos:  0.6, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    gemsText =       { name: "Collect gems to gain score",                      xPos:  0.5, yPos:  0.7, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    checkpointText = { name: "Touch Checkpoints to respawn there when dead",    xPos:  0.5, yPos:  0.8, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    respawnText =    { name: "Press R to respawn",                              xPos:  0.01, yPos:  0.97, px: 30, color: "cyan", font: "CaviarDreams", align:"left"},
    escText =        { name: "Press Esc to pause the game",                     xPos:  0.99, yPos:  0.97, px: 30, color: "cyan", font: "CaviarDreams", align:"right"}
];

// Dynamic Texts
var gemsCount =      { name: "-", defaultText: "Gems: ",        xPos:  0.95, yPos:  0.05, px: 30, color: "cyan", font: "Roboto-Light", align:"right"};
    countdownText =  { name: "-", defaultText: "Countdown: ",   xPos:  0.85, yPos:  0.05, px: 30, color: "orange", font: "Roboto-Light", align:"right"};
    levelText =      { name: "-", defaultText: "Level: ",       xPos:  0.5, yPos:  0.05, px: 30, color: "green", font: "Roboto-Light", align:"center"};
    finalScoreText = { name: "-", defaultText: "Score: ",       xPos:  0.5, yPos:  0.5, px: 80, color: "green", font: "CaviarDreams", align:"center"};
    fpsText =        { name: "-", defaultText: "FPS: ",         xPos:  0.01, yPos:  0.02, px: 15, color: "purple", font: "Roboto-Light", align:"left"};
    deltaTimeText =  { name: "-", defaultText: "deltaTime: ",   xPos:  0.01, yPos:  0.05, px: 15, color: "purple", font: "Roboto-Light", align:"left"};

// Buttons (they need 2d size due to button colliders -> onHover check)
// Menu buttons
var menuButtons = [
    playButton =     { name: "Play",     xPos:  0.5, yPos:  0.5, xSize: 65, ySize: 30, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    levelsButton =   { name: "Levels",   xPos:  0.5, yPos:  0.6, xSize: 90, ySize: 30, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    helpButton =     { name: "Help",     xPos:  0.5, yPos:  0.7, xSize: 65, ySize: 30, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    scoresButton =   { name: "Scores",   xPos:  0.5, yPos:  0.8, xSize: 90, ySize: 30, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    settingsButton = { name: "Settings", xPos:  0.5, yPos:  0.9, xSize: 110, ySize: 30, px: 30, color: "white", font: "CaviarDreams", align:"center"},
    facebookButton = { name: "",         xPos:  0.035, yPos:  0.98, xSize: 100, ySize: 100, px: 30, color: "white", font: "CaviarDreams", align:"center"}
];

var helpBackButton =        { name: "Back",             xPos:  0.5, yPos:  0.97, xSize: 110, ySize: 35, px: 45, color: "white", font: "Roboto-Light", align:"center"};
    levelsBackButton =      { name: "Back",             xPos:  0.5, yPos:  0.97, xSize: 110, ySize: 35, px: 45, color: "white", font: "Roboto-Light", align:"center"};
    scoresBackButton =      { name: "Back",             xPos:  0.5, yPos:  0.97, xSize: 110, ySize: 35, px: 45, color: "white", font: "Roboto-Light", align:"center"};
    settingsBackButton =    { name: "Back",             xPos:  0.5, yPos:  0.97, xSize: 110, ySize: 35, px: 45, color: "white", font: "Roboto-Light", align:"center"};
    pauseToMenuButton =     { name: "Menu",             xPos:  0.5, yPos:  0.5, xSize: 75, ySize: 30, px: 30, color: "white", font: "Roboto-Light", align:"center"};
    nextLevelButton =       { name: "Next Level",       xPos:  0.5, yPos:  0.85, xSize: 150, ySize: 30, px: 30, color: "white", font: "Roboto-Light", align:"center"};
    fullscreenButton =      { name: "Set Fullscreen",   xPos:  0.5, yPos:  0.3, xSize: 185, ySize: 30, px: 30, color: "white", font: "Roboto-Light", align:"center"};
    finishToMenuButton =    { name: "Menu",             xPos:  0.5, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light", align:"center"};
    clearScoresButton  =    { name: "Clear",             xPos:  0.1, yPos:  0.97, xSize: 110, ySize: 40, px: 45, color: "white", font: "Roboto-Light", align:"center"};

// Buttons that get created when loading json levels
var levelsButtons = [];

// Rain Array and rain drops on screen
var rain = [];
    rainDrops = 250;

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
        case states.onSettings:
            DrawSettings ();
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
        case states.onLevels:
            DrawLevels ();
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

    // Draw the rain
    DrawRain();

    // Draw the UI
    DrawUI ();
}

// Draws the UI of the game
function DrawUI ()
{
    // Draw upper black transparent rectangle
    ctx.fillStyle= "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0, canvas.width,canvas.height * 0.07);

    // Draw the level number, player score and the countdown timer
    DrawDynamicText(levelText, currentLevel)
    DrawDynamicText(gemsCount, player.score);
    DrawDynamicText(countdownText, timer)

    // Draw fps and deltatime
    DrawDynamicText(fpsText, FPS);
    DrawDynamicText(deltaTimeText, Math.round(1 / deltaTime));
}

// Draws the rain
function DrawRain()
{
    // Loop through rain array
    for (var i = 0; i < rain.length; i++)
    {
        ctx.save();
        // Rotate the rain to a random angle (given when created)
        ctx.rotate(rain[i].angle* Math.PI/180);
        // Paint it blue
        ctx.fillStyle= "rgb(77, 125, 204)";
        // Draw it on it's position
        ctx.fillRect(rain[i].xPos,rain[i].yPos,2,20);
        // Add the speed
        rain[i].yPos += rain[i].speed;
        // If it goes out of limit then replace it at a random xPos and at the top of the level
        if(rain[i].yPos > 700)
        {
            rain[i].xPos = Math.random() * canvas.width;
            rain[i].yPos = -600;
        }
        ctx.restore();
    }
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
    ctx.restore();
    // pause screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // Pause text
    DrawText(pauseText);

    // Draw pause to menu button
    DrawButton(pauseToMenuButton);
}

// Draws the menu section
function DrawMenu ()
{
    // Restore canvas
    ctx.restore();

    // Game Title
    DrawText(gameTitle);

    // Draw all menu buttons
    for (var i = 0; i < menuButtons.length; i++)
        DrawButton(menuButtons[i]);

    // Draw facebook img and user name
    ctx.drawImage(facebookImg, canvas.width * 0.01, canvas.height * 0.87, canvas.width * 0.05, canvas.width * 0.05);
    DrawText(userName);
}

// Draws help section
function DrawHelp ()
{
    // Restore canvas
    ctx.restore();

    // Draw Help texts
    for (var i = 0; i < helpTexts.length; i++)
        DrawText(helpTexts[i]);

    // Draw Help Images (relative to texts, scales with canvas size)
    ctx.drawImage(padImg, moveText.xPos * canvas.width - 400, moveText.yPos * canvas.height - 35, 50, 50);
    ctx.drawImage(padImg, moveText.xPos * canvas.width + 350, moveText.yPos * canvas.height - 35, 50, 50);
    ctx.drawImage(boxImg, pushText.xPos * canvas.width - 150, pushText.yPos * canvas.height - 35, 50, 50);
    ctx.drawImage(boxImg, pushText.xPos * canvas.width + 100, pushText.yPos * canvas.height - 35, 50, 50);
    ctx.drawImage(bounceImg, bounceText.xPos * canvas.width - 175 , bounceText.yPos * canvas.height + 5, 350, 10);
    ctx.drawImage(switchImg, doorText.xPos * canvas.width - 210, doorText.yPos * canvas.height - 35, 50, 50);
    ctx.drawImage(doorImg, doorText.xPos * canvas.width + 170, doorText.yPos * canvas.height - 35, 30, 70);
    ctx.drawImage(ladderImg, ladderText.xPos * canvas.width - 180, ladderText.yPos * canvas.height - 45, 50, 70);
    ctx.drawImage(ladderImg, ladderText.xPos * canvas.width + 130, ladderText.yPos * canvas.height - 45, 50, 70);
    ctx.drawImage(spikesImg, spikesText.xPos * canvas.width - 175 , spikesText.yPos * canvas.height + 5, 350, 30);
    ctx.drawImage(gemImg, gemsText.xPos * canvas.width - 250, gemsText.yPos * canvas.height - 40, 50, 50);
    ctx.drawImage(gemImg, gemsText.xPos * canvas.width + 200, gemsText.yPos * canvas.height - 40, 50, 50);
    ctx.drawImage(flagImg, checkpointText.xPos * canvas.width - 410, checkpointText.yPos * canvas.height - 40, 50, 70);
    ctx.drawImage(flagImg, checkpointText.xPos * canvas.width + 360, checkpointText.yPos * canvas.height - 40, 50, 70);

    // Draw back button
    DrawButton(helpBackButton);
}

// Draws the finish section
function DrawFinish ()
{
    // Restore canvas
    ctx.restore();

    // White screen
    ctx.fillStyle = "rgba(0, 30, 100, 0.6)";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // Final score text
    DrawText(finishText);
    DrawDynamicText(finalScoreText, finalScore )

    // Only draw next level button if there's a next level
    if (currentLevel < jsonLevels.length)
    DrawButton(nextLevelButton);
    // To menu button
    DrawButton(finishToMenuButton);
}

// Draws the scores section
function DrawScore ()
{
    // Restore context
    ctx.restore();

    // Set font
    ctx.font = "700 30px CaviarDreams";

    // If it's empty
    if(jsonScoreFile == null)
    {
        // Load the local storage score
        jsonScoreFile = JSON.parse(localStorage.getItem('score'));
    }

    // If it has been generated then proceed
    if(jsonScoreFile != null)
    {
        //Sorts by score
        jsonScoreFile.sort(function(a, b) {
            return a.score < b.score;
        });
        jsonScoreFile.sort();

        // Get lenght
        var count = Object.keys(jsonScoreFile).length;

        // If the json file has at least a score saved
        if(count > 0)
        {
            // Set text style and draw top text
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText("Rank - Name -  Date - Score", canvas.width * 0.1, canvas.height * 0.1  );

            ctx.fillStyle = "cyan";
            // Loop through every score until limit has been reached (7 because that's the space we have)
            for (var i = 0; i < count && i < 7; i++)
            {
                // Get time and score to display it one after the other
                ctx.fillText(i+1 + " - " + jsonScoreFile[i].name + " - " + jsonScoreFile[i].time + "   -   " + jsonScoreFile[i].score, canvas.width * 0.1, canvas.height * ( 0.1 * i + 0.2)   );
            }
        }
        // if no scores then display that no scores have been saved
        else
        {
            ctx.textAlign = "center";
            ctx.fillText( "No scores saved", canvas.width * 0.5, canvas.height * 0.5);
        }

    }
    // If the file has not been found then display an error message
    else
    {
        ctx.textAlign = "center";
        ctx.fillText( "File has not been found / Error on Parse / File cleared", canvas.width * 0.5, canvas.height * 0.5);
    }

    // Draw clear scores
    DrawButton(clearScoresButton);
    // Draw scores back button
    DrawButton(scoresBackButton);
}

// Draws the settings section
function DrawSettings()
{
    // Restore context
    ctx.restore();
    // Draw sound bar (relative to canvas so it scales)
    ctx.drawImage(bounceImg, mouseWheel.xPos * canvas.width/2, mouseWheel.yPos * canvas.height/2, canvas.width / 2,  canvas.height / 20);
    // Draw sound slider (relative to canvas so it scales)
    ctx.drawImage(gemImg, mouseWheel.xPos * canvas.width * soundVolume + (canvas.width * 0.237), mouseWheel.yPos * canvas.height/2.25, 50, canvas.height / 15);
    // Draw sound text
    ctx.fillText(Math.round(soundVolume * 100) + "%", canvas.width * (soundVolume * 0.4) + 380, canvas.height * 0.07);
    // Draw mouse wheel text
    DrawText(mouseWheel);
    // Draw fullscreen button
    DrawButton(fullscreenButton);
    // Back text hover and draw back text
    DrawButton(settingsBackButton);
}

// Draws the levels section
function DrawLevels()
{
    // Restore context
    ctx.restore();
    // Goes through level buttons and draws them
    for (var i = 0; i < levelsButtons.length; i++) DrawButton(levelsButtons[i]);

    // Draws back button
    DrawButton(levelsBackButton);
}

// Draws a button
function DrawButton(button)
{
    // Change color on mouse hover
    if (MouseCheck(button)) button.color = "cyan";
    else button.color = "white";

    // Draws the button's text
    DrawText(button);
}

// Draws a text with a value
function DrawDynamicText(text, value)
{
    text.name = text.defaultText + value;
    // Draws the text
    DrawText(text);
}

// Draws a text
function DrawText(text)
{
    // Get align status and color
    ctx.textAlign = text.align;
    ctx.fillStyle = text.color;
    // Get font and size
    ctx.font = "700 " + text.px +"px " + text.font;
    // Draws the text with it's content on it's position
    ctx.fillText(text.name, canvas.width * text.xPos, canvas.height * text.yPos);
}
