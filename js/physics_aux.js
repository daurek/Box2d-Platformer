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


    // create the surface (an static object)
    // left wall
    CreateBox(world, 0, 1, .1, 8, {type : b2Body.b2_staticBody, friction: 0});
    // down wall
    CreateBox(world, 8, 0.25, 16, .2, {type : b2Body.b2_staticBody});
    // top wall
    CreateBox(world, 8, 6, 16, .2, {type : b2Body.b2_staticBody});
    // right wall
    CreateBox(world, 20.7, 1, .1, 8, {type : b2Body.b2_staticBody, friction: 0});

    return world;
}

function PreparePhysics (ctx)
{
    // gravity vector
    gravity = new b2Vec2(0, -10);

    CreateWorld(ctx, gravity);

    // prepare the collision event function
    Box2D.Dynamics.b2ContactListener.prototype.BeginContact = OnContactDetected;
}

function OnContactDetected (contact)
{
    var a = contact.GetFixtureA().GetBody().GetUserData();
    var b = contact.GetFixtureB().GetBody().GetUserData();

    if (a != null && b != null && typeof(a.type) !== 'undefined' && typeof(b.type) !== 'undefined')
    {
      //console.log("collision between " + a.type + " and " + b.type);
        if(a.type == 'player')
        {
            player.grounded = true;
            switch (b.type)
            {
                case 'gem':
                    if(!b.taken)
                      {
                          b.taken = true;
                          player.score += 10;
                      }
                      break;
                case 'spikes':
                    player.isDead = true;
                    break;
                case 'switch':
                    if(b.closed)
                    {
                        for (var i = 0; i < doors.length; i++)
                        {
                            if(b.switchId == doors[i].doorId)
                            {
                                b.closed = false;
                                doors[i].open = true;
                                break;
                            }
                        }
                    }
                    break;
                case 'checkpoint':
                    if(!b.checked)
                      {
                          b.checked = true;
                          playerSpawn.xPos = b.position.x;
                          playerSpawn.yPos = b.position.y;
                      }
                      break;
                default:
                    break;
            }
        }
  }

}
