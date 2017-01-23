HSBToRGB = function (hsb) {
	var rgb = {};
	var h = Math.round(hsb.h);
	var s = Math.round(hsb.s * 255 / 100);
	var v = Math.round(hsb.b * 255 / 100);
	if (s == 0) {
		rgb.r = rgb.g = rgb.b = v;
	} 
	else {
		var t1 = v;
		var t2 = (255 - s) * v / 255;
		var t3 = (t1 - t2) * (h % 60) / 60;
		if (h == 360) h = 0;
		if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
		else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
		else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
		else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
		else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
		else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
		else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
	}
	return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
}

function is_in_triangle(px,py,ax,ay,bx,by,cx,cy) {
	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

	var v0 = [cx-ax,cy-ay];
	var v1 = [bx-ax,by-ay];
	var v2 = [px-ax,py-ay];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}

VectorDist = function(x1, y1, x2, y2) {
	var xd = x2-x1;
	var yd = y2-y1;
	return Math.sqrt(xd*xd + yd*yd);
}

Math.degrees = function(rad) {
	return rad*(180/Math.PI);
}

Math.radians = function(deg) {
	return deg * (Math.PI/180);
}

Math.clamp = function(val, min, max) {
    var myVal = val;
	
	if (myVal > max) {
		myVal = max;
	}
	
	if (myVal < min) {
		myVal = min;
	}
	
	return myVal;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function randomColourRGB() {
	var r = Math.round(Math.random() * 255);
	var g = Math.round(Math.random() * 255);
	var b = Math.round(Math.random() * 255);
	
	var col = {}
	col.r = r;
	col.g = g;
	col.b = b;
	
	//console.log(col);
	
	return col;
}

function randomColour() {
	var r = Math.round(Math.random() * 255);
	var g = Math.round(Math.random() * 255);
	var b = Math.round(Math.random() * 255);
	
	var col = "rgba(" + r + "," + g + "," + b + ", 1)";
	
	//console.log(col);
	
	return col;
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function drawLine(draw, x1, y1, x2, y2, colour, linewidth) {
	draw.beginPath();
	
	draw.moveTo(x1, y1);
	draw.lineTo(x2,y2);
	
	draw.lineWidth = linewidth | 1;	
	
	draw.strokeStyle = colour;
	draw.stroke();
}

function drawBox(draw, x, y, w, h, colour) {
	draw.fillStyle = colour;
	draw.fillRect(x,y,w,h);
}

function drawPoly(draw, x, y, size, sides, rot, zappers, zapperTwist, colour) {

	//draw.fillStyle = '#f00';
	draw.beginPath();
	draw.moveTo(x, y);	

	var start = 0;
	var end = sides; //sides;
	
	var chunks = 360 / sides
	
	var polySize = size;
	
	if (zappers > 0) {polySize = 0;} //size * 3 / sides;}
	
	for (var i = start; i <= end; i++) {	
		//console.log(i);		
		
		var ang = (i*chunks) + rot;
		
		if (ang > 360) {ang = ang - 360;}
	
		rad = Math.radians(ang);
	
		
	
		var myx = x + (Math.sin(rad) * polySize);
		var myy = y + (Math.cos(rad) * polySize);
	
		draw.lineTo(myx, myy);		
	}
	
	draw.closePath();
	
	draw.fillStyle = colour;	
	draw.fill();
	
	if (zappers > 0) {	
		for (i = start; i <= end; i++) {	
			
			var zsize = size / zappers;			
		
			draw.beginPath();
			draw.moveTo(x, y);
			
			
			var prevx = x;
			var prevy = y;
			var ztwist = zapperTwist;
			
			var n = 0;
			
			for (n = 1; n < zappers; n++) {	
				var a = (90);
				
				var sizeMult = 1-((n-1) / (zappers-2));
				
				//console.log(sizeMult);
				
				ztwist = ztwist + (zapperTwist*n);
				var ang = (i*chunks) + rot;
				ang = ang + ztwist		
				if (ang > 360) {ang = ang - 360;}			
				
				rad = Math.radians(ang);
					
				var zsides = Math.round(zsize * sizeMult);
				var zpush = zsize * n * 2;
			
				var zx = x + (Math.sin(rad) * zpush);
				var zy = y + (Math.cos(rad) * zpush);				
				
				
				ang = ang + a		
				if (ang > 360) {ang = ang - 360;}	
				rad = Math.radians(ang);				
				
				zx = zx + (Math.sin(rad) * ((zsize)/n));
				zy = zy + (Math.cos(rad) * ((zsize)/n));
					
				draw.lineTo(zx, zy);

				prevx = zx;
				prevy = zy;
			}
			
			for (n = zappers; n > 0; n--) {	
				var a = (-90);
				
				var sizeMult = 1-((n-1) / (zappers-2));
				
			//	console.log(sizeMult);
				
				ztwist = ztwist + (zapperTwist*n);
				var ang = (i*chunks) + rot;
				ang = ang - ztwist		
				if (ang > 360) {ang = ang - 360;}			
				
				rad = Math.radians(ang);
					
				var zsides = Math.round(zsize * sizeMult);
				var zpush = zsize / n * 2;
			
				var zx = x + (Math.sin(rad) * zpush);
				var zy = y + (Math.cos(rad) * zpush);				
				
				
				ang = ang + a		
				if (ang > 360) {ang = ang - 360;}	
				rad = Math.radians(ang);				
				
				zx = zx + (Math.sin(rad) * ((zsize)/n));
				zy = zy + (Math.cos(rad) * ((zsize)/n));
					
				draw.lineTo(zx, zy);

				prevx = zx;
				prevy = zy;
			}			
			
			
			
			// draw.lineTo(x, y)			
				
			draw.fillStyle = "rgba(0, 0, 0, 1)";
			draw.fill();			
			
			draw.fillStyle = colour;
			draw.fill();
			
			draw.fillStyle = "rgba(255, 255, 255, 0.5)";
			draw.fill();	
			
			//draw.strokeStyle = colour;
			//draw.stroke();
			
		
			// for (n = 0; n < zappers; n++) {
				// ztwist = ztwist + zapperTwist

				// var ang = (i*chunks) + rot;
				// ang = ang + ztwist
		
				// if (ang > 360) {ang = ang - 360;}
			
				// rad = Math.radians(ang);
					
				// var zsides = Math.round(zsize);
				// var zpush = prevPush + zsize/2
			
				// prevPush = prevPush + zsize * 1.5
			
				// var zx = x + (Math.sin(rad) * zpush);
				// var zy = y + (Math.cos(rad) * zpush);
				
				
				
				// drawPoly(draw, zx, zy, zsize, zsides, ang + ztwist * 1.3, 0, colour)
				
				//drawLine(draw, zx, zy, prevx, prevy)
				
				// prevx = zx;
				// prevy = zy;
				
				//console.log("push = " + zpush + " === prevPush = " + prevPush);
				
				
				
				// zsize = zsize / 1.5;			
			// }			
		}
	}
	
}