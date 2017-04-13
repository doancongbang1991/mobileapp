/**
 * Created by pawel on 08.05.2014.
 */

var returnVegChance = 0.5;

var Customer = function(id, benchId, startX, vegs)
{
    createjs.Container.call(this);

    this.INFO = [
        {anim: "customer1", speed: 1.0, objX: 175, objY: 74, walkW: 164, walkH: 162, grabW: 189, grabH: 157},
        {anim: "customer2", speed: 1.0, objX: 127, objY: 18, walkW: 151, walkH: 134, grabW: 139, grabH: 128},
        {anim: "customer3", speed: 1.3, objX: 178, objY: 62, walkW: 208, walkH: 154, grabW: 190, grabH: 143},
        {anim: "customer4", speed: 1.6, objX: 160, objY: 12, walkW: 123, walkH: 104, grabW: 167, grabH: 99},
        {anim: "ch1", speed: 0.7, objX: 140, objY: 80, walkW: 128, walkH: 118, grabW: 148, grabH: 114},
        {anim: "ch2", speed: 0.7, objX: 109, objY: 98, walkW: 121, walkH: 141, grabW: 119, grabH: 135},
        {anim: "ch3", speed: 0.7, objX: 195, objY: 57, walkW: 222, walkH: 144, grabW: 206, grabH: 144},
        {anim: "ch4", speed: 0.7, objX: 102, objY: 109, walkW: 137, walkH: 148, grabW: 137, grabH: 135},
        {anim: "ch5", speed: 0.7, objX: 164, objY: 134, walkW: 157, walkH: 185, grabW: 181, grabH: 185},
        {anim: "ch6", speed: 0.7, objX: 105, objY: 80, walkW: 121, walkH: 181, grabW: 109, grabH: 166},
        {anim: "ch7", speed: 0.7, objX: 135, objY: 40, walkW: 105, walkH: 131, grabW: 144, grabH: 122}
    ];

    this.STATE_GO_TO_START = 0;
    this.STATE_GO_FORWARD = 1;
    this.STATE_GO_BACK = 2;

    //
    this.m_speed = 7;
    this.m_veg;
    this.m_stopped = false;
    this.m_startX = startX;
    this.m_state = this.STATE_GO_TO_START;

    this.m_benchId = benchId;
    this.m_vegs = vegs;
    this.m_returnVeg = false;

    /*if (Math.random() < 0.5)
    {
        //crowd character
        this.m_type = 4 + 6 * Math.random() | 0;
    }
    else
    {
        //normal customer
        this.m_type = range * Math.random() | 0;
    }*/
    this.m_type = id;
    this.m_info = this.INFO[this.m_type];
    this.m_anim = new createjs.Sprite(Main.GetSpriteSheet("customers"));
    this.m_name = this.m_info.anim;
    this.m_anim.gotoAndPlay(this.m_name + "_walk");
    this.m_anim.x = -this.m_info.walkW >> 1;
    this.m_anim.y = -this.m_info.walkH;
    this.y += 10;
    this.addChild(this.m_anim);
};


Customer.prototype = Object.create(createjs.Container.prototype);
Customer.prototype.constructor = Customer;


Customer.prototype.remove = function()
{
    ScreenGame.RemoveCustomer(this, this.m_benchId);
    this.m_anim.stop();
    this.removeChild(this.m_anim);
    this.parent.removeChild(this);
    this.m_anim = null;
    if (this.m_veg)
    {
        this.m_veg.remove();
        this.m_veg = null;
    }
    delete this;
};


Customer.prototype.update = function()
{
    if (this.m_stopped)
    {
        return;
    }

    //
    this.x += this.m_speed;
    switch (this.m_state)
    {
        case this.STATE_GO_TO_START:
            var dx = this.m_startX - this.x;
            if (dx < 10)
            {
                this.goForward();
            }
            else if (dx < 100)
            {
                this.m_speed += (this.m_info.speed - this.m_speed) * 0.2;
            }

        case this.STATE_GO_FORWARD:
            //check end of bench
            if (this.x >= ScreenGame.BENCH_END[this.m_benchId] - this.m_info.walkW * 0.7)
            {
                this.stop();
                ScreenGame.GameFailed();
            }

            //check vegs
            for (var i = 0; i < this.m_vegs.length; i++)
            {
                var veg = this.m_vegs[i];
                var dx = this.x - veg.x;
                if (!veg.m_collected && veg.m_benchId == this.m_benchId && veg.m_speed < 0 && Math.abs(dx) < 70)
                {
                    this.pickupVeg(veg);
                    break;
                }
            }
            break;

        case this.STATE_GO_BACK:
            this.m_goBackTime--;
            if (this.m_goBackTime == 0)
            {
                this.goForward();

                if (this.m_returnVeg)
                {
                    ScreenGame.ReturnVegOnBench(this.m_veg, this, this.m_benchId);
                }
                else
                {
                    this.m_veg.remove();
                }
            }
            else
            {
                if (this.x < -this.m_info.walkW / 2 - this.parent.x + 5)
                {
                    ScreenGame.OnGoodByCustomer(this, this.m_benchId);
                    this.remove();
                }
            }

            if (this.m_goBackTime < 10)
            {
                this.m_speed -= this.m_speed * 0.2;
            }
            break;

    }
};


Customer.prototype.goForward = function()
{
    this.m_state = this.STATE_GO_FORWARD;
    this.m_speed = this.m_info.speed;
    this.m_anim.gotoAndPlay(this.m_name + "_walk");
    this.m_anim.x = -this.m_info.walkW >> 1;
    this.m_anim.y = -this.m_info.walkH;
};


Customer.prototype.pickupVeg = function(veg)
{
    this.m_state = this.STATE_GO_BACK;

    this.m_veg = veg;

    //
    if (this.m_type < 4 && this.m_veg.isRotten() && Math.random() < returnVegChance)
    {
        returnVegChance = 0.5;
        this.m_returnVeg = true;
        this.m_speed = -4;
        this.m_goBackTime = 30 + parseInt(20 * Math.random());
    }
    else
    {
        returnVegChance += 0.1;
        this.m_returnVeg = false;
        this.m_speed = -7;
        this.m_goBackTime = (this.m_type < 4) ? 50 + parseInt(20 * Math.random()) : 1000;
    }

    //
    this.m_anim.gotoAndStop(this.m_name + "_grab");
    this.m_anim.x = -this.m_info.grabW >> 1;
    this.m_anim.y = -this.m_info.grabH;

    //
    this.m_veg.pickUp();
    this.m_veg.x = this.m_anim.x + this.m_info.objX;
    this.m_veg.y = this.m_anim.y + this.m_info.objY;
    this.addChild(this.m_veg);

    //give tip
    if (Math.random() < 0.15)
    {
        ScreenGame.AddMoneyToBench(this, this.m_benchId);
    }
};


Customer.prototype.stop = function()
{
    this.m_stopped = true;
    this.m_anim.stop();
};


Customer.prototype.getWidth = function()
{
    return this.m_info.walkW;
};