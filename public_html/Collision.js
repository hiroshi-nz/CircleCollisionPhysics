/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Rectangle(x, y, z, height, width){                         
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = height;
    this.width = width;
    this.maxX = x + width / 2;
    this.minX = x - width / 2;
    this.maxY = y + height / 2;
    this.minY = y - height / 2;

    this.collision = function(x, y, z){
      if(z === this.z){
          if(z === this.z || x <= this.maxX || x >= this.minX|| y <= this.maxY || y >= this.minY){
              return true;
          }else{
              return false;
          }
      }  
    };
}          
function Sphere(x, y, z, radius){
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.collision = function(x, y, z){
        //not sure but using 3d pythagorean? then check the distance between center and a point is less or equal to radius.
        var deltaX = this.x - x;
        var deltaY = this.y - y;
        var deltaZ = this.z - z;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        if(distance <= this.radius){
            return true;
        }else{
            return false;
        }
    };
}

function Circle(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.circlesFindLine = function(circle1, circle2){
        var x1 = circle1.x;
        var y1 = circle1.y;
        var r1 = circle1.radius;
        var x2 = circle2.x;
        var y2 = circle2.y;
        var r2 = circle2.radius;

        var slope = (-x1 + x2)/(y1 - y2);
        var yIntercept = (-x1 * x1 + x2 * x2 - y1 * y1 + y2 * y2 + r1 * r1 - r2 * r2) / (-2 * y1 + 2 * y2);
        var commonLine = new Line();
        //console.log("findLineOfTwoCircles: y=" + slope + "x+" + yIntercept);
        commonLine.fromSlopeAndYIntercept(slope, yIntercept);
        return commonLine;
    };
}
function Point(x, y){
    this.x = x;
    this.y = y;
    
    this.pointsFindY = function(distance, x){//2 points relation
        var deltaX = this.x - x;
        var deltaY = Math.sqrt(distance * distance - deltaX * deltaX);
        var y = this.y - deltaY;
        return y;
    };
    this.pointsFindX = function(distance, y){//2 points relation
        var deltaY = this.y - y;
        var deltaX = Math.sqrt(distance * distance - deltaY * deltaY);
        var x = this.x - deltaX;
        return x;
    };
    this.pointsFindDistance = function(x1, y1, x2, y2){
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distance;
    }; 
}
function Line(){//tangent90 is undefined, so I have to do something about it. Detect, prevent.
    this.slope;
    this.yIntercept;
    this.fromTwoPoints = function(x1, y1, x2, y2){
        this.slope = (y2 - y1) / (x2 - x1);
        this.yIntercept = - this.slope * x2 + y2;
        //console.log("y=" + this.slope + "x+" + this.yIntercept);
    };
    this.fromSlopeAndYIntercept = function(slope, yIntercept){
      this.slope = slope;
      this.yIntercept = yIntercept;
    };
    this.fromSlopeAndPoint = function(slope, x, y){
        this.slope = slope;
        this.yIntercept = y - slope * x; 
    };
    this.findX = function(y){
        var x = (y - this.yIntercept) / this.slope;
        return x;
    };
    this.findY = function(x){
        var y = this.slope * x + this.yIntercept;
        return y;
    };
    this.findAngle = function(){
        var angle = radianToAngle(Math.atan(this.slope));
        return angle;
    };
    
    this.linesFindPoint = function(line1, line2){
        var a1 = line1.slope;
        var b1 = line1.yIntercept;
        var a2 = line2.slope;
        var b2 = line2.yIntercept;

        var x = (-b1 + b2) / (a1 -a2);
        var y = a1 * x + b1;
        var point = new Point(x, y);
        return point;
    };
}
//2d circles collision
function PhysicsObjectCircle(x, y, radius, magnitude, direction, mass){//inherited from circle
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity;
    this.mass = mass;
    
    this.initialize = function(magnitude, direction){
        this.velocity = new Vector(magnitude, direction);
    };
    
    this.circlesFindLine = function(circle1, circle2){
        var x1 = circle1.x;
        var y1 = circle1.y;
        var r1 = circle1.radius;
        var x2 = circle2.x;
        var y2 = circle2.y;
        var r2 = circle2.radius;

        var slope = (-x1 + x2)/(y1 - y2);
        var yIntercept = (-x1 * x1 + x2 * x2 - y1 * y1 + y2 * y2 + r1 * r1 - r2 * r2) / (-2 * y1 + 2 * y2);
        var commonLine = new Line();
        //console.log("findLineOfTwoCircles: y=" + slope + "x+" + yIntercept);
        commonLine.fromSlopeAndYIntercept(slope, yIntercept);
        return commonLine;
    };
    this.initialize(magnitude, direction);
}

function PhysicsCollision(circle1, circle2){//need PhysicsObjectCircles
    //circles
    this.circle1 = circle1;
    this.circle2 = circle2;
    this.collisionCircle1;
    //this.collisionCircle2;
    //this.circle1Final;
    //this.circle2Final;
    //line
    this.initialPath1;
    this.finalPath1;
    this.finalPath2;
    this.tangentLine;
    //point
    this.tangentPoint;
    //angle
    this.initialAngle1;
    this.finalAngle1;
    //this.angleDelta1;
    this.finalAngle2;
    //arrays for drawing
    this.circles = [];
    this.lines = [];
    this.points = [];
    
    this.findTangentCircles = function(circle1, circle2){//this.findPointOnLine new one
        this.initialPath1 = new Line();
        this.initialPath1.fromSlopeAndPoint(Math.tan(angleToRadian(circle1.velocity.direction)), circle1.x, circle1.y);
        this.initialAngle1 = this.initialPath1.findAngle();
        console.log("tan:" + Math.tan(angleToRadian(circle1.velocity.direction)));
        console.log("initialAngle:" + this.initialAngle1);   
        var distance = circle1.radius + circle2.radius;  
        //to find a point xy.
        var a = this.initialPath1.slope;
        var b = this.initialPath1.yIntercept;
        var x1 = circle2.x;
        var y1 = circle2.y;
        //solving cx^2 + dx + e
        var c = 1 + a * a;
        var d = -2 * x1 + 2 * a * (b - y1);
        var e = - distance * distance + x1 * x1 + (y1 - b) * (y1 - b);

        var quad = new QuadraticFormula(c, d, e);
        var collisionCircleCenter = new Point(quad.x1, this.initialPath1.findY(quad.x1));
        var collisionCircleCenter2 = new Point(quad.x2, this.initialPath1.findY(quad.x2));
        
        var distance1 = collisionCircleCenter.pointsFindDistance(quad.x1, this.initialPath1.findY(quad.x1), circle1.x, circle1.y);
        var distance2 = collisionCircleCenter2.pointsFindDistance(quad.x2, this.initialPath1.findY(quad.x2), circle1.x, circle1.y);
        
        if(distance1 <= distance2){
            this.collisionCircle1 = new PhysicsObjectCircle(collisionCircleCenter.x, collisionCircleCenter.y, this.circle1.radius, 0, 0, 0);
            //this.collisionCircle2 = new PhysicsObjectCircle(collisionCircleCenter2.x, collisionCircleCenter2.y, this.circle1.radius, 0, 0, 0);
        }else{
            this.collisionCircle1 = new PhysicsObjectCircle(collisionCircleCenter2.x, collisionCircleCenter2.y, this.circle1.radius, 0, 0, 0);
            //this.collisionCircle2 = new PhysicsObjectCircle(collisionCircleCenter.x, collisionCircleCenter.y, this.circle1.radius, 0, 0, 0);
        }
    };
    
    this.initialize = function(){//new one
        this.findTangentCircles(this.circle1, this.circle2);//also initialize initalPath1
        
        this.finalPath2 = new Line();
        this.finalPath2.fromTwoPoints(this.circle2.x, this.circle2.y, this.collisionCircle1.x, this.collisionCircle1.y);
        this.finalAngle2 = this.finalPath2.findAngle();
        
        this.tangentLine = circle2.circlesFindLine(circle2, this.collisionCircle1);
        this.tangentPoint = this.tangentLine.linesFindPoint(this.tangentLine, this.finalPath2);

        var finalPath1YIntercept = this.collisionCircle1.y - this.tangentLine.slope * this.collisionCircle1.x;
        this.finalPath1 = new Line();
        this.finalPath1.fromSlopeAndYIntercept(this.tangentLine.slope, finalPath1YIntercept);
        this.finalAngle1 = this.finalPath1.findAngle();
        //console.log(this.initialAngle1 + "d" + this.finalAngle1 + "d" + this.finalAngle2 + "d");
    };
    
    this.initialize();
    
    this.createArrays = function(){
        this.circles.push(this.circle1);
        this.circles.push(this.circle2);
        this.circles.push(this.collisionCircle1);
        //this.circles.push(this.collisionCircle2);

        //make sure unnecessary lines turn off when those are not used.
        this.lines.push(this.initialPath1);
        this.lines.push(this.finalPath1);
        this.lines.push(this.finalPath2);
        this.lines.push(this.tangentLine);
        
        var circle1Point = new Point(circle1.x, circle1.y);
        var circle2Point = new Point(circle2.x, circle2.y);
        var collisionCircle1Point = new Point(this.collisionCircle1.x, this.collisionCircle1.y);
        //var collisionCircle2Point = new Point(this.collisionCircle2.x, this.collisionCircle2.y);
        
        this.points.push(circle1Point);
        this.points.push(circle2Point);
        this.points.push(collisionCircle1Point);
        //this.points.push(collisionCircle2Point);
        this.points.push(this.tangentPoint);
    };
};

function Vector(magnitude, direction){
    this.magnitude = magnitude;
    this.direction = keepWithin360(direction);
    this.xComponent = magnitude * Math.cos(angleToRadian(direction));
    this.yComponent = magnitude * Math.sin(angleToRadian(direction));
    
    this.calculateComponents = function(){
        this.xComponent = this.magnitude * Math.cos(angleToRadian(this.direction));
        this.yComponent = this.magnitude * Math.sin(angleToRadian(this.direction));
    };
    this.update = function(magnitude, direction){
        this.magnitude = magnitude;
        this.direction = keepWithin360(direction);
        this.calculateComponents();
    };  
    this.updateMagnitude = function(magnitude){
        this.magnitude = magnitude;
        this.calculateComponents();
        
    };
    this.updateDirection = function(direction){
        this.direction = keepWithin360(direction);
        this.calculateComponents();
    };
}

function DrawGeometries(scene){
    this.scene = scene;
    this.meshGroup;
    
    this.circles = [];
    this.lines = [];
    this.points = [];
    
    //I need to track in order to dispose objects
    this.circleMeshes = [];
    this.lineMeshes = [];
    this.pointMeshes = [];
    
    this.white = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//white
    this.blue = new THREE.MeshBasicMaterial( {color: 0x0000ff, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//blue
    this.red = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//red
    this.green = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//green
    this.yellow = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//yellow
    
    this.initializeCircles = function(circles){
        this.circles = circles;;
    };
    this.initializeLines = function(lines){
        this.lines = lines;
    };
    this.initializePoints = function(points){
        this.points = points;
    };
    
    this.createCircleMeshes = function(){
        this.circleMeshes = [];
        for(var i = 0; i < this.circles.length; i++){
            var circle = new THREE.CircleGeometry(this.circles[i].radius, 32);
            var circleMesh = new THREE.Mesh(circle, this.yellow);
            circleMesh.position.x = this.circles[i].x;
            circleMesh.position.y = this.circles[i].y;
            this.circleMeshes.push(circleMesh);
        }
    };
    this.createLineMeshes = function(){
        this.lineMeshes = [];
        var material = new THREE.LineBasicMaterial({color: 0xffffff});
        for ( var i = 0; i < this.lines.length; i++) {
            var startX = -10;
            var endX = +10;
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(startX, this.lines[i].findY(startX), 0.01));
            geometry.vertices.push(new THREE.Vector3(endX, this.lines[i].findY(endX), 0.01));
            var line = new THREE.Line(geometry, material);
            this.lineMeshes.push(line);
        }
    };
    this.createPointMeshes = function(){
        this.pointMeshes = [];
        for(var i = 0; i < this.points.length; i++){
            var point = new THREE.CircleGeometry(0.1, 12);
            var pointMesh = new THREE.Mesh(point, this.white);
            pointMesh.position.x = this.points[i].x;
            pointMesh.position.y = this.points[i].y;
            this.pointMeshes.push(pointMesh);
        }
    };
    
    this.draw = function(){
        this.meshGroup = new THREE.Group();
        this.createCircleMeshes();
        this.createLineMeshes();
        this.createPointMeshes();

        for(var i = 0; i < this.circleMeshes.length; i++){
            this.meshGroup.add(this.circleMeshes[i]);
        }
        for(var i = 0; i < this.lineMeshes.length; i++){
            this.meshGroup.add(this.lineMeshes[i]);
        }
        for(var i = 0; i < this.pointMeshes.length; i++){
            this.meshGroup.add(this.pointMeshes[i]);
        }
        this.scene.add(this.meshGroup);
    };
    
    this.dispose = function(){
        for(var i = 0; i < this.circleMeshes.length; i++){
            //this.scene.remove(this.circleMeshes[i]);
            this.meshGroup.remove(this.circleMeshes[i]);
            this.circleMeshes[i].geometry.dispose;
            this.circleMeshes[i].material.dispose;
        }
        for(var i = 0; i < this.lineMeshes.length; i++){
            //this.scene.remove(this.lineMeshes[i]);
            this.meshGroup.remove(this.lineMeshes[i]);
            this.lineMeshes[i].geometry.dispose;
            this.lineMeshes[i].material.dispose;
        }
        for(var i = 0; i < this.pointMeshes.length; i++){
            //this.scene.remove(this.pointMeshes[i]);
            this.meshGroup.remove(this.pointMeshes[i]);
            this.pointMeshes[i].geometry.dispose;
            this.pointMeshes[i].material.dispose;
        }
        console.log(this.meshGroup);
        this.scene.remove(this.meshGroup);
    };
}

function QuadraticFormula(a, b, c){
    this.x1;//this one is larger
    this.x2;//this one is smaller
    
    this.calculate = function(a, b, c){        
      var insideSquareRoot = b * b - 4 * a * c;  
      if(insideSquareRoot => 0){
        var squareRoot = Math.sqrt(insideSquareRoot);
        var numerator = - b - squareRoot;
        var numerator2 = -b + squareRoot;
        var denominator = 2 * a;

        console.log(b * b - 4 * a * c);

        var firstSolution = numerator /denominator;
        var secondSolution = numerator2 /denominator;

        if(firstSolution > secondSolution){
            this.x1 = firstSolution;
            this.x2 = secondSolution;
        }else{
            this.x2 = firstSolution;
            this.x1 = secondSolution;
        }
        console.log("x1:" + this.x1 + " x2:" + this.x2);
      }else{
          console.log("error:inside the square root is negative. There is no answer.");
      }
    };
    this.calculate(a, b, c);
}

function radianToAngle(radian){
    return radian *  180 / Math.PI % 360;
} 

function angleToRadian(angle){
    return angle * Math.PI/ 180;
} 

function keepWithin360(angle){
    if(angle >= 360){//changing bikeDir within 360 deg
        angle = angle % 360;
    }
    if(angle <= -360){
        angle = angle % 360;
    }
    return angle;
}