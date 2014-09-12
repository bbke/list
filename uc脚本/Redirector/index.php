<?php

header("Content-Type: text/html; charset=utf-8");
include("config.php");
include($config["class_root"]."syn_class.php");

$output = new synDirectory();
$about = file_get_contents('about.txt');
echo "<pre>$about</pre>";