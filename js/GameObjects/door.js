// Creates a door so the player can open it, need an id when created so its only activated by a switch with the same id
// The rest (draw) is the same as floor

function NewDoor (options, newDoorId)
{
    return {
        type: "door",
        // Id
        doorId: null,
        open: false,
        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: doorImg,
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
            // Set id to new id
            this.doorId = newDoorId;
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y / scale,
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
