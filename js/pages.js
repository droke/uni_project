
var attendee_fields = [];
function addAttendeeField(value) {
	var count = attendee_fields.length;
	
	if (count > 12) { return false; }
	
	var newID = "attendee" + count;
	
	var attendee_box = document.getElementById("attendee_box");
	
	var placeholder = "Attendee " + count;
	
	if (count == 0) {
		placeholder = "Chair";
	}
	
	if (attendee_box) {
        var element = document.createElement("input");
     
        element.setAttribute("type", "text");
		element.setAttribute("placeholder", placeholder);
		element.setAttribute("id", newID);
		
		if (value) {
			element.setAttribute("value", value);
		}
        attendee_box.appendChild(element);
		
		attendee_fields.push(newID);
	}
	
	var att_num = document.getElementById("att_num");
	
	att_num.innerHTML = "Attendees (" + (attendee_fields.length) + ")";
}

function dropAttendeeField() {
	var count = attendee_fields.length;
	
	if (count < 3) {return false;}
	
	var lastID = "attendee" + (count-1);
	
	var attendee_box = document.getElementById("attendee_box");
	var deleteMe = document.getElementById(lastID);
	
	if (attendee_box) {	
		attendee_box.removeChild(deleteMe);
		
		attendee_fields.splice(count-1, 1);	
	}
	
	att_num.innerHTML = "Attendees (" + (attendee_fields.length) + ")";
}

function allInForm(id, form) {
	var inputs = document.forms[form].getElementsByTagName("input");
	
	var msg = "";
	for (i=0; i<inputs.length; i++){
		var var_name = inputs[i].id;
		var val = inputs[i].value;
		var type = inputs[i].type;
		
		if (type == "file") {
			//val = inputs[i].files[0].name;
		}
		
		if (var_name != "") {	
			msg += (var_name + ": " + val) + "\n";
			
			//editMeeting(id, var_name, val);
		}
		
		
	}
	
	alert(msg);

	return false;
}

// function doSearch() {
	// var search_box = document.getElementById("search_box");
// }

// editMeeting()
// id 			- 	MeetingID (in the database)
// var_name 	- 	the name of the var being saved to the db
// val 			-	the new value of the var
function editMeeting(id, var_name, val) {
	if (id=="") {
		//document.getElementById("txtHint").innerHTML="";
		return;
	} 
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { 
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			//document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
			alert("success");
		}
	}
  xmlhttp.open("GET","editmeeting.php?id=" + id + "&var_name=" + var_name + "&val=" + val,true);
  xmlhttp.send();
}

var pages = {};
// var buttons = [];

pages.Home = {};
pages.Home.Title = "Home";
// pages.Home.Content = '<p>This Proof of Concept is intended to manage meetings, with it, you are able to edit, view and search meetings on record.</p>';
// pages.Home.Content += '<p>Enter a term in the search box at the top-right and press the enter key to view a list of meetings that contain keywords with a part or whole match.</p>';
// pages.Home.Content += '<p>Adding a meeting to the system can be achieved by clicking the link at the top.</p>';
// pages.Home.Content += '<p>To learn more about the system, you can visit the FAQ, a link is at the top.</p>';
pages.Home.ContentFunc = function() {
	
	var content = "<h2>About This System</h2>";
	content += "<p>This system is designed to manage and organize raw data from a large and varied set of meetings, it takes in a sample of voice data and processes it using speech recognition technology.</p>";
	content += "<p>The processed voice data is then added the the database along with some user-entered information for the meeting. A simple pie graph is then created to present the data in a meaningful way.</p>";
	content += "<p>You can also search through the database by keyword, the system will search for meetings in which the entered query was said (or any keyword that contained the search query within it).</p>";
	content += "<p><a href='javascript:;' onclick='replaceContent(\"FAQ\")'>Click here to learn more about the system.</a>";
	content += "<h2>Quarterly Word Review</h2>";
	content += "<p>";
	
	var words = {};
	var total = 0;
	
	for (var k in meetings) {
		var obj = meetings[k];
		
		for (var i in obj.keywords) {
			var keyword = i.toLowerCase();
			var count = obj.keywords[i];
			
			if (words[keyword]) {
				words[keyword] += count;
			}
			else {
				words[keyword] = count;
			}
			
			total += count;
		}		
	}
	
	var words_array = [];
	
	for (var k in words) {
		var count = words[k];
		var word = k;
		
		var obj = {word: word, count: count};
		words_array.push(obj);
	}
	
	words_array = words_array.sort(function(obj2, obj1) { return obj1.count - obj2.count; });
	
	for (var i = 0; i < 10; i++) {
		var obj = words_array[i];
		var num = i+1;
		var perc = Math.round(((obj.count/total) * 100) * 100) / 100
		// content += num + " - <b>" + obj.word + "</b>, mentioned " + obj.count + " times " + "(" + perc + "%) <br />";
		content += "<span class='number_bubble'>" + num + "</span><a href='javascript:;' onclick='forceSearch(\"" + obj.word + "\")'><span class='search_result_bubble'>" + obj.word + "</span></a><span class='search_result_title'> mentioned " + obj.count + " times (" + perc + "%) </span><br />";
	}
	
	content += "</p>";
	
	return content;
}
pages.Home.Icon = "home";
pages.Home.HasButton = true;



pages.Add = {};
pages.Add.Title = "Add Meeting";
pages.Add.GroupRequired = "admin";
pages.Add.Content = "";
pages.Add.Content += "<p><a href='javascript:;' onclick='replaceContent(\"Processing\", 1)'>Upload Voice Data</a></p>";
pages.Add.Content += "<p></p>";
pages.Add.Icon = "add";
pages.Add.HasButton = true;

pages.List = {}
pages.List.Title = "List Meetings";
pages.List.ContentFunc = function() {
	// console.log("as");
	
	window.locked = true;
	setTimeout(function(){
			window.locked = false;
			forceSearch("");
			drawAnimation = false;
		}, 1000 // 5000 (5 seconds)
	);		
	
	var content = "<div class='img_center'><canvas name='loading' id='anim_canvas' width='600px' height='300px'/></div>"
	
	drawAnimation = true;
	
	return (content); 
}
pages.List.Icon = "list";
pages.List.HasButton = true;

pages.FAQ = {}
pages.FAQ.Title = "FAQ";
pages.FAQ.Content = "<h2>How do I import a meeting?</h2> \
<p>The proof of concept will accept text based meeting transcriptions of .doc, .txt, .rtf and similar text formats. To import a meeting file:<p/> \
<p>1.	Navigate to the Home page <br /> \
2.	Ensure user LStJack is logged in. <br /> \
3.	Select ‘Add Meeting’ <br /> \
4.	The ‘Add Meeting’ display appears <br /> \
5.	Select ‘Upload File’ <br /> \
6.	Enter the meeting criteria (Discussed Topics, Location, Date, Start Time, Finish Time, Attendees) <br /> \
7.	Select the upload button (File selection popup appears) <br /> \
8.	Select the meeting file to upload <br /> \
9.	Select upload meeting <br /> \
10.	The processing file screen appears <br /> \
11.	The edit meeting display appears <br /> \
12.	Modify discussed topics and attendees <br /> \
13.	Select submit <br /> \
14.	‘Meeting imported successfully’ text will appear</p> \
<h2>How do I edit the keyword threshold?</h2> \
<p>The keyword threshold value will adjust the level of word occurrences required for the system to deem the word a ‘keyword’ for the meeting.</p> \
<p>To edit the keyword threshold:</p> \
<p>1.	Navigate to the Home page <br /> \
2.	Ensure user LStJack is logged in. <br /> \
3.	Select the settings icon <br /> \
4.	The settings display is shown <br /> \
5.	Under the ‘keyword threshold’ setting, change the default value <br /> \
6.	Select update <br /> \
7.	The update successful indicator is shown <br /> \
8.	Click home button <br /> \
9.	Select the settings icon <br /> \
10.	The updated value for meeting threshold is shown under the ‘keyword threshold’ setting.</p> \
<h2>How do I browse imported meetings?</h2> \
<p>The PoC will allow meetings stored in the system to be listed and selected for review and editing.</p> \
<p>To browse imported meetings:</p> \
<p>1.	Navigate to the Home page <br /> \
2.	Ensure user LStJack is logged in. <br /> \
3.	Select ‘List meetings’ <br /> \
4.	The ‘List meetings’ display is shown <br /> \
5.	All meetings within the system are shown <br /> \
6.	Click on one of the meetings to view and edit details</p> \
<h2>Can I view the raw meeting data?</h2> \
<p>No. As this application is only intended as a proof of concept, the raw meeting files are not stored on the web server for viewing. It is noted that this feature is relatively easy to implement and does not represent the core focus of the project, and thus the feature has been omitted from the proof of concept.</p> \
<p>I am unable to import my meeting file.</p> \
<p>Ensure the following checks have been performed on the meeting file:</p> \
<p>•	The meeting file is of a compatible data format. If possible, save the text file as a .txt file with the only the raw meeting text. Import the .txt into the system <br /> \
•	Ensure the file is not already open locally. <br /> \
•	Ensure the file exists in the location specified <br /></p> \
<p>If the issue still persists, please contact teamhairbrain@gmail.com</p>"

pages.FAQ.Icon = "faq";
pages.FAQ.HasButton = true;

// pages.Search = {}
// pages.Search.Title = "Search Meetings";
// pages.Search.Content = "<p>Search meetings, using jquery to retrieve data from server, allow user to view individual meetings, or search by keyword across all meetings.</p>"; //
// pages.Search.Content += "<p><a href='javascript:;' onclick='doSearch(search_term, search_type)'>Click me! (One day this will be a beautiful text box)</a></p>";
// pages.Search.Icon = "search";
// pages.Search.HasButton = true;

pages.Settings = {}
pages.Settings.Title = "Settings";
pages.Settings.Content = "<p>The only setting that matters is colour!</p>"; //
pages.Settings.Icon = "settings";
pages.Settings.HasButton = true;



//// HIDDEN PAGES	
	// User Login System				
	pages.Login = {}
	pages.Login.Title = "Login";
	pages.Login.GroupRequired = "hidden";
	pages.Login.Content = "<p>This does nothing, but it could.</p>";
	
	pages.Register = {}
	pages.Register.Title = "Register";
	pages.Register.GroupRequired = "hidden";
	pages.Register.Content = "<p>This does nothing, but it could.</p>";
	
	pages.Logout = {}
	pages.Logout.Title = "Logout";
	pages.Logout.GroupRequired = "hidden";
	pages.Logout.Content = "<p>This does nothing, but it could.</p>"; 
	// 
	
	// View/ Edit Individual Meeting
	pages.EditMeeting = {}
	pages.EditMeeting.Title = "Edit Meeting";
	pages.EditMeeting.GroupRequired = "hidden";
	pages.EditMeeting.ContentFunc = function(data) {
		
		// console.log(data);		
		
		var content = "";
		// content += "<div class='right_box'><p>Graph showing occurences of the keyword 'cat' throughout the meeting.</p>";
		content += "<div class='right_box'><p>Graph showing most used keywords throughout the meeting.</p>";
		content += "<p><canvas name='graph' id='test' width='350px' height='250px'/></p>";	
		// content += "<p><audio controls id='audio_test'><source src='nosound.mp3' type='audio/mpeg'></audio></p>";
		content += "</div>";	

		// 'data' is a mysql database table converted to javascript table
		
		var id = data-1;
		var meeting = meetings[id];
		var formid = "form" + id
		
		var d = new Date();
		
		
		content += '<form id="' + formid + '" onsubmit="event.preventDefault(); return allInForm(\'' + id + '\', \'' + formid + '\');">';
		content += "<div class='form_box'>"
		content += "<p>Discussed Topics<br /><input type='text' id='topic' value='" + meeting.topic + "'></p>";
		content += "<p>Location<br /><input type='text' id='location' value='" + meeting.location + "'></p>";
		
		
		
		//var dateString = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
		//var timeString = d.getHours() + ":" + d.getMinutes();
		
		//console.log(timeString, dateString);
		
		content += "<p>Date<br /><input type='text' id='date' value='" + meeting.date + "'></p>";
		content += "<p>Time<br /><input type='text' id='time_start' value='" + meeting.time + "'></p>";
		
		// content += "<p>Minutes<br /><input type='file' id='minutes' value=''></p>";
		// content += "<p>Agenda<br /><input type='file' id='agenda' value=''></p>";
		
		
		
		
		content += "</div>";
		
		content += "<div class='form_box' id='attendee_box'>"
		
		var attendees = meeting.attendees.split(", ");		
		
		content += "<span id='att_num'>Attendees (" + attendees.length + ")</span>";
		//content += "<a href='javascript:;' onclick='addAttendeeField(\"" + attendee_name + "\")'><div class='add_remove_attendees'>+</div></a>";
		
		content += "<a href='javascript:;' onclick='addAttendeeField()'><div class='add_remove_attendees'>+</div></a>";
		content += "<a href='javascript:;' onclick='dropAttendeeField()'><div class='add_remove_attendees'>-</div></a>";
		
		
		// content += "<div class='form_element_box'><input type='text' id='name0' value='111'></div>";
		// content += "<div class='form_element_box'><input type='text' id='name2' value='111'></div>";
		// content += "<div class='form_element_box'><input type='text' id='name3' value='111'></div>";
		// content += "<div class='form_element_box'><input type='text' id='name4' value='111'></div>";
		
		content += "</div>";
		
		attendee_fields = [];

		setTimeout(function() {
			// addAttendeeField();
			// addAttendeeField();
			
			for (var i = 0; i < attendees.length; i++) {
				addAttendeeField();
				var element = document.getElementById("attendee" + i);     
				element.value = attendees[i];
			}
		}, 100);
		
			
		content += "<div class='form_element_box'><input type='submit' value='Submit'></div>";
		
		content += "</form>";
		content += "<br />";
		content += "<br />";
		content += "<br />";
		
		// content += "<p>Submitting this, by pressing enter with any box selected or by pressing the 'Submit' button will for now just list all of the form's values. Soon it will send the form data to a PHP file that will connect to a MySQL server using AJAX, this will update the database with the information present in the form.</p>";
		
		// content += "<p>Clicking on a bar/ chunk in the graph will set the sound file to that time period, the graph will also update periodically to display the current position of the sound file as it's being played.</p>";
		
		
		// var data = {};
		
		setTimeout(function() { addPieGraph("test", meeting.keywords) }, 1000);
		
		// addBarGraph("test", data, "Time", "Occurences");
		
		return (content); 
	};										 
			
	// Search System
	
	pages.SearchResults = {}
	pages.SearchResults.Title = "Search Results";
	pages.SearchResults.GroupRequired = "hidden";
	pages.SearchResults.ContentFunc = function(data) {		
		var content = "<p>Search results for '"  + data[0] + "'...</p>";	
		content += "<p>Number of results: " + (sizeObj(data)-1) + "</p>";
		
		for (var i = 1; i < sizeObj(data); i++) {
			
			var meeting = data[i]
			
			var toSend = (parseInt(meeting.ID))+1;
			content += "<div class='search_result'><div class='search_result_title'><b>Search result " + (i) + "</b> - <a href='javascript:;' onclick='replaceContent(\"EditMeeting\", " + toSend + ")'>" + meeting.topic + "</a></div>";

			for (var word in meeting.keywords) {
				var keyword = word.toLowerCase();
				var indexOf = keyword.indexOf(data[0])
				if (indexOf > -1) {					
					
					var test = keyword.slice(0, indexOf) + "<b style='color: red;'>" + data[0] + "</b>" + keyword.slice(indexOf + data[0].length, keyword.length);
					
					content += "<a href='javascript:;' onclick='forceSearch(\"" + keyword + "\")'><span class='search_result_bubble'>" + test + "</span></a>";
					content += " ";
				}
			}
			content += "</div>";			
		}
		
		return content;
	}
	
	pages.Processing = {}
	pages.Processing.Title = "Processing Voice File...";
	pages.Processing.GroupRequired = "hidden";
	pages.Processing.ContentFunc = function(data) { 
		window.locked = true;
		setTimeout(function(){
				window.locked = false;
				replaceContent("EditMeeting", data)		
				drawAnimation = false;
			}, 5000 // 5000 (5 seconds)
		);		
		
		var content = "<p>The file is currently being processed by the server, it is being ran through speech recognition to look for keywords. <br />";
		content += "When the upload/ processing has completed, the user will be redirected to a page that lets them edit this newly added meeting.</p>";
		//content += "<p><div class='img_center'><img src='img/loader.gif'></img></div></p>"
		content += "<div class='img_center'><canvas name='loading' id='anim_canvas' width='600px' height='300px'/></div>"
		
		drawAnimation = true;
		
		return (content); 
	}
	
	pages.Error = {}
	pages.Error.Title = "404";
	pages.Error.GroupRequired = "hidden";
	pages.Error.Content = "<p>Page not found.</p>";

////