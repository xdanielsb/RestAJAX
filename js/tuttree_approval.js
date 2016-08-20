/*
    Init the masters in the left panel
*/
var init =  function(data){
    masters =JSON.parse(data)
    current = masters[number]
    var table = "<center><h2> Masters </h2> ";
    table += "<table border='1'>  ";
    var fields = ["mas_id","first_name","last_name"];
    for(var master in masters){
	    table += "<tr>";
		for(var f in fields){
		    field_name = fields[f];
		    table +=" <td>"+masters[master][fields[f]]+"</td>";
		}
        table += "<td> <button id="+masters[master]["mas_id"]+" type='button' onclick='record_clicked(this.id)'>&#10003; </button> </td>"
		table += "</tr>";
	}
	table += "</table></center>"
    document.getElementById("leftPanel").innerHTML =table;  //Add the table to the div
    /*
        Set the first register 
            details
            images
    */
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=details&mas_id="+current["mas_id"], "", details);        
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=images&mas_id="+current["mas_id"], "", images); 
}
/*
    Set  the details of a master
*/
var details = function(d){
    current = JSON.parse(d)[0];   
    var data = "<br><center>"; 
    if(current["profile_pic"]!= null){ //Verifies if the master has a picture
        data += "<img src="+current["profile_pic"]+" alt='person' height='150' width='100'>"+"<br>";
    }
    data += current["first_name"]+ " "+current["last_name"]+"<br>";
    data += "<b>"+current["university"]+"</b><br>";
    if(current["about"]!= null){
        data += "<i>"+current["about"]+"</i><br>";
    }

    document.getElementById("rightPanel").innerHTML =data; 
}
    
/*
    update the tables 
*/
var updateData = function(){
    //Update de currently table with the new values
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=pending", "", init);    //call the ajax 
}
/*
    Set the images of the  current master
*/
var imag = function(i){
    images = JSON.parse (i); 
    var data = "<br>Documents:<br><center>"; 
    for (image in images){
        if(images[image]["image"].split('.').pop()=='jpg'){
            data += "<img src="+images[image]["image"]+"  height=500 width=500><br>";
        }else {
            data += "<embed src="+images[image]["image"]+" width='600' height='800' type='application/pdf'>";
        }
    }
    data += "</center>";
    document.getElementById("bottomPanel").innerHTML =data; 
}

/*
    approve the current master
    take in account the status id 
*/
function approve_current_record (){    
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=set_status&status=1&mas_id="+current["mas_id"], "", updateData);   
}

/*
    Reject the current master
*/
function reject_current_record (){
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=set_status&status=2&mas_id="+current["mas_id"], "", updateData);
}

//Open the details of the master
function record_clicked (id){
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=details&mas_id="+id, "", details);
    ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=images&mas_id="+id, "", imag);
}

/*
  Events of  Key pressed
*/
function key_pressed(event) {
    var x = event.keyCode;
    event.preventDefault();
    if (x == 65 || x == 97) {  // Letter A and a
        approve_current_record();
    }
    if (x == 114 || x == 82) {  // Letter R and r
        reject_current_record();
    }
    /*
       Note: Add logic to the number does not exceeds the number of items in the json master   
    */
    if (x == 40 ) {  // Key down
        number += 1;
        current = masters[number];
        record_clicked(current["mas_id"]);
    }

    if (x == 38 && number >1) {  // Key up;
        number += -1;
        current = masters[number];
        record_clicked(current["mas_id"]);
    }
}
       
/*
    This is the logic of ajax
*/
function ajax(url, vars, callbackFunction){
    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    request.open("GET", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText){
                callbackFunction(request.responseText);
            }
        }
    }
    request.send(vars);
}
 

ajax ("http://localhost/tutree_library/tuttree_approval/index.php?ac=pending", "", init);    //call the ajax function for loading the initial content
document.addEventListener("keydown", key_pressed, false);     //fill the left panel with masters
var current ; //identifies the current master
var number=0; //the number of the current master

    

    


