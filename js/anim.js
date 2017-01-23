var loaded = false;
var spin = 0

var size = 100//Math.clamp(Math.random() * 75, 50, 75);
var sides = 3 + Math.floor(Math.random() * 5);
var daTwist = -4 + Math.floor(Math.random() * 5); // this actually controls thickness!!!

var vulp = 4 //+ Math.ceil(Math.random() * 2);

var colour = randomColour();

//console.log(colour);

var curTwist = 1;

if (Math.random() > 0.5) {
	//curTwist = -1;
}

function drawLoadingAnimation() {		
	var canvas = document.getElementById('anim_canvas') // 
	
	//console.log(1);
	
	if (canvas) {
	
		
	
		var draw = canvas.getContext('2d');
	
		var w = canvas.width;
		var h = canvas.height;			
		
		draw.clearRect(0, 0, w, h);
		
		var x = w/2;	
		
		for (var i = -1; i <= 1; i = i + 2) {
			
			
			drawPoly(draw, x + (w/4) * i + 10, h/2 + 10, size / 2, sides, spin, vulp, daTwist * curTwist, "rgba(0,0,0,0.1)")
			drawPoly(draw, x + (w/4) * i, h/2, size / 2, sides, spin, vulp, daTwist * curTwist, colour)	
				
		}
		
			
		drawPoly(draw, x + 10, h/2 + 10, size, sides, spin, vulp, daTwist * curTwist, "rgba(0,0,0,0.1)")	
		drawPoly(draw, x, h/2, size, sides, spin, vulp, daTwist * curTwist, colour)	
		
		spin = spin + (3 * curTwist)
	}
}

drawAnimation = true;

setInterval(function(){
	
	drawLoadingAnimation();
},20);					
			