// Creates a switch that opens the door with the same id
// The rest (draw) is the same as floor

function NewSwitch (options, newSwitchId)
{
    return {
        type: "switch",
        // the id of the switch
        switchId: null,
        // if it has been toggled
        closed: true,
        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: switchImg,
        imgScale: 1,

        physicsInfo: {
            density: 1,
            fixedRotation: true,
            friction: 0,
            type: b2Body.b2_staticBody
        },

        body: null,

        Start: function () {
            // set the switch id to the new one
            this.switchId = newSwitchId;
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            this.body.SetUserData(this);
        },

        Update: function (deltaTime) {

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
