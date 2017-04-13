var GraphNode=function(){function t(t,n,r,e){this.x=t,this.y=n,this.z=r,this.weight=e,this.connections=[]}
return t.prototype.getConnections=function(){return this.connections},t.prototype.connectTo=function(t){this.connections.push(t)},t}(),Graph=function(){function t(){this.nodes=[]}
return t.prototype.getNode=function(t,n){for(var r=0;r<this.nodes.length;r++){var e=this.nodes[r];if(e.x==t&&e.y==n)return e}
return null},t.prototype.getNodes=function(){return this.nodes},t.prototype.fromArray=function(t){this.nodes=[];for(var n=t[0].length,r=t.length,e=0;r>e;e++)
for(var o=0;n>o;o++){var i=t[e][o],s=new GraphNode(o,e,0,i);this.nodes.push(s)}
for(var e=0;e<this.nodes.length;e++)
for(var a=this.nodes[e],u=-1;1>=u;u++)
for(var h=-1;1>=h;h++)
if((0!=u||0!=h)&&!(a.x+ u<0||a.x+ u>=n||a.y+ h<0||a.y+ h>=r)){var s=this.nodes[e+ n*h+ u];this.nodes[e].connectTo(s)}},t}(),Heuristic=function(){function t(){}
return t}(),AStar=function(){function t(t){this.graph=new Graph,this.setHeuristic(t)}
return t.prototype.getGraph=function(){return this.graph},t.prototype.getNode=function(t,n){return this.graph.getNode(t,n)},t.prototype.setHeuristic=function(t){this.heuristic=t},t.prototype.path=function(t,n){for(var r=new Array,e=new Array,o=new PathNode(0,this.heuristic.getHeuristic(t.x,t.y,t.z,n.x,n.y,n.z),null,t);o.data!=n;){for(var i=null,s=-1,a=0;a<r.length;a++)(null==i||i.f()>r[a].f())&&(i=r[a],s=a);null!=i&&(r.splice(s,1),e.push(i),o=i);for(var u=o.data.getConnections(),a=0;a<u.length;a++){for(var h=!0,c=-1,p=0;p<r.length;p++)r[p].data.x==u[a].x&&r[p].data.y==u[a].y&&r[p].data.z==u[a].z&&(c=p);for(var p=0;p<e.length;p++)e[p].data.x==u[a].x&&e[p].data.y==u[a].y&&e[p].data.z==u[a].z&&(h=!1);var f=u[a],d=o.g;d+=Math.sqrt(Math.pow(o.data.x- f.x,2)+ Math.pow(o.data.y- f.y,2)+ Math.pow(o.data.z- f.z,2))*f.weight;var y=this.heuristic.getHeuristic(f.x,f.y,f.z,n.x,n.y,n.z);- 1==c&&h?r.push(new PathNode(d,y,o,f)):c>-1&&d+ y<r[c].f()&&h&&(r[c].g=d,r[c].h=y,r[c].previous=o)}}
for(var l=new Array;null!=o;)l.push(o.data),o=o.previous;return l.reverse(),l},t.prototype.load=function(t){this.graph.fromArray(t)},t}(),PathNode=function(){function t(t,n,r,e){this.g=t,this.h=n,this.previous=r,this.data=e}
return t.prototype.f=function(){return this.g+ this.h},t}(),__extends=this&&this.__extends||function(t,n){function r(){this.constructor=t}
for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)},DijkstrasHeuristic=function(t){function n(){t.call(this)}
return __extends(n,t),n.prototype.getHeuristic=function(t,n,r,e,o,i){return 0},n}(Heuristic),EuclideanHeuristic=function(t){function n(){t.call(this)}
return __extends(n,t),n.prototype.getHeuristic=function(t,n,r,e,o,i){return Math.sqrt(Math.pow(e- t,2)+ Math.pow(o- n,2)+ Math.pow(i- r,2))},n}(Heuristic),ManhattenHeuristic=function(t){function n(){t.call(this)}
return __extends(n,t),n.prototype.getHeuristic=function(t,n,r,e,o,i){return Math.abs(e- t)+ Math.abs(o- n)+ Math.abs(i- r)},n}(Heuristic);