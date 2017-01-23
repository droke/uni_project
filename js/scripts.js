function xhr(){
  var xmlHttp;
  try{
    xmlHttp=new XMLHttpRequest(); 
  } catch(e) {
    try {
      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); 
    } catch(e) {
      try {
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); 
      } catch(e) {
        alert("Your browser does not support AJAX!"); 
        return false;
      }
    }
  }
  return xmlHttp; 
}

var meetings = {};

window.onload = function () {	
	var xmlhttp;
	if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
	else { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			meetings = JSON.parse(xmlhttp.responseText);
			meetings = meetings.meetings;
			
			console.log(meetings);
			
			// var toalert = "";
			for (var k in meetings) {
				var obj = meetings[k];
				obj.ID = k;
							
			}
			// alert(toalert);
			
			if (!window.name | !pages[window.name]) {
				window.name = "Home";
			}
			
			replaceContent(window.name);
		}
	}
	xmlhttp.open("GET","json.txt",true);
	xmlhttp.send();		
	
	setLogin("LStJack", "admin");
	refreshColour();

	
	
}


function searchKeyPress(e)
{
	if (typeof e == 'undefined' && window.event) { e = window.event; }
	if (e.keyCode == 13)
	{
		doSearch();
	}
}

function forceSearch(query) {
	var search_box = document.getElementById("search_box");
	search_box.value = query;
	
	doSearch();
}

function doSearch() {
	// this will be a jquery function that will go to the search results page when results have been received.

	var search_box = document.getElementById("search_box");
	
	var data = [];
	// data[0] = keyword; // what is being searched for
	// data[1] = searchType; // the type of search (topic, keyword, etc)
	// for (var i = 2; i < 12; i++) {
		// data[i] = "Excerpt from the meeting transcription?";
	
	var query = (search_box.value).toLowerCase();
	data[0] = query;
	var cur = 1;
	
	
	var hits = [];
	
	// console.log(meetings);
	for (var k in meetings) {
		var obj = meetings[k];
		// console.log(obj);
		
		var numAdded = 0;
		
		for (var i in obj.keywords) {
			var keyword = i.toLowerCase();
			
			if (keyword.indexOf(query) > -1) {				
				numAdded++;
			}			
		}
		
		if (numAdded > 0) {
			var pushobj = {Obj: obj, Num: numAdded}
			hits.push(pushobj);
		}		
	}
	
	if (query != "") {
		hits = hits.sort(function(obj2, obj1) { return obj1.Num - obj2.Num; });
	}
		
	for (var i in hits) {
		// console.log(i);
		data[cur] = hits[i].Obj;
		cur++;
	}
	
	// console.log(data);	
	replaceContent("SearchResults", data);
}

var colours = [];


colours.push("#9BB36A");
colours.push("#336633");
colours.push("#3399ff");
colours.push("#336699");
colours.push("#663366");
colours.push("#cc3333");
colours.push("#aaaaaa");

function sizeObj(obj) {
  return Object.keys(obj).length;
}

function setLogin(username, group) {
	window.user = username;
	window.group = group;
	
	refreshPageButtons();
	refreshFooter();
}

function refreshFooter() {
	var footer_content = "";
	
	//footer_content = footer_content + "<div class='padded_box'>";
	
	if (window.user) {		
		footer_content += "<a href='javascript:;' onclick='replaceContent(\"Logout\")'><div class='button'style='background-image:url(img/icons/logout.png);'>Logout</div></a>";	
		footer_content += "<div class='padded_box_left'>Logged in as " + window.user + " (" + window.group + ")</div>";
	}
	else {
		footer_content += "<a href='javascript:;' onclick='replaceContent(\"Login\")'><div class='button' style='background-image:url(img/icons/login.png);'>Login</div></a> &middot; <a href='javascript:;' onclick='replaceContent(\"Register\")'><div class='button'style='background-image:url(img/icons/create.png);'>Register</div></a>";
	}
	
	//footer_content = footer_content + "</div>";
	
	for (var i = 0; i < colours.length; i++) {
		var style = "background-color:" + colours[i] + "; color:" + colours[i] + ";"
		
		if (i == 0) { style = style + " border-right: 1px solid black; margin-right: 3px;"; }
		if (i == colours.length-1) { style = style + " border-left: 1px solid black;"; }
		
		
		footer_content = footer_content + "<a href='javascript:;' onclick='changeColour(" + i + ")' <div class='colour_box' style='" + style + "'>:)</div>";
	}
	
	
	var content = document.getElementById('footer_div')
	content.innerHTML = footer_content;
}

function refreshPageButtons() {
	var pData;

	var button_content = "";
	
	// for (var i = 0; i < sizeObj(buttons); i++) {
	for (var i in pages) {
		pData = pages[i];
		
		//<img src='img/icons/" + pData.Icon + ".png' width='16px' height='16px'/>
		
		if (!pData.GroupRequired | (window.group == pData.GroupRequired)) {		
			
			button_content += '<a href="javascript:;" onclick="replaceContent(\'' + i + '\')"><div class="button"';
			
			button_content += "<div class='link_icon'";
			
			button_content += "style='background-image:url(img/icons/" + pData.Icon + ".png);'";
			
			button_content += ">";
			button_content += pData.Title;
			button_content += '</div></a>';
		}		
	}
	
	button_content += "<div class='search_box' style='background-image:url(img/icons/search.png);'>";
	button_content += "<input type='text' id='search_box' value='' onkeydown='searchKeyPress(event);'/></div>"
	
	var content = document.getElementById('button_container')
	content.innerHTML = button_content;
}

function replaceContent(id, data) {
	if (window.locked) { return 0; }	
		
	console.log("Content set to: " + id);
		
	var pData = pages[id];
	
	if (pData & pData.ContentFunc) {
		window.name = 0;
	}
	
		
	
	var content = document.getElementById('content_div')
	
	var replacement = pData.Content;
	
	if (pData.ContentFunc) {
		replacement = pData.ContentFunc(data);
	}
	
	document.title = "PoC Site - " + pData.Title
	content.innerHTML = "<h1>" + pData.Title + "</h1>" + replacement;
}

function changeColour(i) {	
	setCookie("colour", colours[i], 5);	
	refreshColour();
	
	console.log("Colour set to " + colours[i]);
}

// function hexToRGB(hex) {
	// var colour = {};
	
	// colour.r = parseInt(hex.substring(1, 2), 16);
	// colour.g = parseInt(hex.substring(3, 4), 16);
	// colour.b = parseInt(hex.substring(5, 6), 16);
	
	// return colour;
// }

function refreshColour(override) {
	var colour = override;
	if (!override) {
		colour = getCookie("colour");	
		if (colour == "") {colour = colours[2];} // nice blue colour
	}	
	
	var header = document.getElementById('header_div')
	header.style.backgroundColor = colour;

	var footer = document.getElementById('footer_div')
	footer.style.backgroundColor = colour;
	
	// var body_id = document.getElementById('body_id')
	// body_id.style.backgroundColor = colour;
	
	// background-image: url(../img/stripes_a.png);
	// background-repeat: repeat;
}

function getCookie(cname) { // taken from w3schools - http://www.w3schools.com/js/js_cookies.asp
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) { // taken from w3schools - http://www.w3schools.com/js/js_cookies.asp
	var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}