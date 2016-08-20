<?php 

$dblink = tlib_dblink();
init();

/*
    Interpret the URL
*/
function init(){
    $ac  = $_GET["ac"];
    if($ac == ""){
       echo file_get_contents("templates/index.html");
    }
	elseif($ac=="pending"){
       echo get_pending_tutors();
	}
    elseif($ac=="details"){
        $mas_id = $_GET["mas_id"];
        echo  get_tutor_details($mas_id);
    }
    elseif($ac=="images"){
        $mas_id = $_GET["mas_id"];
        echo get_tutor_images($mas_id);
    }
    elseif($ac=="set_status"){
        $mas_id = $_GET["mas_id"];
        $status = $_GET["status"];
        echo set_tutor_status($mas_id,$status);
    }

}
		
/*
    Note: Change the query; error in mas_id = 4670
*/
function get_pending_tutors(){
    $status_id = 3;
    $query = "select  mas_id, first_name, last_name from master where mas_id <> 4670 and status = $status_id";
    $masters = tlib_query($query);
    return json_encode($masters);
}

/*
    Get tutor details
*/
function get_tutor_details($mas_id){
    $query ="select  mas_id ,first_name, last_name, about,profile_pic, major, university from master where mas_id =$mas_id";
    $details_master =tlib_query($query);
    return json_encode($details_master);
}

/*
    Change the status when the grader determines if the master is rejected or approved
*/
function set_tutor_status($mas_id,$status){
    $query ="update  master set status= $status where mas_id = $mas_id"; 
    tlib_sql($query);
    return "{'status':'ok'}";
}

/*
    Get the tutor images
*/
function get_tutor_images($mas_id){
    $query ="select  image from images where mas_id =$mas_id";
    $images_master =tlib_query($query);
    return json_encode($images_master);
}


/*
    Convert to a array
*/
function q2op($dataset,$f1='id',$f2='name'){
	$aa = array();
	foreach($dataset as $k=>$v){
		$aa[$v[$f1]] = $v[$f2];
	}
	return $aa;
}

/*
    Query to the database
*/
function tlib_query($q){
	global $dblink;
	if($dblink == null){
		$dblink = tlib_dblink();
	}
	$result = $dblink->query($q) or die(print_r($dblink->errorInfo(),true));
	$records = array();

	while($row = $result->fetch(PDO::FETCH_ASSOC)) {
		$records[]=$row;
    }
	$result->closeCursor();
	return $records;
}

/*
    Execute a sentence sql that change the state of something
*/
function tlib_sql($q){
	global $dblink;
	if($dblink == null){
		$dblink = tlib_dblink();
	}
	$result = $dblink->query($q)  or die(print_r($dblink->errorInfo(),true));;
}

/*
    Connection to the database
*/
function tlib_dblink(){
	global $dblink;
	if($_SERVER['HTTP_HOST'] == 'localhost'){	
		$link = new PDO("mysql:host=localhost;dbname=tutree", "a", "a")  or die(print_r($dblink->errorInfo(),true));;
	}else{
		$link = new PDO("mysql:host=104.236.41.101;dbname=tutree", "tutree_site", "NsV@Nmu*y[.~ve3#")  or die(print_r($dblink->errorInfo(),true));;
	}
	$dblink = $link;
	return $link;
}

?>
