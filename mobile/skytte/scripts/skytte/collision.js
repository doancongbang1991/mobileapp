define('skytte.collision', ['skytte.vector2'], function(Vector2) {
    var collision = {};

    /*
     * Flattens the specified array of points onto a unit vector axis, resulting in a one dimensional range
     * of the minimum and maximum value on that axis.
     */
    collision._flattenPointsOn = function(points, normal) {
        var min = Number.MAX_VALUE, max = -Number.MAX_VALUE, dot, i;
        for (i = 0; i < points.length; i++) {
            // Get the magnitude of the projection of the point onto the normal
            dot = points[i].x * normal.x + points[i].y * normal.y;
            if (dot < min)
                min = dot;
            if (dot > max)
                max = dot;
        }
        return [min, max];
    };

    /*
     * Check whether two convex clockwise polygons are separated by the specified axis (must be a unit vector).
     */
    collision._isSeparatingAxis = function(posA, pointsA, posB, pointsB, axis) {
        var offset = (posB.x - posA.x) * axis.x + (posB.y - posA.y) * axis.y;
        var rangeA = collision._flattenPointsOn(pointsA, axis);
        var rangeB = collision._flattenPointsOn(pointsB, axis);
        rangeB[0] += offset;
        rangeB[1] += offset;

        // Check if there is a gap. If there is, this is a separating axis and we can stop.
        if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1])
            return true;
        return false;
    };

    /*
     * Checks whether two convex, clockwise polygons intersect.
     */
    collision.testPolygons = function(posA, polygonA, posB, polygonB) {
        var i;
        for (i = 0; i < polygonA.points.length; i++)
            if (collision._isSeparatingAxis(posA, polygonA.points, posB, polygonB.points, polygonA.normals[i]))
                return false;
        for (i = 0; i < polygonB.points.length; i++)
            if (collision._isSeparatingAxis(posA, polygonA.points, posB, polygonB.points, polygonB.normals[i]))
                return false;
        return true;
    };

    collision.testBoundingBoxes = function(posA, boxA, posB, boxB) {
        return !(posA.x + boxA.x > posB.x + boxB.x + boxB.width || posB.x + boxB.x > posA.x + boxA.x + boxA.width ||
                posA.y + boxA.y > posB.y + boxB.y + boxB.height || posB.y + boxB.y > posA.y + boxA.y + boxA.height);
    };

    collision.testPointInBoundingBox = function(point, box) {
        if (point.x < box.x || point.x > box.x + box.width || point.y < box.y || point.y > box.y + box.height)
            return false;
        return true;
    };

    return collision;
});
