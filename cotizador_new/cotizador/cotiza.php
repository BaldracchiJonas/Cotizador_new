<!-- Inicio Secciones -->
<div id="page_cotiza" class="page_body">
    <div class="section_datos_cotiza">
        <div class="mensaje_container">
            Se enviara la solicitud a nuestro departamento de ventas. Un ejecutivo de cuentas se contactará con usted.
            <div class="aviso">Por favor corrobore sus datos personales, los de su vehículo y opción de póliza elegida.</div>
        </div>
        <div class="vista_final_container">
            <div class="section_vista_container">
                <div class="section_title_vista">
                    <i class="icono_custom car"></i>
                    <h2 class="section_title">
                        DATOS DEL
                        <span>VEHÍCULO</span>
                    </h2>
                </div>
                <div id="DatosVehiculoStep3" class="section_vista">
                    <div class="item_texto">Año:
                        <span id="año_choice">2014</span>
                    </div>
                    <div class="item_texto">Marca:
                        <span id="marca_choice">Ford</span>
                    </div>
                    <div class="item_texto">Modelo:
                        <span id="modelo_choice">Fiesta</span>
                    </div>
                    <div class="item_texto">GNC:
                        <span id="gnc_choice">Si</span>
                    </div>
                    <div class="item_texto">Accesorios:
                        <span id="accesorios_choice">No</span>
                    </div>
                </div>
                <div class="section_button_modificar">
                    <input type="button" id="datos_vehiculo" class="button_white" value="MODIFICAR">
                </div>
            </div>
            <div class="section_vista_container">
                <div class="section_title_vista">
                    <i class="icono_custom persona"></i>
                    <h2 class="section_title">
                        DATOS
                        <span>PERSONALES</span>
                    </h2>
                </div>
                <div id="DatosPersonaStep3" class="section_vista">
                    <div class="item_texto">Nombre y Apellido:
                        <span>2014</span>
                    </div>
                    <div class="item_texto">Localidad:
                        <span>Ford</span>
                    </div>
                    <div class="item_texto">Email:
                        <span>Fiesta</span>
                    </div>
                    <div class="item_texto">Tel.:
                        <span>Si</span>
                    </div>
                </div>
                <div class="section_button_modificar">
                    <input type="button" id="btn_modificar_datos_personales" class="button_white" value="MODIFICAR">
                </div>
            </div>
            <div class="section_vista_container">
                <div class="section_title_vista">
                    <i class="icono_custom dobleHoja"></i>
                    <h2 class="section_title">
                        <span>PÓLIZA</span> ELEGIDA
                    </h2>
                </div>
                <div id="DatosPolizaStep3" class="section_vista">
                    <div class="item_texto">OPCION 1
                    </div>
                    <div class="item_texto">Todo Riesgo -
                        <span>Incluye recuperacion vehicular</span>
                    </div>
                    <div class="item_texto">FINALES X MES +IVA
                        <span>$1722</span>
                    </div>
                </div>
                <div class="section_button_modificar">
                    <input type="button" id="datos_poliza" class="button_white" value="MODIFICAR">
                </div>
            </div>
        </div>

    </div>
    <div class="section_row">
        <input id="button_final" type="button" class="button_red" value="CONFIRMAR  COTIZACIÓN">
        <div class="aviso_button">Esta acción no tiene obligación de compra. </div>
    </div>
    <input type="hidden" name="cotID" id="cotID" value="" />
</div>