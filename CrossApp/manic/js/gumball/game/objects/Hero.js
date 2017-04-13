/**
 * Created by pawel on 08.05.2014.
 */
var Hero = function()
{
    createjs.Container.call(this);

    this.ANIM_STANDING = 0;
    this.ANIM_GRAB = 1;
    this.ANIM_UP = 2;
    this.ANIM_DOWN = 3;
    this.ANIM_SIDE = 4;
    this.ANIM_ANGRY = 5;
    this.ANIM_SUCCESS = 6;
    this.INFO = [
        {anim: "standing", w: 132, h: 201},
        {anim: "grab", w: 195, h: 184},
        {anim: "up", w: 124, h: 196},
        {anim: "down", w: 124, h: 190},
        {anim: "run_side", w: 135, h: 186},
        {anim: "angry", w: 134, h: 203},
        {anim: "success", w: 194, h: 220}
    ];

    this.SPOTS = [{x: 820, y: 250}, {x: 865, y: 420}, {x: 915, y: 605}];
    this.SPOT_SIZE = {w: 80, h: 80};

    this.m_currentAnim;
    this.m_spot;
    this.m_destLeft;
    this.m_destRight;
    this.m_nextMove;
    this.m_goLeft = false;
    this.m_goRight = false;
    this.m_isOnSpot = true;
    this.m_isServing = false;
    this.m_canServe = true;
    this.m_isStopped = false;
    this.init();

};

//Hero.prototype = new createjs.Container();
Hero.prototype = Object.create(createjs.Container.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.init = function()
{
    this.m_goUp = false;
    this.m_goDown = false;
    this.m_goLeft = false;
    this.m_goRight = false;
    this.m_isOnSpot = true;
    this.m_isServing = false;
    this.m_canServe = true;
    this.m_isStopped = false;
    this.m_spot = 1;

    //anims
    this.m_anim = new createjs.Sprite(Main.GetSpriteSheet("hero"));
    this.addChild(this.m_anim);

    //
    this.m_currentAnim = -1;
    this.showAnim(this.ANIM_STANDING);
};


Hero.prototype.remove = function()
{
    createjs.Tween.removeTweens(this);

    if (this.m_sndWalk)
    {
        this.m_sndWalk.stop();
        this.m_sndWalk = null;
    }
    this.m_anim.stop();
    this.m_anim = null;

    this.removeAllChildren();
};


Hero.prototype.updateSpots = function(benches)
{
    for (var i = 0; i < 3; i++)
    {
        this.SPOTS[i].y = benches[i].y + 110;
    }

    //update spot height
    this.SPOT_SIZE.h = (benches[1].y - benches[0].y) * 1;

    //update hero position
    if (this.m_isOnSpot)
    {
        this.setOnSpot();
    }
};


Hero.prototype.update = function()
{
    if (this.m_isStopped)
    {
        //
        if (this.m_currentAnim == this.ANIM_ANGRY)
        {
            var frame = this.m_anim.currentAnimationFrame;
            if (frame < 6)
            {
                this.m_canPlayFail = true;
                if (this.m_sndFail)
                {
                    this.m_sndFail.stop();
                }
            }
            else if (this.m_canPlayFail)
            {
                this.m_canPlayFail = false;
                if (!this.m_sndFail)
                {
                    this.m_sndFail = SoundsManager.PlaySound("fail");
                }
                else
                {
                    this.m_sndFail.play();
                }
            }
        }

        return;
    }

    //movement left/right
    if (this.m_tryGoUp)
    {
        this.goUp();
    }
    else if (this.m_tryGoDown)
    {
        this.goDown();
    }

    var speed = 12;
    if (this.m_goUp || this.m_goDown)
    {
        this.x += this.m_stepX;
        this.y += this.m_stepY;
        this.m_counter--;
        if (this.m_counter <= 0)
        {
            this.m_goUp = false;
            this.m_goDown = false;
            this.standOnSpot();
        }
    }
    else if (this.m_goLeft)
    {
        this.x -= speed;
        if (this.m_destLeft && this.x <= this.m_destLeft)
        {
            this.x = this.m_destLeft;
            this.stand();
        }
        else if (this.x > 100)
        {
            this.showAnim(this.ANIM_SIDE);
            this.scaleX = 1;
        }
        else
        {
            this.x = 100;
            this.stand();
        }
    }
    else if (this.m_goRight)
    {
        this.x += speed;

        if (this.m_destRight && this.x >= this.m_destRight)
        {
            this.x = this.m_destRight;
            this.stand();
        }
        else if (this.x < this.SPOTS[this.m_spot].x)
        {
            this.showAnim(this.ANIM_SIDE);
            this.scaleX = -1;
        }
        else
        {
            this.setOnSpot();
            this.stand();
        }
    }

    //serving
    if (this.m_isServing)
    {
        var frame = this.m_anim.currentAnimationFrame;
        if (frame >= 9)
        {
            this.m_isServing = false;
            this.stand();
            ScreenGame.PlaceVegOnBench(this.m_spot);
        }
    }
};


Hero.prototype.showAnim = function(animId)
{
    if (animId != this.m_currentAnim)
    {
        this.m_currentAnim = animId;

        var info = this.INFO[this.m_currentAnim];
        this.m_anim.gotoAndPlay(info.anim);
        this.m_anim.x = -info.w >> 1;
        this.m_anim.y = -info.h;

        //audio
        switch(animId)
        {
            case this.ANIM_DOWN:
            case this.ANIM_UP:
            case this.ANIM_SIDE:
                this.playWalkSound();
                break;

            default:
                this.stopWalkSound();
                break
        }
    }
};


Hero.prototype.goUp = function()
{
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        if (this.m_spot > 0)
        {
            this.setOnSpot();
            this.m_spot--;
            this.m_isOnSpot = false;

            this.m_goUp = true;
            this.m_counter = 10;
            this.m_stepX = (this.SPOTS[this.m_spot].x - this.x) / this.m_counter;
            this.m_stepY = (this.SPOTS[this.m_spot].y - this.y) / this.m_counter;

            this.showAnim(this.ANIM_UP);
        }
    }
};


Hero.prototype.goDown = function()
{
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        if (this.m_spot < 2)
        {
            this.setOnSpot();
            this.m_spot++;
            this.m_isOnSpot = false;

            this.m_goDown = true;
            this.m_counter = 10;
            this.m_stepX = (this.SPOTS[this.m_spot].x - this.x) / this.m_counter;
            this.m_stepY = (this.SPOTS[this.m_spot].y - this.y) / this.m_counter;

            this.showAnim(this.ANIM_DOWN);
        }
    }
};


Hero.prototype.startGoUp = function()
{
    if (!this.m_tryGoUp && !this.m_isStopped)
    {
        this.m_tryGoUp = true;
        this.m_tryGoDown = false;
        this.m_goRight = false;
        this.m_goLeft = false;
    }
};


Hero.prototype.stopGoUp = function()
{
    this.m_tryGoUp = false;
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        this.showAnim(this.ANIM_STANDING);
    }
};


Hero.prototype.startGoDown = function()
{
    if (!this.m_tryGoDown && !this.m_isStopped)
    {
        this.m_tryGoDown = true;
        this.m_tryGoUp = false;
        this.m_goRight = false;
        this.m_goLeft = false;
    }
};


Hero.prototype.stopGoDown = function()
{
    this.m_tryGoDown = false;
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        this.showAnim(this.ANIM_STANDING);
    }
};


Hero.prototype.startGoLeft = function()
{
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        this.m_goLeft = true;
        this.y = this.SPOTS[this.m_spot].y + 30;
    }
};


Hero.prototype.startGoRight = function()
{
    if (this.m_isOnSpot && !this.m_isServing && !this.m_isStopped)
    {
        this.m_goRight = true;
        this.y = this.SPOTS[this.m_spot].y + 30;
    }
};


Hero.prototype.stopGoLeft = function()
{
    if (!this.m_isStopped)
    {
        this.scaleX = 1;
        this.m_goLeft = false;
        if (!this.m_tryGoDown && !this.m_tryGoUp)
        {
            this.showAnim(this.ANIM_STANDING);
        }
    }
};


Hero.prototype.stopGoRight = function()
{
    if (!this.m_isStopped)
    {
        this.scaleX = 1;
        this.m_goRight = false;
        if (!this.m_tryGoDown && !this.m_tryGoUp)
        {
            this.showAnim(this.ANIM_STANDING);
        }
    }
};


Hero.prototype.stand = function()
{
    this.scaleX = 1;
    this.m_goLeft = false;
    this.m_goRight = false;
    this.showAnim(this.ANIM_STANDING);
};


Hero.prototype.setOnSpot = function()
{
    this.scaleX = 1;
    this.x = this.SPOTS[this.m_spot].x;
    this.y = this.SPOTS[this.m_spot].y;

    ScreenGame.OnPlaceHeroOnSpot(this.m_spot);
};


Hero.prototype.standOnSpot = function()
{
    this.scaleX = 1;
    this.m_isOnSpot = true;

    if (this.m_spot != 1 || !(this.m_tryGoDown || this.m_tryGoUp))
    {
        this.showAnim(this.ANIM_STANDING);
    }


    ScreenGame.OnPlaceHeroOnSpot(this.m_spot);

    //next move
    if (this.m_nextMove)
    {
        var next = this.m_nextMove;
        this.m_nextMove = null;
        if (next == "u")
        {
            this.goUp();
        }
        else
        {
            this.goDown();
        }
    }
};


Hero.prototype.serveVeg = function()
{
    if (this.m_isOnSpot && !this.m_isServing && this.m_canServe && !this.m_isStopped)
    {
        this.stand();

        this.m_isServing = true;
        this.m_canServe = false;
        this.setOnSpot();
        this.showAnim(this.ANIM_GRAB);

        SoundsManager.PlaySound("throw_veg");
    }
};


Hero.prototype.allowServNextVeg = function()
{
    this.m_canServe = true;
};


Hero.prototype.makeAngry = function()
{
    this.stop();
    this.showAnim(this.ANIM_ANGRY);
};


Hero.prototype.makeHappy = function()
{
    this.stop();
    this.showAnim(this.ANIM_SUCCESS);
};


Hero.prototype.stop = function()
{
    this.m_isStopped = true;
    createjs.Tween.removeTweens(this);
};


Hero.prototype.tryMoveTo = function(x0, y0)
{
    if (this.m_isStopped)
    {
        return;
    }

    var s = ScreenGame.s_container.scaleX;
    x0 /= s;
    y0 /= s;

    //check spots
    var spot = -1;
    for (var i = 0; i < 3; i++)
    {
        var dx = this.SPOTS[i].x - x0;
        var dy = this.SPOTS[i].y - 40 - y0;
        if (Math.abs(dx) < this.SPOT_SIZE.w && Math.abs(dy) < this.SPOT_SIZE.h / 2)
        {
            spot = i;
            break;
        }
    }

    if (spot >= 0)
    {
        if (spot < this.m_spot)
        {
            if (this.m_spot - spot == 2)
            {
                this.m_nextMove = "u";
            }
            this.stand();
            this.goUp();
        }
        else if (spot > this.m_spot)
        {
            if (spot - this.m_spot == 2)
            {
                this.m_nextMove = "d";
            }
            this.stand();
            this.goDown();
        }
        else
        {
            this.m_nextMove = null;
            this.serveVeg();
            this.allowServNextVeg();
        }
    }

    //try to walk left/right
    if (x0 < this.SPOTS[this.m_spot].x)
    {
        dy = y0 - ScreenGame.s_benches[this.m_spot].y;
        if (dy < 160 && dy > 0)
        {
            if (x0 < this.x)
            {
                this.m_destLeft = (x0 > 100) ? x0 : 100;
                this.startGoLeft();
            }
            else if (x0 > this.x)
            {
                this.m_destRight = (x0 < this.SPOTS[this.m_spot].x) ? x0 : this.SPOTS[this.m_spot].x;
                this.startGoRight();
            }
        }
    }
};


Hero.prototype.playWalkSound = function()
{
    if (this.m_sndWalk)
    {
        this.m_sndWalk.play();
    }
    else
    {
        this.m_sndWalk = SoundsManager.PlaySound("walk", {loop: -1});
    }
};


Hero.prototype.stopWalkSound = function()
{
    if (this.m_sndWalk)
    {
        this.m_sndWalk.stop();
    }
};