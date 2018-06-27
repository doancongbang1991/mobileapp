/**
 * Created by pawel on 13.05.2014.
 */
var Money = function(benchId, hero)
{
    createjs.Container.call(this);

    this.m_benchId = benchId;
    this.m_hero = hero;

    this.m_anim = new createjs.Sprite(Main.GetSpriteSheet("money"));
    this.addChild(this.m_anim);
    this.m_anim.gotoAndPlay("loop");

    this.m_stopped = false;

    this.m_anim.x = -112;
    this.m_anim.y = -100;
};


Money.prototype = Object.create(createjs.Container.prototype);
Money.prototype.constructor = Money;


Money.prototype.remove = function()
{
    ScreenGame.RemoveMoney(this);
    this.m_anim.stop();
    this.removeChild(this.m_anim);
    this.parent.removeChild(this);
    this.m_anim = null;
    delete this;
};


Money.prototype.update = function()
{
    if (this.m_stopped)
    {
        return;
    }

    if (this.m_benchId == this.m_hero.m_spot)
    {
        var pos = this.localToGlobal(0, 0);
        pos = this.m_hero.parent.globalToLocal(pos.x, pos.y);
        var dx = this.m_hero.x - pos.x;
        if (Math.abs(dx) < 80)
        {
            this.collect();
        }
    }
};


Money.prototype.stop = function()
{
    this.m_stopped = true;
};


Money.prototype.collect = function()
{
    SoundsManager.PlaySound("pickup_candy");

    ScreenGame.RemoveMoney(this);
    ScreenGame.OnCollectMoney(this);
    this.remove();
};