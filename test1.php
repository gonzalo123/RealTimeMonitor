<?php
error_reporting(-1);
include('client/NodeLog.php');
$node = NodeLog::init('192.168.2.2');

$a = $var[1];
$a = 1/0;
//throw new Exception("aqa");

//$a = $va2r[2];

