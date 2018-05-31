/// Input.js takes care of both Mouse and Keyboard input (transition between sections)

// key events
var lastPress = null;

// Keys
var KEY_LEFT  = 37, KEY_A = 65;
var KEY_UP    = 38, KEY_W = 87;
var KEY_RIGHT = 39, KEY_D = 68;
var KEY_DOWN  = 40, KEY_S = 83;
var KEY_PAUSE = 19; KEY_R = 82;
var KEY_SPACE = 32; KEY_ESCAPE = 27;
var KEY_Q = 81;

// Input data
var input =
{
    // mouse coord
    mouse: { x: 0, y: 0 },
    // keyboard data
    keyboard: {
        keyup: {},
        keypressed: {}
    },
    isKeyPressed: function(keycode) {
        return this.keyboard[keycode];
    },
    isKeyDown: function(keycode) {
        return this.keyboard.keypressed[keycode];
    },
    isKeyUp: function (keycode) {
        return this.keyboard.keyup[keycode];
    },
    update: function() {
        for (var property in this.keyboard.keyup) {
            if (this.keyboard.keyup.hasOwnProperty(property)) {
                this.keyboard.keyup[property] = false;
            }
        }
    },
    postUpdate: function () {
        for (var property in this.keyboard.keypressed) {
            if (this.keyboard.keypressed.hasOwnProperty(property)) {
                this.keyboard.keypressed[property] = false;
            }
        }
    }
};

function SetupKeyboardEvents ()
{
    AddEvent(document, "keydown", function (e) {
        input.keyboard[e.keyCode] = true;
        input.keyboard.keypressed[e.keyCode] = true;
    } );

    AddEvent(document, "keyup", function (e) {
        input.keyboard.keyup[e.keyCode] = true;
        input.keyboard[e.keyCode] = false;
    } );

    function AddEvent (element, eventName, func)
    {
        if (element.addEventListener)
            element.addEventListener(eventName, func, false);
        else if (element.attachEvent)
            element.attachEvent(eventName, func);
    }
}

function SetupMouseEvents ()
{
    // mouse click event
    canvas.addEventListener("mousedown", MouseDown, false);
    // mouse move event
    canvas.addEventListener("mousemove", MouseMove, false);
    // mouse wheel event
    canvas.addEventListener("wheel", MouseWheel, false);
}

function MouseDown (event)
{
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;
    //console.log("MouseDown: " + "X=" + clickX + ", Y=" + clickY);
    // Check what the user clicked
    ButtonCheck();
}

// Check which button has been pressed
function ButtonCheck()
{
    // Depending on the player state we check every button available
    switch (playerState)
    {
        // On menu we have multiple buttons
        case states.onMenu:
            // Play
            if (MouseCheck(playButton))
            {
                // We always play the menusound on press
                menuSound.play();
                // go to game and load it
                playerState = states.onGame;
                LoadGame();
            }
            // Levels
            else if (MouseCheck(levelsButton))
            {
                menuSound.play();
                // go to levels section
                playerState = states.onLevels;
            }
            // Help
            else if (MouseCheck(helpButton))
            {
                menuSound.play();
                // go to help section
                playerState = states.onHelp;
            }
            // Scores
            else if(MouseCheck(scoresButton))
            {
                menuSound.play();
                // go to score section
                playerState = states.onScore;
            }
            // Settings
            else if(MouseCheck(settingsButton))
            {
                menuSound.play();
                // go to settings section
                playerState = states.onSettings;
            }
            // Facebook
            else if(MouseCheck(facebookButton))
            {
                menuSound.play();
                // open facebook login window or close it
                if(!loggedOn) FB.login(statusChangeCallback, {scope: 'email,public_profile', return_scopes: true});
                else CloseFacebook();
            }
            break;
        // We can only go back to the menu on help
        case states.onHelp:
            if(MouseCheck(helpBackButton)) GoToMenu(false);
            break;
        // We can go back to the menu or clear scores
        case states.onScore:
            if(MouseCheck(scoresBackButton)) GoToMenu(false);
            else if(MouseCheck(clearScoresButton)) ClearScores();
            break;
        // We can go back to the menu or set to fullscreen on settings
        case states.onSettings:
            if(MouseCheck(settingsBackButton)) GoToMenu(false);
            else if(MouseCheck(fullscreenButton)) SetFullscreen();
            break;
        // We can only go back to the menu on pause (unless we press Escape)
        case states.onPause:
            if(MouseCheck(pauseToMenuButton))
            {
                GoToMenu(true);
                // Clear the level reseting it
                ClearLevel ();
            }
            break;
        // We can go back to the menu on finish or to the next level
        case states.onFinish:
            if(MouseCheck(finishToMenuButton))
            {
                GoToMenu(true);
                // Clear the level
                ClearLevel ();
            }
            else if (MouseCheck(nextLevelButton))
            {
                menuSound.play();
                NextLevel();
                playerState = states.onGame;
            }
            break;
        // We can go back to the menu or select a level
        case states.onLevels:
            if(MouseCheck(levelsBackButton)) GoToMenu(true);

            // Check if a level has been selected
            for (var i = 0; i < levelsButtons.length; i++)
            {
                // If it has then load it up
                if (MouseCheck(levelsButtons[i]))
                {
                    currentLevel = i+1;
                    playerState = states.onGame;
                    LoadGame();
                }
            }
            break;
        default:
            break;
    }
}

// Go to menu and stop the rainsound if true
function GoToMenu(soundStop)
{
    menuSound.play();
    playerState = states.onMenu;
    if(soundStop) rainSound.stop();
}

function MouseMove (event)
{
    var rect = canvas.getBoundingClientRect();
    input.mouse.x = event.clientX - rect.left;
    input.mouse.y = event.clientY - rect.top;
}

// Returns true if the mouse position is inside the provided boundaries
function MouseCheck(button)
{
    // centered buttons
    return input.mouse.x > canvas.width * button.xPos - button.xSize/2 && input.mouse.x  < canvas.width * button.xPos + button.xSize/2 && input.mouse.y > canvas.height * button.yPos - button.ySize && input.mouse.y  < canvas.height * button.yPos;
}

function MouseWheel(event)
{
    // If the player is on settings
    if (playerState == states.onSettings)
    {
        // Depending on the wheel direction lower or increase volume while clamping it
        if (event.deltaY > 0)
            if (soundVolume > 0.01) soundVolume -= 0.01;
            else soundVolume = 0;
        else
            if (soundVolume < 0.99) soundVolume += 0.01;
            else soundVolume = 1;

        menuSound.play();
    }
}
