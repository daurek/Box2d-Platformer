// key events
var lastPress = null;

var KEY_LEFT  = 37, KEY_A = 65;
var KEY_UP    = 38, KEY_W = 87;
var KEY_RIGHT = 39, KEY_D = 68;
var KEY_DOWN  = 40, KEY_S = 83;
var KEY_PAUSE = 19; KEY_R = 82;
var KEY_SPACE = 32; KEY_ESCAPE = 27;

var input = {
    mouse: { x: 0, y: 0 },
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
    if(onMenu)
    {
        if(clickX > canvas.width * 0.45 && clickX  < canvas.width * 0.45 + 100 && clickY > canvas.height * 0.5 - 30 && clickY  < canvas.height * 0.5 )
        {
            onMenu = false;
            LoadGame();
        }
    }
    else if (onPause)
    {
        if(clickX > canvas.width * 0.45 && clickX  < canvas.width * 0.45 + 100 && clickY > canvas.height * 0.5 - 30 && clickY  < canvas.height * 0.5 )
        {
            onPause = false;
            onMenu = true;
            ClearLevel ();
        }
    }

}

function MouseMove (event)
{
    var rect = canvas.getBoundingClientRect();
    input.mouse.x = event.clientX - rect.left;
    input.mouse.y = event.clientY - rect.top;


}
