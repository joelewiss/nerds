<?php
//! Copyright (C) 2017 Christian Stransky
//!
//! This software may be modified and distributed under the terms
//! of the MIT license.  See the LICENSE file for details.

define('__DIR__', dirname(__FILE__)); 
require_once(__DIR__."/../webpageConf/config.php");
$connect = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

$userId = htmlspecialchars($_GET["userId"]);
$ec2instance = htmlspecialchars($_GET["ec2instance"]);

header('content-type: application/javascript; charset=utf-8');

if(strlen($userId) == 12 and preg_match("/^[0-9a-z]+$/", $userId)){
    $sth = $connect->prepare('UPDATE "createdInstances" SET heartbeat=NOW() WHERE userid = :userid AND ec2instance = :ec2instance;');
    $sth->bindParam(':userid', $userId);
    $sth->bindParam(':ec2instance', $ec2instance);
    $sth->execute();
}
?>
