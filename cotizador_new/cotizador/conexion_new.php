<?php
require_once("config_new.php");

$mbd = new PDO("mysql:host=$config_db_host;dbname=$config_db_database", $config_db_user, $config_db_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES  \'UTF8\''));
$mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$mbd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
