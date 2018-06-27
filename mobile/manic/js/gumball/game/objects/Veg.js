/**
 * Created by pawel on 08.05.2014.
 */

//-----------------------------------------------------------------------------
// Veg
//-----------------------------------------------------------------------------

var rottenVegChance = 0.5;

var Veg = function (benchId, hero)
{
    createjs.Container.call(this);

    this.INFO = [
        {name: "food1", anims: {
            good: {x: -32, y: -50},
            rotten: {x: -32, y: -50},
            splash: {x: -35, y: -63}
        }},
        {name: "food2", anims: {
            good: {x: -32, y: -90},
            rotten: {x: -32, y: -90},
            splash: {x: -46, y: -35}
        }},
        {name: "food3", anims: {
            good: {x: -51, y: -41},
            rotten: {x: -51, y: -41},
            splash: {x: -53, y: -41}
        }}
    ];

    //
    this.TYPE_GOOD = 1;
    this.TYPE_ROTTEN = 2;

    //
    this.m_stopped = false;
    this.m_benchId = benchId;
    this.m_hero = hero;
    this.m_info = this.INFO[3 * Math.random() | 0];
    this.m_anim = new createjs.Sprite(Main.GetSpriteSheet("food"));

    if (Math.random() < rottenVegChance)
    {
        rottenVegChance = 0.5;
        this.m_type = this.TYPE_ROTTEN;

        this.setAnim("rotten")
    }
    else
    {
        rottenVegChance += 0.1;
        this.m_type = this.TYPE_GOOD;

        this.setAnim("good");
    }
    this.m_speed = 0;
    this.m_collected = false;

    //
    this.addChild(this.m_anim);
};


Veg.prototype = Object.create(createjs.Container.prototype);
Veg.prototype.constructor = Veg;


Veg.prototype.update = function()
{
    if (this.m_stopped || this.m_collected)
    {
        return;
    }

    //
    this.x += this.m_speed;

    if (this.m_speed < 0)
    {
        if (this.x < 0)
        {
            ScreenGame.GameFailed();
        }
    }
    if (this.m_speed > 0)
    {
        //rotten fruit comes back
        if (this.m_benchId == this.m_hero.m_spot)
        {
            var pos = this.localToGlobal(0, 0);
            pos = this.m_hero.parent.globalToLocal(pos.x, pos.y);
            var dx = this.m_hero.x - pos.x;
            if (Math.abs(dx) < 90)
            {
                this.collectRotten();
            }
        }
        else if (this.x > ScreenGame.BENCH_END[this.m_benchId])
        {
            this.splash();
        }
    }
};


Veg.prototype.remove = function()
{
    ScreenGame.RemoveVeg(this);
    if (this.m_anim)
    {
        this.m_anim.stop();
        this.removeChild(this.m_anim);
        this.m_anim = null;
        this.parent.removeChild(this);
    }
    delete this;
};


Veg.prototype.rollToCustomer = function()
{
    this.scaleX = 1;
    this.m_speed = -20;
    this.setAnim(this.m_type == this.TYPE_GOOD ? "good" : "rotten");
    this.y = 35;
};


Veg.prototype.rollBack = function()
{
    this.scaleX = -1;
    this.m_speed = 7;
    this.setAnim(this.m_type == this.TYPE_GOOD ? "good" : "rotten");
    this.y = 35;

    this.m_collected = false;
};


Veg.prototype.setAnim = function(anim)
{
    this.m_anim.gotoAndPlay(this.m_info.name + "_" + anim);
    this.m_anim.x = this.m_info.anims[anim].x;
    this.m_anim.y = this.m_info.anims[anim].y;
};


Veg.prototype.splash = function()
{
    this.setAnim("splash");
    this.m_speed = 0;
    this.y = 110;
    this.x += 40;

    SoundsManager.PlaySound("veg_splat");

    ScreenGame.GameFailed();

    //blink
    createjs.Tween.get(this).to({visible: false}, 300).to({visible: true}, 200).to({visible: false}, 200).
        to({visible: true}, 200).to({visible: false}, 200).
        to({visible: true}, 100).to({visible: false}, 100).
        to({visible: true}, 50).to({visible: false}, 50).
        to({visible: true}, 50).to({visible: false}, 50).call(this.remove, [], this);
};


Veg.prototype.collectRotten = function()
{
    SoundsManager.PlaySound("collect_veg");

    this.remove();
};


Veg.prototype.pickUp = function()
{
    this.m_speed = 0;
    this.m_anim.stop();
    this.m_collected = true;
};


Veg.prototype.isRotten = function()
{
    return (this.m_type == this.TYPE_ROTTEN);
};


Veg.prototype.stop = function()
{
    this.m_stopped = true;
    this.m_anim.stop();
};