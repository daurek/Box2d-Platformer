
// Images references
var playerImg, floorImg, mountainImg, boxImg, bounceImg, ladderImg, spikesImg, doorImg, switchImg, flagImg, gemImg, padImg, greyImg, endFlagImg, facebookImg;
// Sounds references
var collectSound, bounceSound, deathSound, finishSound, jumpSound, switchSound, menuSound, checkpointSound;

// Json Levels
var jsonLevels = null;

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
    facebookImg = new Image();
    facebookImg.src = "./media/images/facebook.png";

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

// Parses the json file level to create the level
function ParseJSON (levelNumber)
{
    // Get level data from a particular level
    var levelData = jsonLevels[levelNumber - 1].level;
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

// Creates a score and puts it into the json file
function CreateScore (newScore)
{
    // If the json is null
    if(jsonFileScore == null)
    {
        // Get the file
        var string = JSON.stringify(score);
        // Parses that string
        jsonFileScore = JSON.parse(string);
    }

    // If it has loaded correctly
    if(jsonFileScore != null)
    {
        // Get Date (using it to note down the time in which the player completed the level)
        var d = new Date();

        // Create a score with the time and the provided new score
        var obj= {
            time:  d.getHours() + ":" + d.getMinutes() + "  " + d.getDate() + "/" + d.getMonth() + "/" +  d.getFullYear(),
            score: newScore
        };

        // Push it into the json object
        jsonFileScore.push(obj);

        // Pushes the json object into the file
        localStorage.setItem('score', JSON.stringify(jsonFileScore));

    }
}

function LoadLevels()
{
    // Load levels json
    jsonLevels = JSON.parse(JSON.stringify(levels));
    levelCount = jsonLevels.length;

    // Create Levels buttons
    for (var i = 1; i <= levelCount; i++)
    {
        var button = { name: i, xPos:  i/10, yPos:  0.1, xSize: 65, ySize: 30, px: 30, color: "white", font: "Roboto-Light"};
        levelsButtons.push(button);
    }

}
