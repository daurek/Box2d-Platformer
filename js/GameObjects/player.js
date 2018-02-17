
var player = {
    type: 'player',

    position: {x: 200, y: 200},
    width: 0.22,
    height: 0.35,
    isDead: false,
    isGoingLeft: false,
    // movement attr
    maxHorizontalVel: 2,
    maxVerticalVel: 4,
    jumpForce: 6,

    moveLeft: false,
    moveRight: false,
    moveUp: false,

    canJump: false,

    score: 0,

    animation: {
        img: null,
        timePerFrame: 1/12,
        currentFrametime: 0,
        frameWidth: 50.1,
        frameHeight: 71,
        actualX: 0,
        actualY: 0,
        limitX: 250,

        Update: function (deltaTime) {
            this.currentFrametime += deltaTime;
            if (this.currentFrametime >= this.timePerFrame)
            {
                // update the animation frame
                this.actualX += this.frameWidth;
                if (this.actualX > this.limitX)
                {
                    this.actualX = 0;
                    if (Math.abs(player.body.GetLinearVelocity().x) > 0)
                    {
                        this.actualY = 140;
                        this.limitX = 300;
                    }
                    else
                    {
                        this.actualY = 0;
                        this.limitX = 250;
                    }
                }
                this.currentFrametime = 0.0;
            }
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img, this.actualX, this.actualY,
                this.frameWidth, this.frameHeight,
                -this.frameWidth / 2, -this.frameHeight / 2,
                this.frameWidth, this.frameHeight);
        }
    },

    physicsInfo: {
        density: 1,
        fixedRotation: true,
        linearDamping: 0,
        user_data: player,
        type: b2Body.b2_dynamicBody,
        restitution: 0.0
    },

    body: null,

    Start: function () {
        this.animation.img = playerImg;

        this.body = CreateBox(world,
        this.position.x / scale, this.position.y / scale,
        this.width, this.height, this.physicsInfo);

        this.body.SetUserData(this);


    },

    Update: function (deltaTime) {
        // update the animation
        this.animation.Update(deltaTime);


        if(this.moveRight)
        {
            this.ApplyVelocity(new b2Vec2(1, 0));
            this.moveRight = false;
            this.isGoingLeft = false;
        }
        else if(this.moveLeft)
        {
            this.ApplyVelocity(new b2Vec2(-1, 0));
            this.moveLeft = false;
            this.isGoingLeft = true;
        }
        // stop character horizontal movement (stops sliding in non friction platforms, still have to remove friction so he doesnt climb them from the sides, explained on doc)
        else if(this.body.GetLinearVelocity().x != 0)
        {
            this.body.SetLinearVelocity(new b2Vec2(0,this.body.GetLinearVelocity().y ));
        }

        // jump
        if (this.moveUp)
        {
            this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
            this.moveUp = false;
        }

        // update the position
        var bodyPosition = this.body.GetPosition();
        this.position.x = bodyPosition.x * scale;
        this.position.y = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

        // if the player is dead reset the game (to checkpoint)
        if(this.isDead)
        {
          this.isDead = false;
          Reset();
        }

    },

    Draw: function (ctx) {
        var bodyPosition = this.body.GetPosition();
        var posX = bodyPosition.x * scale;
        var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

        ctx.save();

        ctx.translate(posX, posY);

        if (!this.isGoingLeft)
            ctx.scale(-1, 1);

        this.animation.Draw(ctx);

        ctx.restore();
    },

    ApplyVelocity: function (vel) {
        var bodyVel = this.body.GetLinearVelocity();
        bodyVel.Add(vel);

        // horizontal movement cap
        if (Math.abs(bodyVel.x) > this.maxHorizontalVel)
            bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);

        // vertical movement cap
        if (Math.abs(bodyVel.y) > this.maxVerticalVel)
            bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);

        this.body.SetLinearVelocity(bodyVel);
    },

    Jump: function () {
        if (Math.abs(this.body.GetLinearVelocity().y) > 0)
            return false;

        this.moveUp = true;
    }


}
