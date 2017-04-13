function toRadian(iValue){
    return ((iValue) * (Math.PI  /180));
}

function toDegree( n ) {
    return ((n) * (180 / Math.PI));
}

function randRange(min, max) {	
    return (Math.floor(Math.random() * (max - min + 1)) + min) ;
}

function angleBetweenVectors( v1, v2){
    var iAngle= Math.acos( dotProductV2( v1, v2 ) / (v1.length() * v2.length()) );
    if ( isNaN( iAngle ) === true ){
        return 0;
    }else{
        return iAngle;
    }
}

function rotateVector2D( iAngle, v ) {		
    var iX = v.getX() *   Math.cos( iAngle )  + v.getY() * Math.sin( iAngle );
    var iY = v.getX() * (-Math.sin( iAngle )) + v.getY() * Math.cos( iAngle );		
    v.set( iX, iY );
}

function reflectVectorV2( v, n ) {
    var vRet = new CVector2();
    var dotP  = dotProductV2( v,n );
    vRet.set( (v.getX() - (2 * dotP * n.getX())), (v.getY() - (2 * dotP * n.getY())) );
    return vRet;
}

function dotProductV2(v1,v2){
    return ( v1.getX()*v2.getX()+ v1.getY() * v2.getY() );
}

function pointInRect(p, r) {
    return p.getX() > r.x && p.getX() < (r.x + r.width) && p.getY() > r.y && p.getY() < (r.y + r.height);
}


function distance2( v1, v2 ){
    return ( (v2.getX()-v1.getX())*(v2.getX()-v1.getX()) ) + ( (v2.getY()-v1.getY())*(v2.getY()-v1.getY()) );
}