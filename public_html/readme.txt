drawGeometries

find path of circles after a collision

1 create two circles. One stationary, another one moving along y axis.
2 find the location of the moving circle 

3 Replace a circle with the tangent circle.
4 find a line which pass through center of circles. The line is the path of
the stationary circle which were collided.

5 find the tangent line of the two circles. 
That tangent line has same slope as the moving circle's path.

6 find offset of the line of circle's path. Now I have the line of circle's path.

7 find the common point of two circles when those are colliding.
In order to do that, find shared point of tangent line and line through center of two circles.


I need certain geometry stuff.

Name:CirclesCollision

For calculation

initialPath1(line)
finalPath1(line)
finalPath2(line)
tangentLine(line)
tangentPoint(point)

angle

initialAngle1
finalAngle1
angleDelta1
finalAngle2


For drawing
circle1Center(point)
circle2Center(point)
tangentPoint(point)
initialPath1(line)
finalPath1(line)
finalPath2(line)
tangentLine(line)

I implemented all of them.
Next thing I need to do is fix Line object for tan90.

----------------------------------------------------------------

Physics and circleCollision

create velocity line and find common point between velocity line and target circle

if there is a common point or points, collision will happen.

calculate the time of collision.
calculate velocity after the collision and location after 0.1, 0.2, 0.3...sec later.


in order to find initial colliding circle,
I was searching for line and circle distance, but actually it's point to point distance.
One of points x and y is on the line.

finding points on a line equation is wrong.

-----------------------------------------------------
make sure unnecessary lines turn off when those are not used.