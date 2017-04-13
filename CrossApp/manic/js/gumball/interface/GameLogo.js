/**
 * Created by pawel on 04.12.2014.
 */
var GameLogo = function()
{
    createjs.Container.call(this);

    var tfTitle1 = new createjs.Text();
    tfTitle1.textAlign = "center";
    tfTitle1.color = "#C4ED13";
    tfTitle1.font = getFontStyle(".manic");
    tfTitle1.text = Main.COPY.getCopy("manic");
    FixText(tfTitle1);

    var outline1 = tfTitle1.clone();
    outline1.color = "#990066";
    outline1.outline = 3;

    var tfTitle2 = new createjs.Text();
    tfTitle2.textAlign = "center";
    tfTitle2.color = "#F857A3";
    tfTitle2.font = getFontStyle(".canteen");
    tfTitle2.text = Main.COPY.getCopy("canteen");
    tfTitle2.y = 85;
    FixText(tfTitle2);

    var outline2 = tfTitle2.clone();
    outline2.color = "#990066";
    outline2.outline = 3;

    this.addChild(tfTitle1, tfTitle2, outline1, outline2);
};


GameLogo.prototype = Object.create(createjs.Container.prototype);
GameLogo.prototype.constructor = GameLogo;