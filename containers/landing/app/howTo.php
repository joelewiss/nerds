<?php
//! Copyright (C) 2017 Christian Stransky
//!
//! This software may be modified and distributed under the terms
//! of the MIT license.  See the LICENSE file for details.

define('__DIR__', dirname(__FILE__));
require_once(__DIR__."/../webpageConf/config.php");
require_once(__DIR__.'/../vendor/autoload.php');
require_once('util.php');

$token = htmlspecialchars($_POST['pid']);
$token2 = generateAlphanumeric(12);
$originParam = htmlspecialchars($_POST["origin"]);
$remoteIp = get_ip();

if(!checkPid($token)) {
    $webpageMessageHeader = "No participant ID found";
    $webpageMessage = "You must access this site with a participant ID.";
    $webpageRedirect = False;
    include(__DIR__."/static/error.php");
    die();
}

if (is_null($originParam)) {
    $webpageMessageHeader = "Invalid Parameters";
    $webpageMessage = "Your parameters were invalid";
    $webpageRedirect = False;
    include(__DIR__."/static/error.php");
    die();
}

// Validate captcha function, returns true or false
function validateCaptcha() {
    global $reCaptchaSecret, $remoteIp;

    if (isset($_POST["g-recaptcha-response"])) {
        $recaptcha = new \ReCaptcha\ReCaptcha($reCaptchaSecret);
        $resp = $recaptcha->verify($_POST["g-recaptcha-response"], $remoteIp);
        return $resp->isSuccess();
    } else {
        return false;
    }
}

if (!validateCaptcha()) {
    // No captcha information in header or validation failed. Will not redirect anywhere.
    $webpageMessageHeader = "reCaptcha validation failed!";
    $webpageMessage = "No reCaptcha information found in your request or
validation failed. You cannot continue to the study. Please contact the
administrators if this problem persists.";
    include(__DIR__."/static/error.php");
    die();
}

try{
    // Connect to database
    $connect = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $redisConn = new Redis();
    $redisConn->connect($redisIp);

    //Check if hard limit is reached:
    if (studyLimitReached()) {
        $webpageMessageHeader = "Study is over";
        $webpageMessage = "Thank you for your interest! We have already received the maximum number of participants for this study.";
        $webpageRedirect = False;
        include(__DIR__."/static/error.php");
        die();
    }

    // Check if daily limit is reached
    $sth = $connect->prepare('SELECT COUNT(*) as count FROM "createdInstances" WHERE ip = :ip AND time >= NOW() - \'1 day\'::INTERVAL');
    $sth->bindParam(':ip', $remoteIp);
    $sth->execute();
    $results = $sth->fetch(PDO::FETCH_ASSOC);
    //error_log($results['count']." instances started by ".$remoteIp, 0);
    if($results['count'] < $dailyMaxInstances){
        $uniqid = $token;

        $sth = $connect->prepare('SELECT cond, condcount FROM (SELECT c.condition as cond, COUNT(ci.condition) as condcount FROM conditions c LEFT JOIN "createdInstances" ci ON c.condition= ci.condition GROUP BY c.condition ORDER BY RANDOM()) AS f ORDER BY condcount ASC LIMIT 1;');
        //$sth->bindParam(':category', $resultsCat['category']);
        $sth->execute();
        $results = $sth->fetch(PDO::FETCH_ASSOC);

        $sth = $connect->prepare("SELECT category FROM conditions WHERE condition = :condition");
        $sth->bindParam(":condition", $results["cond"]);
        $sth->execute();
        $resultsCat = $sth->fetch(PDO::FETCH_ASSOC);

        $sth = $connect->prepare('SELECT userid FROM "createdInstances" ci WHERE userid = :userid;');
        $sth->bindParam(':userid', $token);
        $sth->execute();
        $resultsUserID = $sth->fetch(PDO::FETCH_ASSOC);
        if($resultsUserID['userid'] != $token){
            // If token not in DB yet, then add it, otherwise skip it
            $sth = $connect->prepare('INSERT INTO "createdInstances" (ip, time, origin, userid, condition, category) VALUES (:ip, NOW(), :origin, :userid, :condition, :category);');
            $sth->bindParam(':ip', $remoteIp);
            $sth->bindParam(':userid', $token);
            $sth->bindParam(':origin', $originParam);
            $sth->bindParam(':condition', $results['cond']);
            // $sth->bindParam(':condition', $resultsCond);
            $sth->bindParam(':category', $resultsCat['category']);
            $sth->execute();
        }

        include("static/howTo.php");
        ob_flush();flush();


        $serverToRunOn = $redisConn->blPop($redisQueue, $waitTimeoutForInstance);

        if ($serverToRunOn == False){
            // Our redis hasn't delivered a server even after waiting for $waitTimeoutForInstance seconds
            $sth = $connect->prepare('UPDATE "createdInstances" SET ec2instance = :ec2instance, instanceid = :instanceid WHERE userid = :userid;');
            $errorIndicator = "error";
            $sth->bindParam(':ec2instance', $errorIndicator);
            $sth->bindParam(':userid', $token);
            $sth->bindParam(':instanceid', $errorIndicator);
            $sth->execute();
        } else {
            $serverData = explode("|||", $serverToRunOn[1]);
            $ec2instance = $serverData[0];
            $instanceId = $serverData[1];
            //$sth = $connect->prepare('UPDATE "createdInstances" SET ec2instance = :ec2instance, instanceid = :instanceid, time=NOW(), heartbeat=NOW(), condition = :condition, category = :category, finished = False, "instanceTerminated" = False WHERE userid = :userid;');
            $sth = $connect->prepare('UPDATE "createdInstances" SET ec2instance = :ec2instance, instanceid = :instanceid, time=NOW(), heartbeat=NOW(), finished = False, "instanceTerminated" = False WHERE userid = :userid;');
            $sth->bindParam(':ec2instance', $ec2instance);
            $sth->bindParam(':userid', $token);
            $sth->bindParam(':instanceid', $instanceId);
            //$sth->bindParam(':condition', $results['cond']);
            // $sth->bindParam(':condition', $resultsCond);
            //$sth->bindParam(':category', $resultsCat['category']);
            $sth->execute();
        }
    } else {
        $webpageMessageHeader = "Error:";
        $webpageMessage = "You have already started to many instances, please try again in 24 hours.";
        $webpageRedirect = False;
        include(__DIR__."/static/error.php");
        die();
    }
} catch (PDOException $e) {
    $webpageMessageHeader = "Database error";
    //$webpageMessage = "A database error occured, please try again!";
    $webpageMessage = $e;
    $webpageRedirect = False;
    //$webpageRedirect = True;
    //$webpageRedirectUrl = "consent.php?token={$token}&token2={$token2}";
    include(__DIR__."/static/error.php");
    die();
} catch (RedisException $e) {
    $sth = $connect->prepare('UPDATE "createdInstances" SET ec2instance = :ec2instance, instanceid = :instanceid WHERE userid = :userid;');
    $errorIndicator = "error";
    echo $e;
    $sth->bindParam(':ec2instance', $errorIndicator);
    $sth->bindParam(':userid', $token);
    $sth->bindParam(':instanceid', $errorIndicator);
    $sth->execute();
    die();
}
?>
