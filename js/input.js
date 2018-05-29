// Only changed MouseDown so it can press buttons and added MouseCheck to check if mouse is over buttons
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
    ButtonCheck();

}

function ButtonCheck()
{
    // Depending on the player state
    switch (playerState)
    {
        // On menu we have 3 buttons
        case states.onMenu:
            // Play
            if (MouseCheck(playButton))//canvas.width * 0.45, canvas.height * 0.5, 100, 30))
            {
                // We always play the menusound on press
                menuSound.play();
                // go to game and load it
                playerState = states.onGame;
                LoadGame();
            }
            // Help
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
                // Clear json file to reload it just after and go to check the scores
                jsonScoreFile = null;
                playerState = states.onScore;

            }
            else if(MouseCheck(settingsButton))
            {
                menuSound.play();
                // go to settings section
                playerState = states.onSettings;
            }
            else if(MouseCheck(facebookButton))
            {
                menuSound.play();
                // go to settings section
                //playerState = states.onSettings;
                checkLoginState();
            }
            break;
        // We can only go back to the menu on help
        case states.onHelp:
            if(MouseCheck(helpBackButton))
            {
                menuSound.play();
                playerState = states.onMenu;
            }
            break;
        // We can only go back to the menu on scores
        case states.onScore:
            if(MouseCheck(scoresBackButton))
            {
                menuSound.play();
                playerState = states.onMenu;
            }
            break;
        case states.onSettings:
            if(MouseCheck(settingsBackButton))
            {
                menuSound.play();
                playerState = states.onMenu;
            }
            break;
        // We can only go back to the menu on pause (unless we press Escape)
        case states.onPause:
            if(MouseCheck(pauseToMenuButton))
            {
                menuSound.play();
                playerState = states.onMenu;
                // Clear the level reseting it
                ClearLevel ();
            }
            break;
        // We can only go back to the menu on finish
        case states.onFinish:
            if(MouseCheck(finishToMenuButton))
            {
                menuSound.play();
                playerState = states.onMenu;
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
        case states.onLevels:
            if(MouseCheck(levelsBackButton))
            {
                menuSound.play();
                playerState = states.onMenu;
            }

            for (var i = 0; i < levelsButtons.length; i++)
            {
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

function MouseMove (event)
{
    var rect = canvas.getBoundingClientRect();
    input.mouse.x = event.clientX - rect.left;
    input.mouse.y = event.clientY - rect.top;
}

// Returns true if the mouse position is inside the provided boundaries
function MouseCheck(button)
{
    return input.mouse.x > canvas.width * button.xPos && input.mouse.x  < canvas.width * button.xPos + button.xSize && input.mouse.y > canvas.height * button.yPos - button.ySize && input.mouse.y  < canvas.height * button.yPos;
}

function MouseWheel(event)
{
    if (playerState == states.onSettings)
     {
        if (event.deltaY > 0)
            if (soundVolume > 0.01) soundVolume -= 0.01;
            else soundVolume = 0;
        else
            if (soundVolume < 0.99) soundVolume += 0.01;
            else soundVolume = 1;

        menuSound.play();
    }
}
