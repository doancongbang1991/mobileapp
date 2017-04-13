/**
 * Created by pawel on 20.10.2014.
 */
var BtnPlay = function()
{
    createjs.Container.call(this);

    var bg = new createjs.Sprite(Main.GetSpriteSheet("interface"));
    bg.gotoAndStop("btn_blue_large");
    this.addChild(bg);

    var bb = bg.getBounds();

    var text = new createjs.Text();
    text.textAlign = "center";
    text.textBaseline = "middle";
    text.color = "#ffffff";
    text.font = getFontStyle(".play_game");
    text.text = Main.COPY.getCopy("play_game");
    text.x = bb.width / 2;
    text.y = bb.height / 2 - 6;

    FixText(text, 10);

    var shadow = text.clone();
    shadow.color = "#000000";
    shadow.x -= 4;
    shadow.y += 4;

    this.addChild(shadow, text);

    this.cursor = "pointer";
};


BtnPlay.prototype = Object.create(createjs.Container.prototype);
BtnPlay.prototype.constructor = BtnPlay;

