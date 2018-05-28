// Only removed vertical displacement on this file (not needed since I wanted to see the whole level)
// Camera parameters

var defaultScrollingSpeed = 5;
var value = defaultScrollingSpeed;

function Camera (player)
{
    this.player = player;
    this.offset = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.minX = 0;
    this.maxX = 800;
    this.minY = 0;
}

Camera.prototype.Start = function ()
{
    this.player.position.x = 1000;
    this.offset.x = this.player.position.x;
}

Camera.prototype.Update = function (deltaTime)
{
    // this camera follows the player's position

    if(playerState != states.onGame)
    {
            this.player.position.x += value;
            this.position.x = this.player.position.x - canvas.width *.5;

            if (this.position.x >= this.maxX + 750) value = -defaultScrollingSpeed;
            else if(this.position.x <= this.minX) value = defaultScrollingSpeed;

    }
    else
    {
        this.position.x = this.player.position.x - canvas.width *.5;

        // Vertical displacement not needed
        //this.position.y = (this.player.position.y - this.offset.y) * 0.2;

        // horizontal (minX-maxX) clamp
        this.position.x = Math.min(Math.max(this.position.x, this.minX), this.maxX);
    }

}
