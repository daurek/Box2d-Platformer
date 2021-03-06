// Creates a block without friction (so the player can't climb them)
// The rest (data, start and draw) is the same as floor

function NewBlock (options)
{
    return {
        type: "block",

        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: floorImg,
        imgScale: 1,

        physicsInfo: {
            linearDamping: 0,
            friction: 0,
            density: 1,
            fixedRotation: true,
            type: b2Body.b2_staticBody
        },

        body: null,

        Start: function ()
        {
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y  / scale,
                this.width, this.height, this.physicsInfo);
            this.body.SetUserData(this);
        },

        Draw: function (ctx) {
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
