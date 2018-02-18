// Addded collider function on contact

// auxiliar code for working with Box2D
// requires jQuery

// Box2D lib
var b2Vec2 = Box2D.Common.Math.b2Vec2
    ,   b2AABB = Box2D.Collision.b2AABB
    ,   b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,   b2Body = Box2D.Dynamics.b2Body
    ,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,   b2Fixture = Box2D.Dynamics.b2Fixture
    ,   b2World = Box2D.Dynamics.b2World
    ,   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,   b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ,   b2Shape = Box2D.Collision.Shapes.b2Shape
    ,   b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
    ,   b2Joint = Box2D.Dynamics.Joints.b2Joint
    ,   b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
    ,   b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
    ,   b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef
    ,   b2ContactListener = Box2D.Dynamics.b2ContactListener
    ;

// 1 metro = 100 pixels
var scale = 100;
var gravity;
var world;

// aux function for creating boxes
function CreateBox (world, x, y, width, height, options)
{
    // default values
    options = $.extend(true, {
        'density' : 1.0,
        'friction': 1.0,
        'restitution' : 0.3,

        'linearDamping' : 0.0,
        'angularDamping': 0.0,

        'fixedRotation': false,

        'type' : b2Body.b2_dynamicBody
    }, options);

    // Fixture: define physics propierties (density, friction, restitution)
    var fix_def = new b2FixtureDef();

    fix_def.density = options.density;
    fix_def.friction = options.friction;
    fix_def.restitution = options.restitution;

    // Shape: 2d geometry (circle or polygon)
    fix_def.shape = new b2PolygonShape();

    fix_def.shape.SetAsBox(width, height);

    // Body: position of the object and its type (dynamic, static o kinetic)
    var body_def = new b2BodyDef();
    body_def.position.Set(x, y);

    body_def.linearDamping = options.linearDamping;
    body_def.angularDamping = options.angularDamping;

    body_def.type = options.type; // b2_dynamicBody
    body_def.fixedRotation = options.fixedRotation;
    body_def.userData = options.user_data;

    var b = world.CreateBody(body_def);
    var f = b.CreateFixture(fix_def);

    return b;
}

// aux function for creating balls
function CreateBall (world, x, y, r, options)
{
    // default values
    options = $.extend(true, {
        'density' : 2.0,
        'friction': 0.5,
        'restitution' : 0.5,

        'linearDamping' : 0.0,
        'angularDamping': 0.0,

        'type' : b2Body.b2_dynamicBody
    }, options);

    var body_def = new b2BodyDef();
    var fix_def = new b2FixtureDef;

    fix_def.density = options.density;
    fix_def.friction = options.friction;
    fix_def.restitution = options.restitution;

    // Shape: 2d geometry (circle or polygon)
    var shape = new b2CircleShape(r);
    fix_def.shape = shape;

    body_def.position.Set(x, y);

    // friction
    body_def.linearDamping  = options.linearDamping;
    body_def.angularDamping = options.angularDamping;

    body_def.type = options.type;
    body_def.userData = options.user_data;

    var b = world.CreateBody(body_def);
    var f = b.CreateFixture(fix_def);

    return b;
}

// Create a Box2D world object
function CreateWorld (ctx, gravity)
{
    var doSleep = false;
    world = new b2World(gravity, doSleep);

    // DebugDraw is used to create the drawing with physics
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    world.SetDebugDraw(debugDraw);

    return world;
}

// Creates world with gravity and prepares colisions
function PreparePhysics (ctx)
{
    // gravity vector
    gravity = new b2Vec2(0, -10);

    // Create world with gravity
    CreateWorld(ctx, gravity);

    // prepare the collision event function
    Box2D.Dynamics.b2ContactListener.prototype.BeginContact = OnContactDetected;
}

// Everytime a contact is done
function OnContactDetected (contact)
{
    // Both elements data
    var a = contact.GetFixtureA().GetBody().GetUserData();
    var b = contact.GetFixtureB().GetBody().GetUserData();

    // If the elements that collide are not null and have a type
    if (a != null && b != null && typeof(a.type) !== 'undefined' && typeof(b.type) !== 'undefined')
    {
        // If the player collides with
        if(a.type == 'player')
        {
            // Depending of the type of the other object
            switch (b.type)
            {
                // If it's a gem and its not taken
                case 'gem':
                    if(!b.taken)
                    {
                        // Take it, add score and play the sound
                        b.taken = true;
                        player.score += 20;
                        collectSound.play();
                    }
                      break;
                // If it's spikes
                case 'spikes':
                    // Set the player as dead (check made on player's update) and play death sound
                    player.isDead = true;
                    deathSound.play();
                    break;
                // If it's a switch and it's still closed
                case 'switch':
                    if(b.closed)
                    {
                        // Check every door
                        for (var i = 0; i < doors.length; i++)
                        {
                            // If there's the same id
                            if(b.switchId == doors[i].doorId)
                            {
                                // close the switch and set the door as open (it will be deleted on game loop), play the switch sound too
                                b.closed = false;
                                doors[i].open = true;
                                switchSound.play();
                                break;
                            }
                        }
                    }
                    break;
                // If it's a checkpoint and it has not been checked
                case 'checkpoint':
                    if(!b.checked)
                      {
                          // Check it, set it position to the new spawn and play the sound
                          b.checked = true;
                          playerSpawn.xPos = b.position.x;
                          playerSpawn.yPos = b.position.y;
                          checkpointSound.play();
                      }
                      break;
                // If it's a bouncing platform just play the sound
                case 'bouncing':
                    bounceSound.play();
                    break;
                // If it's the end point then create the final score
                case 'endPoint':
                    // Play the finish sound
                    finishSound.play();
                    // We get the timer and split it so we can add the time to get a total in seconds
                    var time = timer.split(/[:]+/);
                    var timerScore =  60 * parseInt(time[0]) + parseInt(time[1]);
                    // We add both gems score and the time score
                    finalScore =  player.score + timerScore;
                    // We send it to there to create a score which will be entered into the json file
                    CreateScore(finalScore);
                    // Game is on finish so we show the score
                    playerState = states.onFinish;
                    break;
                default:
                    break;
            }
        }
  }

}
