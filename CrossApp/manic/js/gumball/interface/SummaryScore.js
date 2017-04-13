/**
 * Created by pawel on 04.12.2014.
 */

var SummaryScore = function (amount, score)
{
    createjs.Container.call(this);

    var tfAmount = new createjs.Text();
    tfAmount.color = "#C4EC12";
    tfAmount.font = getFontStyle(".summary_amount");
    tfAmount.text = "x" + amount;
    FixText(tfAmount);

    var tfScore = new createjs.Text();
    tfScore.color = "#FFFFFF";
    tfScore.font = getFontStyle(".summary_pts");
    tfScore.text = score + "";
    tfScore.y = 106;
    FixText(tfScore);

    var tfPts = new createjs.Text();
    tfPts.color = "#F856A2";
    tfPts.font = getFontStyle(".summary_pts");
    tfPts.text = Main.COPY.getCopy("pts");
    tfPts.x = tfScore.getBounds().width + 2;
    tfPts.y = 106;
    FixText(tfPts);

    this.addChild(tfAmount, tfScore, tfPts);
};


SummaryScore.prototype = Object.create(createjs.Container.prototype);
SummaryScore.prototype.constructor = SummaryScore;