---
<?php

header("Content-Type: text/html; charset=utf-8");
include("config.php");
include($config["class_root"]."syn_class.php");

$output = new synDirectory();

$about_site = file_get_contents('about.txt');
echo "<textarea cols=50 rows=15>$about_site</textarea>";
---
