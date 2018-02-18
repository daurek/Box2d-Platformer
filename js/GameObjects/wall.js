// Creates a wall (game boundaries) with the given friction (side walls do not need friction so the player cant climb them, upper and lower walls need friction so the boxes dont slide on them)
// The rest (draw) is the same as floor

function NewWall (options, friction = 0)
{
    return {
        type: "wall",

        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: greyImg,
        imgScale: 1,

        physicsInfo: {
            linearDamping: 0,
            friction: 0,
            density: 1,
            fixedRotation: true,
            type: b2Body.b2_staticBody
        },

        body: null,

        Start: function () {
            // sets friction to new friction
            this.physicsInfo.friction = friction;
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
