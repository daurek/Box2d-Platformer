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
}

function MouseDown (event)
{
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;
    //console.log("MouseDown: " + "X=" + clickX + ", Y=" + clickY);

    // Depending on the player state
    switch (playerState)
    {
        // On menu we have 3 buttons
        case states.onMenu:
            // Play
            if (MouseCheck( canvas.width * 0.45, canvas.height * 0.5, 100, 30))
            {
                // We always play the menusound on press
                menuSound.play();
                // go to game and load it
                playerState = states.onGame;
                LoadGame();
            }
            // Help
            else if (MouseCheck( canvas.width * 0.45, canvas.height * 0.6, 100, 30))
            {
                menuSound.play();
                // go to help section
                playerState = states.onHelp;
            }
            // Scores
            else if(MouseCheck(canvas.width * 0.44 , canvas.height * 0.7, 90, 30))
            {
                menuSound.play();
                // Clear json file to reload it just after and go to check the scores
                jsonScoreFile = null;
                playerState = states.onScore;

            }
            break;
        // We can only go back to the menu on help
        case states.onHelp:
            if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30))
            {
                menuSound.play();
                playerState = states.onMenu;
            }
            break;
        // We can only go back to the menu on scores
        case states.onScore:
            if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30))
            {
                menuSound.play();
                playerState = states.onMenu;
            }
            break;
        // We can only go back to the menu on pause (unless we press Escape)
        case states.onPause:
            if(MouseCheck(canvas.width * 0.45 , canvas.height * 0.5, 100, 30))
            {
                menuSound.play();
                playerState = states.onMenu;
                // Clear the level reseting it
                ClearLevel ();
            }
            break;
        // We can only go back to the menu on finish
        case states.onFinish:
            if(MouseCheck(canvas.width * 0.48 , canvas.height * 0.95, 65, 30))
            {
                menuSound.play();
                playerState = states.onMenu;
                // Clear the level
                ClearLevel ();
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
function MouseCheck(xPos, yPos, xSize, ySize)
{
    return input.mouse.x > xPos && input.mouse.x  < xPos + xSize && input.mouse.y > yPos - ySize && input.mouse.y  < yPos;
}
