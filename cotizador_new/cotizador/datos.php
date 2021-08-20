<!-- Inicio Secciones -->
<div id="page_datos" class="page_body">
  <div class="section_datos">
    <div class="section_title_container">
      <!-- <i class="icono_custom car"></i>  icono auto class="icon_auto-->
      <img  src="img\auto.png" class="icon_auto" style="height:35px"/>
      <h2 class="section_title">DATOS DEL VEHÍCULO</h2>
    </div>
    <div class="formulario_datos">
      <div class="datos_container">
        <div class="datos  select_corto">
          Año
          <select class="formulario_select" name="año_vehiculo" id="cotAnio">
            <?php
              $yearVal = date('Y');
              for ($i = 0; $i < 25; $i++) {
                  echo '<option value="' . $yearVal . '">' . $yearVal . '</option>';
                  $yearVal--;
               }
            ?>
             <optgroup>
                <option value="0">Anteriores</option>
            </optgroup>
          </select>
        </div>
        <div class="datos select_medio" id="marcaContent">
          Marca
          <select class="formulario_select" name="marca_vehiculo" id="select_marca_vehiculo">
          </select>
        </div>
        <div class="datos select_medio">
          Modelo
          <select class="formulario_select" name="modelo_vehiculo" id="cotModelo">
              <option value="SELECCIONAR">SELECCIONAR</option>
          </select>
        </div>
        <div class="datos select_largo">
          Version
          <select class="formulario_select" name="version_vehiculo" id="cotVersion">
          <option value="SELECCIONAR">SELECCIONAR</option>
          </select>
        </div>
      </div>
      <div class="datos_container">
        <div class="datos select_corto">
          GNC
          <div class="select_checkbox">
            <label class="select_checkbox_option" for="checkbox_gnc_si">SI</label>
            <div id="checkbox_gnc_si" data-choice="SI" class="checkbox_container checkbox_gnc">
              <div class="checkbox"></div>
            </div>
            <label class="select_checkbox_option" for="checkbox_gnc_no">NO</label>
            <div id="checkbox_gnc_no" data-choice="NO" class="checkbox_container checkbox_gnc active">
              <div class="checkbox"></div>
            </div>
          </div>
        </div>
        <div class="datos select_largo">
          Costo del equipo
          <input type="text" class="form-control" maxlength="5" name="cotGncCost" id="cotGncCost" disabled />
        </div>
        <div class="datos select_corto">
          Accesorios
          <div class="select_checkbox">
            <label class="select_checkbox_option" for="checkbox_accesorios_si">SI</label>
            <div id="checkbox_accesorios_si" data-choice="SI" class="checkbox_container checkbox_accesorio">
              <div class="checkbox"></div>
            </div>
            <label class="select_checkbox_option" for="checkbox_accesorios_no">NO</label>
            <div id="checkbox_accesorios_no" data-choice="NO" class="checkbox_container checkbox_accesorio active">
              <div class="checkbox"></div>
            </div>
            <input type="hidden" id="cotAccDesc">
          </div>
        </div>
        <div class="datos select_largo">
          Costo de los accesorios
          <input type="text" class="form-control" maxlength="5" name="cotAccCost" id="cotAccCost" disabled />
        </div>
      </div>
    </div>
  </div>
  
  <!-- DATOS PERSONALES-->
  
  <div class="section_row" id="datosPersonales">
    <div class="section_title_container">
      <!-- <i class="icono_custom persona"></i> -->
      <img  src="img\persona.png" style="height:35px"/>
      <h2 class="section_title">DATOS PERSONALES DEL TITULAR</h2>
    </div>
    <div class="formulario_datos">
      <div class="datos_container datos_personales">
        <div class="datos select_largo">
          Nombre
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cliNombre">
          </input>
        </div>
        <div class="datos select_largo">
          Apellido
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cliApellido">
          </input>
        </div>
        <div class="datos select_largo">
          Localidad
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cotLocalidad"></input>
          <input type="hidden" id="idGuarda" name="idGuarda" />
        </div>
      <!-- </div> -->
      <!-- <div class="datos_container datos_personales"> -->
        <div class="datos select_largo">
          Telefono *
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cliTel">
          </input>
        </div>
        <div class="datos select_largo dato_largo_celular">
          Email *
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cliEmail">
          </input>
        </div>
        <div class="datos select_largo dato_largo_celular">
          Dominio (opctional)
          <input class="formulario_select" name="costo_accesorio_vehiculo" id="cliDominio">
          </input>
        </div>
      </div>
    </div>
  </div>
  <div class="section_row" style="align-items: center; margin-bottom: 35px; margin-top:-30px;">
    <div id="captcha2"></div>
  </div>
  <div class="section_row">
    <input id="btn_fin_step1" type="button" class="button_red" value="!VER MI COTIZACIÓN!">
  </div>
</div>