/**
 * Created by pawel on 06.10.2014.
 */
var Collision =
{
    CheckRects: function(rectA, rectB)
    {
        if (rectA.x < rectB.x + rectB.w && rectA.x + rectA.w > rectB.x &&
            rectA.y < rectB.y + rectB.h && rectA.y + rectA.h > rectB.y)
        {
            return true;
        }

        return false;
    }
};