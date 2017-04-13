/**
 * Created by pawel on 20.10.2014.
 */
var BtnContinue = function()
{
    createjs.Container.call(this);

    var bg = new createjs.Sprite(Main.GetSpriteSheet("interface"));
    bg.gotoAndStop("btn_blue_medium");
    this.addChild(bg);

    var bb = bg.getBounds();

    var text = new createjs.Text();
    text.textAlign = "center";
    text.textBaseline = "middle";
    text.color = "#ffffff";
    text.font = getFontStyle(".continue");
    text.text = Main.COPY.getCopy("continue");
    text.x = bb.width / 2;
    text.y = bb.height / 2 - 5;

    FixText(text, 10);

    var shadow = text.clone();
    shadow.color = "#000000";
    shadow.x -= 4;
    shadow.y += 4;

    this.addChild(shadow, text);

    this.cursor = "pointer";
};


BtnContinue.prototype = Object.create(createjs.Container.prototype);
BtnContinue.prototype.constructor = BtnContinue;

