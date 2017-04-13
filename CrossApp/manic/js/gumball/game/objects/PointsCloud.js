/**
 * Created by pawel on 19.05.2014.
 */
var PointsCloud = function(value, posX, posY)
{
    createjs.Container.call(this);

    var me = this;

    this.x = posX;
    this.y = posY;

    this.m_tfCopy = new createjs.Text();
    this.m_tfCopy.textAlign = "center";
    this.m_tfCopy.textBaseline = "bottom";
    this.m_tfCopy.color = "#ff0";
    this.m_tfCopy.font = "bold 50px gumball";
    this.m_tfCopy.x = 0;
    this.m_tfCopy.y = -50;
    this.m_tfCopy.text = value;

//    this.m_tfCopyOutline = this.m_tfCopy.clone();
//    this.m_tfCopyOutline.color = "#000";
//    this.m_tfCopyOutline.outline = 2;

    this.addChild(this.m_tfCopy);
//    this.addChild(this.m_tfCopyOutline);


    createjs.Tween.get(this).to({y: posY - 50}, 500).to({y: posY - 100, alpha: 0}, 300).call(this.onFadeEnd, null, this);
};


PointsCloud.prototype = Object.create(createjs.Container.prototype);
PointsCloud.prototype.constructor = PointsCloud;


PointsCloud.prototype.onFadeEnd = function()
{
    createjs.Tween.removeTweens(this);
    this.removeChild(this.m_tfCopy);
    delete this.m_tfCopy;
    this.parent.removeChild(this);

    delete this;
};