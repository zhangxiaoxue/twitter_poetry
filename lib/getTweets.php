<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => "394577255-CPUOnPK8VwAvkesS0C2G42kM40O2U7jaof1fxe31",
    'oauth_access_token_secret' => "9JvH5T8StsuiitGecXiE3OigHyqVsOl3h8ZDkEpxmnBlY",
    'consumer_key' => "dKwU5E59sprof8JXasAzZz77Y",
    'consumer_secret' => "XTmaDFIoJbicgv02gq14PCSYjUDGTdT2whv0qrN8pO8Sj2CBSM"
);


/** Perform a GET request and echo the response **/
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q="I remember " '.$_GET['city'];
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
