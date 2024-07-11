<?php
//! Copyright (C) 2017 Christian Stransky
//!
//! This software may be modified and distributed under the terms
//! of the MIT license.  See the LICENSE file for details.


define('__DIR__', dirname(__FILE__)); 
require_once(__DIR__."/../webpageConf/config.php");
require_once('util.php');
$connect = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

$userId = htmlspecialchars($_POST["userid"]);
$token2 = htmlspecialchars($_POST["token2"]);

if(checkPid($userId) and (strlen($token2) == 12 and preg_match("/^[0-9a-z]+$/", $token2))){
    $sth = $connect->prepare('SELECT instanceid as instanceid, hash as hash FROM "createdInstances" LEFT JOIN "conditions" ON "createdInstances".condition = "conditions".condition WHERE userid = :userid AND NOT "instanceTerminated";');
    $sth->bindParam(':userid', $userId);
    $sth->execute();
    $results = $sth->fetch(PDO::FETCH_BOTH);
    if(strlen($results["instanceid"]) > 1){
        if($results["instanceid"] == 'error'){
            echo("error");
        } else {
            /*$headers = get_headers("http://".$_SERVER["SERVER_NAME"]."/proxy/".$results["instanceid"]."/nb/tree", 1);
            if ($headers[0] == 'HTTP/1.1 200 OK') {
                echo("/proxy/".$results["instanceid"]."/?userId=".$userId."&u=".$results["hash"]."&token=".$token2);
            } else {
                echo("br");
            }*/
            echo("/proxy/".$results["instanceid"]."/?userId=".$userId."&u=".$results["hash"]."&token=".$token2);
        }
    } else {
        echo("nr");
    }
}else{
    echo("error");
}
?>
