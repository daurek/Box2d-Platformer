// Only removed vertical displacement on this file (not needed since I wanted to see the whole level)
// Camera parameters
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
    this.offset.x = this.player.position.x;
}

Camera.prototype.Update = function (deltaTime)
{
    // this camera follows the player's position

    // horizontal displacement:
    this.position.x = this.player.position.x - canvas.width *.5;

    // Vertical displacement not needed
    //this.position.y = (this.player.position.y - this.offset.y) * 0.2;

    // horizontal (minX-maxX) clamp
    this.position.x = Math.min(Math.max(this.position.x, this.minX), this.maxX);
}
