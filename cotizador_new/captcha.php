<?php
session_start();

$url = 'https://www.google.com/recaptcha/api/siteverify';
$data = array(
  'secret' => '6LfcFSwUAAAAAAiMgCgpWamlf6ps_DuHNKTPV9yY',
  'response' => $_POST["g_recaptcha_response"]
);
$content = http_build_query($data);
$options = array(
  'http' => array (
  	'header' => "Content-Type: application/x-www-form-urlencoded\r\n".
                    "Content-Length: ".strlen($content)."\r\n".
                    "User-Agent:MyAgent/1.0\r\n",
    'method' => 'POST',
    'content' => $content
  )
);
$context  = stream_context_create($options);
$verify = file_get_contents($url, false, $context);
$captcha_success=json_decode($verify);

if($captcha_success->success==true){
	echo 1;
}else{
	echo 2;
}

/*if( $_SESSION['securityCode'] == $_POST['securityCode'] && !empty($_SESSION['securityCode'] ) ) {
	unset($_SESSION['securityCode']);
	echo "1";
} else {
	echo "2";
}*/
?>