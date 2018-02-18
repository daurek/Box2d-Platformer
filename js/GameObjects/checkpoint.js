// Creates a checkpoint so the player save his spawn there (body is deleted on contact)
// The rest (start and draw) is the same as floor

function NewCheckpoint (options)
{
    return {
        type: "checkpoint",
        // If the flag has been touched, the loop will destroy the body
        checked: false,
        // If the body has been destroyed, the loop will ignore it
        destroyed : false,
        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: flagImg,
        imgScale: 1,

        physicsInfo: {
            density: 1,
            fixedRotation: true,
            friction: 0,
            type: b2Body.b2_staticBody
        },

        body: null,

        Start: function ()
        {
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            this.body.SetUserData(this);
        },

        Draw: function (ctx)
        {
            var bodyPosition = this.body.GetPosition();
            var posX = bodyPosition.x * scale;
            var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

            ctx.save();

            ctx.translate(posX, posY);
            ctx.scale(this.imgScale, this.imgScale);

            ctx.drawImage(this.img,
                -this.width * scale,
                -this.height * scale,
                this.width * scale * 2, this.height * scale * 2);

            ctx.restore();
        }
    }
}
