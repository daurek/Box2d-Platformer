// Game Renderer

// Texts
var gameTitle = { name: "Skylight", xPos:  0.415, yPos:  0.2, px: 70, color: "white", font: "CaviarDreams"};
    pauseText = { name: "Pause", xPos:  0.435, yPos:  0.3, px: 40, color: "white", font: "Roboto-Light"};
    gemsCount = { name: "-", defaultText: "Gems: ", xPos:  0.87, yPos:  0.05, px: 30, color: "white", font: "Roboto-Light"};
    countdownText = { name: "-", defaultText: "Countdown: ",xPos:  0.65, yPos:  0.05, px: 30, color: "white", font: "Roboto-Light"};
    fpsText = { name: "-", defaultText: "FPS: ",xPos:  0.01, yPos:  0.03, px: 15, color: "white", font: "Roboto-Light"};
    deltaTimeText = { name: "-", defaultText: "deltaTime: ",xPos:  0.01, yPos:  0.06, px: 15, color: "white", font: "Roboto-Light"};
    userName = { name: "Not Connected", xPos:  0.07, yPos:  0.97, px: 30, color: "white", font: "Roboto-Light"};
// Buttons (they need 2d size due to button colliders -> onHover check)
    // Menu buttons
var menuButtons = [
    playButton = { name: "Play", xPos:  0.49, yPos:  0.5, xSize: 65, ySize: 30, px: 30, color: "white", font: "CaviarDreams"},
    levelsButton = { name: "Levels", xPos:  0.48, yPos:  0.6, xSize: 90, ySize: 30, px: 30, color: "white", font: "CaviarDreams"},
    helpButton = { name: "Help", xPos:  0.49, yPos:  0.7, xSize: 65, ySize: 30, px: 30, color: "white", font: "CaviarDreams"},
    scoresButton = { name: "Scores", xPos:  0.48, yPos:  0.8, xSize: 90, ySize: 30, px: 30, color: "white", font: "CaviarDreams"},
    settingsButton = { name: "Settings", xPos:  0.47, yPos:  0.9, xSize: 110, ySize: 30, px: 30, color: "white", font: "CaviarDreams"},
    facebookButton = { name: "", xPos:  0.01, yPos:  0.98, xSize: 50, ySize: 50, px: 30, color: "white", font: "CaviarDreams"}
];
var helpBackButton = { name: "Back", xPos:  0.48, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    levelsBackButton = { name: "Back", xPos:  0.48, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    scoresBackButton = { name: "Back", xPos:  0.48, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    settingsBackButton = { name: "Back", xPos:  0.48, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    pauseToMenuButton = { name: "Menu", xPos:  0.45, yPos:  0.5, xSize: 75, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    nextLevelButton = { name: "Next Level", xPos:  0.45, yPos:  0.85, xSize: 150, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
    finishToMenuButton = { name: "Menu", xPos:  0.48, yPos:  0.95, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};

var levelsButtons = [];

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

    // Draw upper black transparent rectangle
    ctx.fillStyle= "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0,0, canvas.width,canvas.height * 0.07);

    DrawRain();

    // Draw the player score and the countdown timer
    DrawDynamicText(gemsCount, player.score);
    DrawDynamicText(countdownText, timer)

    // Draw fps and deltatime
    DrawDynamicText(fpsText, FPS);
    DrawDynamicText(deltaTimeText, Math.round(1 / deltaTime));



}

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
            rain[i].xPos = Math.random() * 1500;
            rain[i].yPos = -300;
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
    ctx.restore();

    // Game Title
    DrawText(gameTitle);

    // Draw all menu buttons
    for (var i = 0; i < menuButtons.length; i++)
        DrawButton(menuButtons[i]);

    ctx.drawImage(facebookImg, canvas.width * 0.01, canvas.height * 0.9, 50, 50);
    DrawText(userName);
}

// Draws help section
function DrawHelp ()
{
    ctx.restore();

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

    // Draw Back Text
    DrawButton(helpBackButton);

    // Keys notes
    ctx.fillStyle = "turquoise";
    ctx.fillText("Press R to respawn", canvas.width * 0.05, canvas.height * 0.95);
    ctx.fillText("Press Esc to pause the game", canvas.width * 0.65, canvas.height * 0.95);

}

// Draws the finish section
function DrawFinish ()
{
    ctx.restore();
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

    // Only draw next level button if there's a next level
    if (currentLevel < jsonLevels.length)
    DrawButton(nextLevelButton);
    // To menu button
    DrawButton(finishToMenuButton);
}

// Draws the scores section
function DrawScore ()
{
    ctx.restore();

    // If it's empty
    if(jsonScoreFile == null)
    {
        // Load the local storage score
        jsonScoreFile = JSON.parse(localStorage.getItem('score'));
    }

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

    }

    // Draw scores back button
    DrawButton(scoresBackButton);

}

// Draws the settings section
function DrawSettings()
{
    ctx.restore();

    ctx.drawImage(bounceImg, canvas.width * 0.30 , canvas.height * 0.1, 550, 50);
    ctx.drawImage(gemImg, canvas.width * (soundVolume * 0.4) + 380, canvas.height * 0.1, 50, 50);
    ctx.fillText(Math.round(soundVolume * 100) + "%", canvas.width * (soundVolume * 0.4) + 380, canvas.height * 0.07);
    ctx.fillText( "Use the Mouse Wheel", canvas.width * 0.4, canvas.height * 0.25   );
    // Back text hover and draw back text
    DrawButton(settingsBackButton);
}

function DrawLevels()
{
    ctx.restore();

    for (var i = 0; i < levelsButtons.length; i++)
    {
        DrawButton(levelsButtons[i]);
    }

    DrawButton(levelsBackButton);
}

// Draws a button, change color on mouse hover
function DrawButton(button)
{
    if (MouseCheck(button)) button.color = "cyan";
    else button.color = "white";

    DrawText(button);
}

// Draws a text with a value
function DrawDynamicText(text, value)
{
    text.name = text.defaultText + value;
    DrawText(text);
}

// Draws a text
function DrawText(text)
{
    ctx.fillStyle = text.color;
    ctx.font = "700 " + text.px +"px " + text.font;
    ctx.fillText(text.name, canvas.width * text.xPos, canvas.height * text.yPos);
}
