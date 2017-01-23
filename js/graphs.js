var stripes = new Image();
stripes.src = 'img/graph_stripes.png'; 
		
var numBars = 50;				
var barGap = 0;
var barWidth = 0;	
var highest = 0

var drawPos = {}
var drawSize = {}			

var graphs = [];
var n;

function addPieGraph(canvas, data) {
	
	var graphNo = sizeObj(graphs);	
	
	drawFunc = function(canvas, data, x, y) {
		// console.log(canvas, data, x, y);
		
		var cv = document.getElementById(canvas);
		var draw = cv.getContext('2d');
		var w = cv.width;
		var h = cv.height;
			
		draw.clearRect(0, 0, w, h);	
			
		var circleDiameter = h;
		
		var centerX = w/2;
		var centerY = h/2;
		
		if (w < h) {
			circleDiameter = w;
		}
		
		var buffer = 30;
		var addAmount = 0;
		
		circleDiameter = circleDiameter - buffer;
		
		// var startY = centerY - (circleDiameter/2);
		
		var total = 0;
		for (var word in data) {
			var val = data[word];		
			total = total + val;
		}
		
		var textPositions = {};
		var curAng = 0;
		for (var word in data) {
			// curAng--;
		
			var val = data[word];
			var keyword = word;
			var perc = val / total;
			var steps = Math.round(perc * 360) - 1;
			var end = curAng + steps;
			
			var chunkMid = Math.round(curAng + (steps/2));
			
			var add = 0;
			
			var rad = Math.radians(curAng);
			var startX = centerX + (Math.sin(rad) * (circleDiameter*2));
			var startY = centerY + (Math.cos(rad) * (circleDiameter*2));			
			
			var rad = Math.radians(end);
			var endX = centerX + (Math.sin(rad) * (circleDiameter*2));
			var endY = centerY + (Math.cos(rad) * (circleDiameter*2));
			
			
			if (is_in_triangle(x, y, centerX, centerY, startX, startY, endX, endY)) {
				add = 10;
				
				var rad = Math.radians(curAng + steps/2);
				var midX = centerX + Math.sin(rad) * ((circleDiameter/2 + add)/2);
				var midY = centerY + Math.cos(rad) * ((circleDiameter/2 + add)/2);
				textPositions[word] = {x: midX, y: midY};
				
			}
			
			draw.beginPath();
			draw.moveTo(centerX, centerY);		
			
			
			
			while (curAng <= end) {		
				var rad = Math.radians(curAng);
				
				var myx = centerX + (Math.sin(rad) * (circleDiameter/2 + add));
				var myy = centerY + (Math.cos(rad) * (circleDiameter/2 + add));
				
				draw.lineTo(myx, myy);				
			
				curAng++;			
			}
			
			draw.lineTo(centerX, centerY);	
			
			draw.closePath();
			
			// var hsb = {h: curAng, s: 1, v: 1};
			
			var rad = Math.radians(curAng);
			
			var r = Math.round((1 + Math.sin(rad)/2) * 255);
			var g = Math.round(Math.abs(Math.sin(rad)/2) * 255);
			var b = Math.round((1 + Math.cos(rad)/2) * 255);
			

			// console.log(r,g,b);
			
			draw.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", 1)";
			draw.fill();

			if (add > 0) {
				draw.fillStyle = "rgba(0, 0, 0, 0.3)";
				draw.fill();
			}
			
			draw.strokeStyle = "rgba(255, 255, 255, 1)";
			draw.lineWidth = 2;
			draw.stroke();
			
		}	
		
		// console.log(sizeObj(textPositions));
		// for (var word in textPositions) {
		for (var word in data) {		
			var position = textPositions[word];
			
			var text = word + ": " + data[word];
			
			if (position) {
				
				draw.fillStyle = "rgba(0, 0, 0, 0.7)";
				draw.fillRect(position.x-60, position.y - 15, 120, 20);
				
				draw.save();
				draw.font = '12pt Calibri';
				draw.textAlign = "center";
				draw.fillStyle = "rgba(0, 0, 0, 1)";
				draw.fillText(text, position.x+1, position.y+1);
				draw.restore();
				
				draw.save();
				draw.font = '12pt Calibri';
				draw.textAlign = "center";
				draw.fillStyle = "rgba(255, 255, 255, 1)";
				draw.fillText(text, position.x, position.y);
				draw.restore();
			
			}
		}
	}
	
	graphs[graphNo] = {canvas: canvas, dataset: data, draw: drawFunc};
	drawFunc(canvas, data, -1, -1);
}

// function addBarGraph(canvas, data, x, y) {
		
	// var gData = {}
	
	// gData.canvas = canvas;
	// gData.data = data;
	// gData.colour = randomColourRGB();
	
	// gData.x_title = x;
	// gData.y_title = y;
	
	// gData.draw = function(canvas, mousex, mousey, graphNo) {

		// var gData = graphs[graphNo];
	
		// var highest = 0
		// for (i = 0; i < sizeObj(gData.data); i++) {
			// if (gData.data[i] > highest) {
				// highest = gData.data[i];
			// }					
		// }	
		
		// gData.highest = highest;
	
		
			
		// var data = gData.data;		
		// var i = 0;				
		// var myDraw = canvas.getContext('2d');	
		
		// myDraw.clearRect(0, 0, gData.canvasWidth, gData.canvasHeight);
		
		// var barX = gData.drawPos.x + gData.barWidth/2
		
		// var barH = gData.drawSize.h - gData.topBuffer + 20
		
		// var pattern1 = myDraw.createPattern(stripes, "repeat");
		
		// myDraw.fillStyle = "rgba(0, 0, 0, 0.8)";
		// myDraw.fillRect(0, 0, w, h);
		
		// var dots = {}
		
		// for (i = 0; i < sizeObj(data); i++) {
			// var val = data[i];				
			
			// var pNum = val / highest;
			// var myH = (pNum * barH)
			
			// myH = myH;
			// var BoxX = barX - gData.barWidth/2
			
			// drawBox(myDraw, BoxX+2, gData.drawSize.h - (myH-2), gData.barWidth, myH-2, "rgba(0, 0, 0, 0.1)") // shadow
			// drawBox(myDraw, BoxX, gData.drawSize.h - myH, gData.barWidth, myH, "rgba(255, 255, 255, 0.2)") // box
								
			// var pattern = pattern1;
			
			// myDraw.fillStyle = "rgba(200, 200, 200, 0.4)";				
			// myDraw.fillRect(barX-gData.barWidth/2, gData.drawSize.h - myH - 1, gData.barWidth, 1);
			
			// dots[i] = {}
			// dots[i].x = barX;
			// dots[i].y = gData.drawSize.h - myH;
			// dots[i].h = myH
								
			// barX = barX + gData.barWidth + gData.barGap;				
		// }
						
		// myDraw.beginPath();
		// myDraw.moveTo(dots[0].x, dots[0].y);
		
		// for (i = 1; i < sizeObj(dots) - 2; i ++) {		
			// var xc = (dots[i].x + dots[i + 1].x) / 2;
			// var yc = (dots[i].y + dots[i + 1].y) / 2;
			// myDraw.quadraticCurveTo(dots[i].x, dots[i].y, xc, yc);			
		// }
		
		// myDraw.quadraticCurveTo(dots[i].x, dots[i].y, dots[i+1].x,dots[i+1].y);
		// myDraw.lineTo(gData.drawPos.x + gData.drawSize.w, dots[i+1].y)
		// myDraw.lineTo(gData.drawPos.x + gData.drawSize.w, gData.drawSize.h)
		// myDraw.lineTo(gData.drawPos.x, gData.drawSize.h)
		// myDraw.lineTo(gData.drawPos.x, dots[0].y)
		// myDraw.lineTo(dots[0].x, dots[0].y)
		
		// myDraw.fillStyle = "rgba(255, 255, 255, 0.5)";
		// myDraw.fill();
		
		
		// myDraw.fillStyle = "rgba("+gData.colour.r+", "+gData.colour.g+", "+gData.colour.b+", 0.2)";
		// myDraw.fill();	
	
		// myDraw.strokeStyle = "rgba(255, 255, 255, 1)";
		// myDraw.lineWidth = 1;
			
		// for (i = 0; i < sizeObj(data); i++) {
			// var pos = dots[i];
			// var val = data[i];
			
			// var halfBarW = gData.barWidth/2	
			// if (mousex > (pos.x - gData.barWidth/2) & mousex < (pos.x + gData.barWidth/2) ) {						
				// myDraw.fillStyle = "rgba(255, 200, 0, 0.4)";				
				// myDraw.fillRect(pos.x-(halfBarW-2), 0, halfBarW*2 - 4, gData.drawSize.h);
				

				// myDraw.fillStyle = "rgba(255, 255, 255, 0.5)";
				// myDraw.fillRect(pos.x-(halfBarW-2), (gData.drawPos.y + gData.drawSize.h) - pos.h, halfBarW*2 - 4, pos.h);

				// myDraw.fillStyle = "rgba(255, 200, 0, 1)";						
				// myDraw.fillRect(pos.x-(halfBarW-1), 0, 1, gData.drawSize.h);						
				// myDraw.fillRect(pos.x+(halfBarW-2), 0, 1, gData.drawSize.h);
				
			
				// var textx = 12;
				// myDraw.textAlign = 'left';
				
				// myDraw.fillStyle = "rgba(255, 255, 255, 0.9)";
				
				// if (pos.x > gData.canvasWidth/2) {
					// textx = -12;
					// myDraw.textAlign = 'right';											
					// myDraw.fillRect(pos.x-10 - 80, gData.drawSize.h - 35, 80, 30);
				// }
				// else {							
					// myDraw.fillRect(pos.x+10, gData.drawSize.h - 35, 80, 30);
				// }					
				
				// myDraw.fillStyle = 'black';
				// myDraw.fillText(val + " occurences", pos.x + textx, gData.drawSize.h - 10);						
				

				// var period = i * 10;
				
				// var start = Math.clamp(period, 0, data.length * 10);
				// var end = Math.clamp(period+10, 0, data.length * 10);
				
				// myDraw.fillText(start + "-" + end + " seconds", pos.x + textx, gData.drawSize.h - 25);		


			// }				
		// }


		// drawBox(myDraw, gData.drawPos.x - 2, 0, 2, gData.canvasHeight, "rgba(0, 0, 0, 0.9)")
		// drawBox(myDraw, 0, 0, gData.drawPos.x, gData.canvasHeight, "rgba(0, 0, 0, 0.5)")
		
		// myDraw.save();
		// myDraw.translate(gData.drawPos.x/2 + 4, gData.canvasHeight/2);
		// myDraw.rotate(-Math.PI/2);
		// myDraw.textAlign = "center";
		// myDraw.font = '12pt Calibri';
		// myDraw.fillStyle = "rgba(255, 255, 255, 1)";
		// myDraw.fillText(gData.y_title, 0, 0);
		// myDraw.restore();
		
		

		// drawBox(myDraw, 0, gData.drawPos.y + gData.drawSize.h, w, 2, "rgba(0, 0, 0, 0.9)")
		// drawBox(myDraw, 0, gData.drawPos.y + gData.drawSize.h, w, gData.drawPos.x, "rgba(0, 0, 0, 0.5)")	
		
		// myDraw.save();
		// myDraw.font = '12pt Calibri';
		// myDraw.textAlign = "center";
		// myDraw.fillStyle = "rgba(255, 255, 255, 1)";
		// myDraw.fillText(gData.x_title, gData.canvasWidth/2, gData.canvasHeight - 5);
		// myDraw.restore();
		
		// myDraw.save();
		
		// for (var l = 1; l <= highest; l++) {
			// var start_x = gData.drawPos.x
			// var end_x = gData.drawPos.x + gData.drawSize.w

			// var barH = gData.drawSize.h - gData.topBuffer + 20
			
			// var pNum = l / highest;
			// var myH = (pNum * barH)
			
			// var y = gData.drawSize.h - myH - 1
			
			// myDraw.beginPath();
			// myDraw.moveTo(start_x, y);			
			// myDraw.lineTo(end_x, y)
			// myDraw.strokeStyle = "rgba(255, 255, 255, 0.1)";
			// myDraw.lineWidth = 1;
			// myDraw.stroke();
			
		
		// }
		
		// myDraw.restore();
		
	// }
	
	// graphs.push(gData);
// }

var loaded = false;

setInterval(function(){
	drawPieGraphs();
},1000);					

function drawPieGraphs() {
	for (var i = 0; i < sizeObj(graphs); i++) {		
		var data = graphs[i];
		var canvas = document.getElementById(data.canvas)
		
		if (!canvas) {
			graphs.splice(i, 1);
		}
		else {
			canvas.addEventListener('mousemove', function(evt) {				
				var mousePos = getMousePos(this, evt);
				data.draw(data.canvas, data.dataset, mousePos.x, mousePos.y);
				
			}, false);			
		}
	}
}


// function drawGraphs() {
	// for (var i = 0; i < sizeObj(graphs); i++) {		
		// var gData = graphs[i];
		// var canvas = document.getElementById(gData.canvas)
		
		// if (!canvas) {
			// graphs.splice(i, 1);
		// }
		// else {		
			// var myDraw = canvas.getContext('2d');
			
			// canvas.myGraph = i;
			
			// w = canvas.width;
			// h = canvas.height;
			
			
			// gData.barGap = 1;					
			// gData.topBuffer = 40;
			// gData.canvasWidth = w;
			// gData.canvasHeight = h;
			// gData.drawPos = {};
			// gData.drawPos.x = 20
			// gData.drawPos.y = 0;
			// gData.drawSize = {};
			// gData.drawSize.w = w - 20
			// gData.drawSize.h = h - 20;				
			// gData.barWidth = (gData.drawSize.w / sizeObj(gData.data)) - gData.barGap;

			// canvas.addEventListener('mousemove', function(evt) {				
				// var mousePos = getMousePos(this, evt);
				// gData.draw(this, mousePos.x, mousePos.y, this.myGraph);
				
			// }, false);
			

			// gData.draw(canvas, -1,-1, i);
		
		// }
	// }
// }