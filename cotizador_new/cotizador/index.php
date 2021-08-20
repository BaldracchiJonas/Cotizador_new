<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  session_start();
  require_once "conexion_new.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
 
	<meta property="og:url" content="https://www.stopcar.com.ar/cotizador/index.php" />
	<meta property="og:type"  content="website" />
	<meta property="og:title" content="STOPCAR" />
	<meta property="og:site_name" content="STOPCAR" />
	<meta property="og:description"  content="Rastreo Satelital" />
	<meta property="og:image"  content="https://www.stopcar.com.ar/cotizador/img/logoStopcar.png" />  
	<meta property="og:image:width" content="600" />
	<meta property="og:image:height" content="200" />	
	<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
 <title>StopCar</title>

  <!-- Fonts -->
  <link rel="canonical" href="https://www.stopcar.com.ar/cotizador/index.php" />
	<link href="https://fonts.googleapis.com/css?family=Roboto:100,300" rel="stylesheet">
  <link rel="stylesheet" href="fonts/fuentes.css">
  <!-- Bootstrap -->
  <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="wow/css/libs/animate.css">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="media.css">
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noodp"/>
	<meta name="description"  content="Rastreo Satelital" />

</head>


<body>
  <!--Inicio Header-->
  <div>  
    <div>
      <img src="img\logoStopcar.png" class="logo_stopcar" alt="">
    </div>
    <div class="contener_imagen">
      <img src="img\stopcar recortada.png" class="header_imagen" alt="">
        <div class="cotiza_text">
          <div>COTIZÁ TU VEHÍCULO</div>
          <div style="margin-top:-5px">EN TRES PASOS.</div>
          <div class="calcular_text" style="margin-top:5px">Calculá el precio de tu seguro</div>
          <div class="calcular_text">y obtené <span class="cobertura_text">la mejor cobertura.</span></div>
    </div>
  </div> 
  <!--Fin Header-->
  <!-- Inicio Pagina -->
  <div class="page_body_container">
    <div class="container_cargando">
      <img class="imagen_cargando" src="img/para-gif-01.gif" alt="" id="para-gif-01">
    </div>
    <!-- Inicio Nav -->
    <div class="prueba" id="paso_total">
      <div class="paso" id="paso1"></div>
      <div class="paso" id="paso2"></div>
      <div class="paso" id="paso3"></div>
    </div>
    <nav class="nav_opcion_container">
      <div id="opcion_datos" class="nav_opcion select">
        <div class="nav_opcion_border"></div>
        <div class="nav_opcion_text">
          <span class="nav_opcion_number"><div class="circle" id="numero1">1</div></span> <p id="datos_veh" style="margin: 0"> &nbsp DATOS DE TU VEHICULO.</p>
        </div>
      </div>
      <div id="opcion_cuota" class="nav_opcion">
        <div class="nav_opcion_border"></div>
        <div class="nav_opcion_text">
          <span class="nav_opcion_number"><p class="circle" id="numero2">2</p></span> <p id="datos_per"> &nbsp DATOS PERSONALES.</p>
        </div>
      </div>
      <div id="opcion_cotiza" class="nav_opcion">
        <div class="nav_opcion_border"></div>
        <div class="nav_opcion_text">
          <span class="nav_opcion_number"><p class="circle" id="numero3">3</p></span> <p id="tu_cot"> &nbsp TU COTIZACIÓN.</p>

        </div>
      </div>
    </nav>
    <!-- Fin Nav -->
    <?php
    include 'datos.php';
    include 'cuota.php';
    include 'cotiza.php';
    include 'final.php';
    // include 'modal_new.php';
    ?>
  </div>
  <!-- Fin Pagina -->
  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="https://www.google.com/recaptcha/api.js?onload=CaptchaCallback&render=explicit" async defer></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="bootstrap/js/bootstrap.min.js"></script>
  <script src="wow/dist/wow.min.js"></script>
  <script src="custom.js"></script>
  <script src="jquery.autocomplete.js"></script>
  <script src="cotizador.js"></script>

  
</body>

</html>