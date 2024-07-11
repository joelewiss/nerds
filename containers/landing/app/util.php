<?php
// Various utility functions used around the code
define('__DIR__', dirname(__FILE__));
require_once(__DIR__."/../webpageConf/config.php");

function checkToken($token1, $token2) {
    return preg_match("/^[0-9a-z]{12}$/", $token1) and preg_match("/^[0-9a-z]{12}$/", $token2);
}

function checkPid($pid) {
    return !is_null($pid) and strlen($pid) > 0;
}

function checkMobile($userAgent) {
    // Detection Script adapted from http://detectmobilebrowsers.com/
    $pattern = '/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfr    ont|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i';
    return preg_match($pattern, $userAgent);
};

function studyLimitReached() {
    // Returns true if we've exceeded the total number of studies defined by maxInstances
    global $dbhost, $dbname, $dbuser, $dbpass, $maxInstances;
    $connect = new PDO("pgsql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sth = $connect->prepare('SELECT COUNT(*) as count FROM "createdInstances";');
    $sth->execute();
    $results = $sth->fetch(PDO::FETCH_ASSOC);
    return $results['count'] > $maxInstances;
}

function generateAlphanumeric($length) {
    // Generates a random alphanumeric characters a-z and 0-9 of length 12
    $v = "";
    for ($i = 0; $i < $length; $i++) {
        $x = mt_rand(0, 35);
        if ($x <= 25) {
            $v.=chr($x+97);
        } else {
            $v.=chr(($x-26)+48);
        }
    }

    return $v;
}

function get_ip() {
    //Just get the headers if we can or else use the SERVER global
    if ( function_exists( 'apache_request_headers' ) ) {
        $headers = apache_request_headers();
    } else {
        $headers = $_SERVER;
    }
    //Get the forwarded IP if it exists
    if ( array_key_exists( 'X-Forwarded-For', $headers ) && filter_var( $headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
        $the_ip = $headers['X-Forwarded-For'];
    } elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) && filter_var( $headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 )) {
        $the_ip = $headers['HTTP_X_FORWARDED_FOR'];
    } else {
        $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );
    }
    return $the_ip;
}
