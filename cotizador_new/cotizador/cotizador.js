// 2015-05-26 | Javier Puentes

jQuery.fn.forceNumeric = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            var shift = e.shiftKey;
            // Permite backspace, tab, delete, home, end, flechas, punto, numeros y numeros de teclado numerico UNICAMENTE
            return (!shift && ( // sin la tecla shift presionada
                key == 8 ||
                key == 9 ||
                key == 35 ||
                key == 36 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)));
        });
    });
};

$(document).ready(function () {

    $("#paso2").css('background-color','#d9d6d6');
    $("#paso3").css('background-color','#d9d6d6');
    $("#marcaContent select").addClass('content-loading');
    $("#datosPersonales").hide();
    $("#numero1").addClass('button_fade');
    $("#datos_veh").css('color','#A61B34');
    $("#btn_fin_step1").hide();
    $("#captcha2").hide();

    $("#cotGncCost, #cotAccCost, #manualTel, #manualAnio, #manualGncCost, #manualAccCost").forceNumeric();
    $('[data-toggle="tooltip"]').tooltip();
    // Autocomplete de cliente
    $("#cotLocalidad").autocomplete({
        serviceUrl: 'cotizadorWs_new.php',
        maxHeight: 150,
        minChars: 3,
        onSearchStart: function (q) {
            q.doAction = 9;
            $("#cotLocalidad").addClass('content-loading').css('background-position', 'right');
        },
        onSearchComplete: function (a) {
            $("#cotLocalidad").removeClass('content-loading');
        },
        onSelect: function (suggestion, e) {
            $("#idGuarda").val(suggestion.data);
        },
        onInvalidateSelection: function () {
            $("#idGuarda, #cotLocalidad").val("");
        },
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'No se encuentran resultados'
    }).blur(function () {
        if ($.trim($("#idGuarda").val()) == "") {
            $(this).val("");
        }
    });
    $.post('cotizadorWs_new.php', {
        doAction: 1
    }, function (data) {
        if (data.indexOf('CAS login Failed!') > 0) {
            alert("En este momento el servidor  no esta respondiendo.\nPor favor, intente nuevamente mas tarde.");
        }

        // Verifica errores
        error = $(data).find("listError").text();
        if ($.trim(error) != "") {
            alert("En este momento el servidor no esta respondiendo.\nPor favor, intente nuevamente mas tarde.");
            grecaptcha.reset();
            return false;
        }

        // Lee el XML
        rows = $(data).find("listMarcaVehiculo").html();
        // Guarda los arrays con datos
        var carId = [];
        var carDesc = [];
        $(rows).find("id").each(function (i, v) {
            carId[i] = $(this).text();
        });
        $(rows).find("descripcion").each(function (i, v) {
            carDesc[i] = $(this).text();
        });
        // Genera las opciones del select
        var carOption = 'Marca<select id="cotMarca" class="formulario_select" name="cotMarca"><option selected="selected" value="">SELECCIONAR</option>';
        $(carId).each(function (i, v) {
            carOption += '<option value="' + carId[i] + '">' + carDesc[i] + '</option>';
        });
        carOption += '</select>';
        // Reemplaza el HTML por el select generado
        $("div#marcaContent").html(carOption);
        return false;
    });
    // Change del a�o y la marca
    $(document).on('change', '#cotMarca, #cotAnio', function () {

        // if ($("#cotAnio").val() == "0") {
        //     if (confirm('Desea cotizar un auto con a\u00f1o anterior a los que figuran en el listado?')) {
        //         $("#requestForm").fadeOut(function () {
        //             $("#olderForm, #submitManualBudget").fadeIn();
        //         });
        //     } else {
        //         $("#cotAnio option:first").attr("selected", true);
        //     }
        //     return false;
        // }

        if ($("#cotMarca").val() != "" && $("#cotAnio").val() != "") {
            $("#cotVersion option").remove();
            loadModels();
        }
    });
    // Change del modelo
    $(document).on('change', '#cotModelo', function () {
        var idGrupoModelo = $("#cotModelo").val();
        var anio = $("#cotAnio").val();
        if (idGrupoModelo == "") {
            alert("Por favor, seleccione un Modelo.");
            $("#cotModelo").focus();
            return false;
        }
        $("#cotVersion option").remove();
        $("#cotVersion").addClass('content-loading');
        $.post('cotizadorWs_new.php', {
            anio: anio,
            idGrupoModelo: idGrupoModelo,
            doAction: 5
        }, function (data) {
            // Verifica errores
            error = $(data).find("listError").text();
            if ($.trim(error) != "") {
                alert($(data).find("descripcion").text());
                //alert("En este momento el servidor de Rio Uruguay no esta respondiendo.\nPor favor, intente nuevamente mas tarde.");
                $("#cotVersion").removeClass('content-loading');
                grecaptcha.reset();
                return false;
            }

            // Lee el XML
            rows = $(data).find("listUso").html();
            // Guarda los arrays con datos
            var modelId = [];
            var modelDesc = [];
            var modelVal = [];
            $(rows).find("id").each(function (i, v) {
                modelId[i] = $(this).text();
            });
            $(rows).find("descripcion").each(function (i, v) {
                modelDesc[i] = $(this).text();
            });
            $(rows).find("valor").each(function (i, v) {
                modelVal[i] = $(this).text();
            });
            // Genera las opciones del select
            var modelOption = '<option selected="selected" value="">SELECCIONAR</option>';
            $(modelId).each(function (i, v) {
                modelOption += '<option value="' + modelId[i] + '">' + modelDesc[i] + "-" +  modelVal[i] + '</option>';
            });
            // Reemplaza el HTML por el select generado
			
            $("#cotVersion").html(modelOption);
            $("#cotVersion").removeClass('content-loading');
            
			
		
			return false;
        });
    });
    //Change de GNC
    $(".checkbox_gnc").click(function () {
        if ($(this).attr('data-choice') == "SI") {
            $("#cotGncCost").removeAttr("disabled").focus();
        } else {
            $("#cotGncCost").attr("disabled", true).val('');
        }
    });
    //Change de Accesorios
    $(".checkbox_accesorio").click(function () {
        if ($(this).attr('data-choice') == "SI") {
            $("#cotAccCost, #cotAccDesc").removeAttr("disabled").focus();
        } else {
            $("#cotAccCost, #cotAccDesc").attr("disabled", true).val('');
        }
    });
    // Fin del step1
    $("#btn_fin_step1").click(function () {
        $("#page_cuota").hide(); //nuevo cambio para esconder page
        location.href = "#datos_per"; //ver si conviene que se mueva aca a pasar de pagina
        $("#paso2").css('background-color','#d9d6d6');
        $("#paso3").css('background-color','#A61B34');
        $("#numero2").removeClass('button_fade'); //no funcionaba sin remove
        $("#numero2").addClass('circle');
        $("#numero3").addClass('button_fade');
        $("#datos_veh").addClass('nav_opcion_text'); //nuevo
        $("#datos_veh").css('color','#d9d6d6'); //nuevo
        $("#tu_cot").css('color','#A61B34');
        $("#datos_per").css('color','#d9d6d6');
        $('.container_cargando').css('display', 'block');
        location.href = "#para-gif-01";
        if (!validate1stStep()) {
            $('.container_cargando').css('display', 'none');
            return false;
        }



        // if ($("#submitContinue").length == 0) {
        //     if(!validate1stStep()){return false;}
        // }

        // if ($("#cliNombre").val() == "") {
        //     alert("Ingrese el nombre del titular.");
        //     $("#cliNombre").focus();
        //     return false;
        // }

        // if ($("#cliApellido").val() == "") {
        //     alert("Ingrese el apellido del titular.");
        //     $("#cliApellido").focus();
        //     return false;
        // }

        // if ($("#cliEmail").val() == "") {
        //     alert("Ingrese un email de contacto.");
        //     $("#cliEmail").focus();
        //     return false;
        // }
        // if ($("#cliTel").val() == "") {
        //     alert("Ingrese un teléfono de contacto.");
        //     $("#cliTel").focus();
        //     return false;
        // }

        if ($("#submitContinue").length == 0) {
            if (!validateCaptcha()) {
                return false;
            }
        }

        // Postea los datos.
			var modeloElegido = $('#cotVersion option:selected').text();
			var valorElegido = modeloElegido.split("-")[1];
			//alert(valorElegido);
			
        var datosEnviados = {
			ValorVehiculo: valorElegido,	
            idModeloVehiculo: $("#cotVersion").val(),
            ModeloVehiculoVal: $("#cotVersion").val(),
            anio: $("#cotAnio").val(),
            idGuarda: $("#idGuarda").val(),
            Gnc: $(".checkbox_gnc.active").attr('data-choice'),
            ValorGnc: $("#cotGncCost").val(),
            ValorAccesorios: $("#cotAccCost").val(),
            doAction: 8
        };

         console.log(datosEnviados);

        $.post('cotizadorWs_new.php', datosEnviados, function (data) {
			// Verifica errores
            error = $(data).find("listError").text();
            if ($.trim(error) != "") {
                alert($(data).find("descripcion").text());
                // $(".modal-body").animate({"opacity": 1}, 300);
                // $(".modal-preloader").hide();
                grecaptcha.reset();
                return false;
            }

            // Lee el XML
            var rows = $(data).find("listCotizaciones").html();
            var policyContent = "";
            var contentWidthMultiplier = 0;
            if ($(rows).find('codigoRC').length < 1) {
                alert("No hay cotizaciones en linea disponibles para ese modelo en ese a\u00f1o.\nCont\u00e1ctenos al 0810-666-8666 para un asesoramiento personalizado.");
                grecaptcha.reset();
                // $(".modal-body").animate({"opacity": 1}, 300);
                // $(".modal-preloader").hide();
                return false;
            }
            $('.select').removeClass('select');
            $('#opcion_cuota').addClass('select');
            $('#page_datos').css('display', 'none');
            $('#page_cuota').css('display', 'block');
            var nombreCliente = $('#cliNombre').val();
            var apellidoCliente = $('#cliApellido').val();
            var anio = $("#cotAnio").val();
            var modelo = $('#cotModelo option:selected').text();
            var marca = $('#cotMarca option:selected').text();
            var gnc = $('.checkbox_gnc.active').attr('data-choice');
            var accesorios = $('.checkbox_accesorio.active').attr('data-choice');
            var localidad = $('#cotLocalidad').val();
            var email = $('#cliEmail').val();
            var telefono = $('#cliTel').val();

            var descripcion = '';
            descripcion += '<div class="cuadro_texto_left">';
            descripcion += '    <div class="texto_left_nombre">' + nombreCliente + ' ' + apellidoCliente + '</div>';
            descripcion += '    <div class="texto_left_title"> Detalles del vehículo: </div>';
            descripcion += '    <div class="texto_left_descripcion"> <div class="texto_left_info"> <span class="texto_left_title"> Año: </span>' + anio + '</div>';
            descripcion += '        <div class="texto_left_info"><span class="texto_left_title">Marca:</span>' + marca + '</div>';
            descripcion += '        <div class="texto_left_info"><span class="texto_left_title">Modelo:</span>' + modelo + '</div>';
            descripcion += '        <div class="texto_left_info"><span class="texto_left_title">GNC:</span>' + gnc + '</div>';
            descripcion += '        <div class="texto_left_info"><span class="texto_left_title">Accesorios:</span>' + accesorios + '</div>';
            descripcion += '    </div>';
            descripcion += '</div>';
            descripcion += '<div class="cuadro_texto_right">';
            descripcion += '    <h2 class="texto_right">SUMA ASEGURADA</h2>';
            descripcion += '    <h2 id="sumaAsegurada" class="number_right"></h2>';
            descripcion += '</div>';

            $("#descripcion_usuario").html(descripcion);

            $(rows).find('codigoRC').parent().each(function (i, v) {
                // console.log(this);
                var codigoRC = $(this).find('codigoRC').text();
                var descripcionRC = $(this).find('descripcionRC').text();
                var detalleCoberturaRC = $(this).find('detalleCoberturaRC').text();
                var codigoCasco = $(this).find('codigoCasco').text();
                var nombreCasco = '';
                var descripcionCasco = $(this).find('descripcionCasco').text();
                var detalleCoberturaCasco = $(this).find('detalleCoberturaCasco').text();
                var prima = $(this).find('prima').text();
                var premio = $(this).find('premio').text();
                var iva = $(this).find('iva').text();
                var sumaAsegurada = parseFloat($(this).find('sumaAsegurada').text()).toFixed(0);
                var valorCuota = (parseFloat($(this).find('premio').text())) / 3;

                if (i == 0) {
                    var sumaAsegurada = parseFloat($(this).find('sumaAsegurada').text()).toFixed(0);
                    $("h2#sumaAsegurada").html('$' + sumaAsegurada);
                }

                if (codigoCasco.indexOf('C-20') != -1 || codigoCasco.indexOf('C-80') != -1 || codigoCasco.indexOf('S') != -1 || codigoCasco.indexOf('T') != -1) {

                    if (codigoCasco.indexOf('C-') != -1) {
                        nombreCasco = 'Terceros';
                    } else if (codigoCasco.indexOf('S') != -1) {
                        nombreCasco = 'Terceros completos';
                    } else if (codigoCasco.indexOf('T') != -1) {
                        nombreCasco = 'Todo Riesgo';
                    }
                    // console.log(codigoRC);
                    // console.log(descripcionRC);
                    // console.log(detalleCoberturaRC);
                    // console.log(nombreCasco);
                    // console.log(codigoCasco);
                    // console.log(descripcionCasco);
                    // console.log(detalleCoberturaCasco);
                    // console.log(prima);
                    // console.log(premio);
                    // console.log(iva);
                    // console.log(sumaAsegurada);
                    // console.log(valorCuota);
                    contentWidthMultiplier++;
                    // policyContent += '<div class="policyContent">';
                    // policyContent += '<h5>Opci&oacute;n #' + contentWidthMultiplier + '</h5>';
                    // policyContent += '<h4>' + nombreCasco + ' <br /><small>' + descripcionCasco + ' + Resp. Civ. ' + descripcionRC + '</small></h4>';
                    // policyContent += '<h4 style="font-size:smaller">Incluye recuperaci&oacute;n vehicular</h4>';
                    // policyContent += '<h3>$' + Math.ceil(valorCuota) + '<br /><small>Finales X mes + IVA</small></h3>';

                    // policyContent += '</div>';


                    policyContent += '<div class="poliza_container">';
                    policyContent += '  <div class="poliza_opcion_container" data-poliza="OPCION ' + contentWidthMultiplier + '" data-valor-poliza="$' + Math.ceil(valorCuota) + '">';
                    policyContent += '      <input type="hidden" name="codigoRC" id="codigoRC" value="' + codigoRC + '" />';
                    policyContent += '      <input type="hidden" name="descripcionRC" value="' + descripcionRC + '" />';
                    policyContent += '      <input type="hidden" name="detalleCoberturaRC" value="' + detalleCoberturaRC + '" />';
                    policyContent += '      <input type="hidden" name="codigoCasco" value="' + codigoCasco + '" />';
                    policyContent += '      <input type="hidden" name="descripcionCasco" value="' + descripcionCasco + '" />';
                    policyContent += '      <input type="hidden" name="detalleCoberturaCasco" value="' + detalleCoberturaCasco + '" />';
                    policyContent += '      <input type="hidden" name="prima" value="' + prima + '" />';
                    policyContent += '      <input type="hidden" name="premio" value="' + premio + '" />';
                    policyContent += '      <input type="hidden" name="iva" value="' + iva + '" />';
                    policyContent += '      <input type="hidden" name="sumaAsegurada" value="' + sumaAsegurada + '" />';
                    policyContent += '      <input type="hidden" name="valorCuota" value="' + Math.ceil(valorCuota) + '" />';
                    policyContent += '      <div class="poliza_opcion_title">';
                    policyContent += '          <div class="poliza_opcon_title_text">';
                    policyContent += '              OPCION';
                    policyContent += '              <span>' + contentWidthMultiplier + '</span>';
                    policyContent += '          </div>';
                    policyContent += '          <div class="checked">';
                    policyContent += '              <i class="ic_box"></i>';
                    policyContent += '          </div>';
                    policyContent += '      </div>';
                    policyContent += '  </div>';
                    policyContent += '<div class="poliza_informacion_container">';
                    policyContent += '  <div class="cuadro_texto_left">';
                    policyContent += nombreCasco;
                    policyContent += '      <br> Incluye recuperación vehicular';
                    policyContent += '  </div>';
                    policyContent += '  <div class="cuadro_texto_right texto_finales">';
                    policyContent += '      <div>FINALES X MES +IVA</div>';
                    policyContent += '          <h2 class="number_right">$' + Math.ceil(valorCuota) + '</h2>';
                    policyContent += '      </div>';
                    policyContent += '  </div>';
                    policyContent += '  <div class="container_btn_ver_mas">';
                    policyContent += '      <input type="button" class="btn_ver_mas" value="Ver más...">';
                    policyContent += '  </div>';
                    policyContent += '  <div class="poliza_descripcion_container">';
                    policyContent += '      <div class="poliza_descripcion_borde">';
                    policyContent += '          <div class="poliza_decripcion_texto">';
                    policyContent += descripcionCasco;
                    policyContent += '          </div>';
                    policyContent += '      </div>';
                    policyContent += '      <div class="poliza_descripcion">';
                    policyContent += '          <div class="poliza_decripcion_texto">';
                    policyContent += '              Detalles de la póliza:<br>';
                    policyContent += detalleCoberturaCasco;
                    policyContent += '          </div>';
                    policyContent += '      </div>';
                    policyContent += '  </div>';
                    policyContent += '</div>';

                }
                if (contentWidthMultiplier == 3) {
                    return false;
                }

            });


            // Reemplaza el HTML por el generado
            $('.datos_container.datos_polizas').html(policyContent);
            // var contentWidth = contentWidthMultiplier * 195;
            // $("#scrollContent").css('width', contentWidth + 'px');
            // $(".modal-body").animate({"opacity": 1}, 300);
            // $(".modal-preloader").hide();
            // $(".policyContent:first").click();
            saveDataStep2();
            $('.poliza_opcion_container[data-poliza="OPCION 1"]').click(); //preguntar si comentar la opcion
            $('.container_cargando').css('display', 'none');
            saveAPI();
        });
    });
    $(document).on('click', '.poliza_opcion_container', function () {
        // var elem = $(this);
        $(this).addClass('active').siblings().removeClass('active');
        // $("#cotSpecs").fadeOut(function () {
        //     var specsText = '<b>Suma Asegurada:</b> $' + $(elem).find('[name=sumaAsegurada]').val();
        //     specsText += '<br /><br /><b>Detalles del veh&iacute;culo:</b> A&ntilde;o: ' + $("#cotAnio option:selected").text();
        //     specsText += '/ Marca: ' + $("#cotMarca option:selected").text() + ' / Modelo: ' + $("#cotVersion option:selected").text();
        //     specsText += '/ GNC: ' + $("#cotGnc").val() + ' / Accesorios: ' + $("#cotAcc").val();
        //     specsText += '<br /><br /><b>Detalles de la p&oacute;liza:</b> ' + $(elem).find('[name=detalleCoberturaCasco]').val();
        //     specsText += '<br /><br /><b>Detalles de Responsabilidad Civil:</b> ' + $(elem).find('[name=detalleCoberturaRC]').val();
        //     $("#cotSpecs").html(specsText).fadeIn();
        // });
    });

    // fin Step 2
    $('#BtnFinStep2').on('click', function () { //BtnFinStep2
     
        $('.container_cargando').css('display', 'block');
        $('.select').removeClass('select');
        $('#opcion_cotiza').addClass('select');
        $('#page_datos').css('display', 'none');
        $('#page_cotiza').css('display', 'block');
        $('#page_cuota').css('display', 'none');
        // $('#page_final').css('display', 'none'); nuevofinal

        var nombreCliente = $('#cliNombre').val();
        var apellidoCliente = $('#cliApellido').val();
        var anio = $("#cotAnio").val();
        var modelo = $('#cotModelo option:selected').text();
        var marca = $('#cotMarca option:selected').text();
        var gnc = $('.checkbox_gnc.active').attr('data-choice');
        var accesorios = $('.checkbox_accesorio.active').attr('data-choice');
        var localidad = $('#cotLocalidad').val();
        var email = $('#cliEmail').val();
        var telefono = $('#cliTel').val();
        var polizaElegida = $('.poliza_opcion_container.poliza_seleccionada').attr('data-poliza');
        var valorCuota = $('.poliza_opcion_container.poliza_seleccionada').attr('data-valor-poliza');

        var muestraAutoStep3 = '';
        muestraAutoStep3 += '<div class="item_texto"><span class="texto_left_title">Año:</span>';
        muestraAutoStep3 += '   <span id="año_choice">' + anio + '</span>';
        muestraAutoStep3 += '</div>';
        muestraAutoStep3 += '<div class="item_texto"><span class="texto_left_title">Marca:</span>';
        muestraAutoStep3 += '   <span id="marca_choice">' + marca + '</span>';
        muestraAutoStep3 += '</div>';
        muestraAutoStep3 += '<div class="item_texto"><span class="texto_left_title">Modelo:</span>';
        muestraAutoStep3 += '   <span id="modelo_choice">' + modelo + '</span>';
        muestraAutoStep3 += '</div>';
        muestraAutoStep3 += '<div class="item_texto"><span class="texto_left_title">GNC:</span>';
        muestraAutoStep3 += '   <span id="gnc_choice">' + gnc + '</span>';
        muestraAutoStep3 += '</div>';
        muestraAutoStep3 += '<div class="item_texto"><span class="texto_left_title">Accesorios:</span>';
        muestraAutoStep3 += '   <span id="accesorios_choice">' + accesorios + '</span>';
        muestraAutoStep3 += '</div>';

        $('#DatosVehiculoStep3').html(muestraAutoStep3);

        var muestraPersonaStep3 = '';
        muestraPersonaStep3 += '<div class="item_texto"><span class="texto_left_title">Nombre y Apellido:</span>';
        muestraPersonaStep3 += '   <span>' + nombreCliente + ' ' + apellidoCliente + '</span>';
        muestraPersonaStep3 += '</div>';
        muestraPersonaStep3 += '<div class="item_texto"><span class="texto_left_title">Localidad:</span>';
        muestraPersonaStep3 += '   <span id="marca_choice">' + localidad + '</span>';
        muestraPersonaStep3 += '</div>';
        muestraPersonaStep3 += '<div class="item_texto"><span class="texto_left_title">Email:</span>';
        muestraPersonaStep3 += '   <span id="modelo_choice">' + email + '</span>';
        muestraPersonaStep3 += '</div>';
        muestraPersonaStep3 += '<div class="item_texto"><span class="texto_left_title">Tel.:</span>';
        muestraPersonaStep3 += '   <span id="gnc_choice">' + telefono + '</span>';
        muestraPersonaStep3 += '</div>';

        $('#DatosPersonaStep3').html(muestraPersonaStep3);

        var muestraPolizaStep3 = '';
        muestraPolizaStep3 += '<div class="item_texto"><span class="texto_left_title">' + polizaElegida + '</span>';
        muestraPolizaStep3 += '</div>';
        muestraPolizaStep3 += '<div class="item_texto"><span class="texto_left_title">Todo Riesgo -</span>';
        muestraPolizaStep3 += '   <span>Incluye recuperacion vehicular</span>';
        muestraPolizaStep3 += '</div>';
        muestraPolizaStep3 += '<div class="item_texto" style="font-size:11px">FINALES X MES +IVA<br>';
        muestraPolizaStep3 += '   <span class="number_right" id="modelo_choice" style="font-size:28px"> ' + valorCuota + '</span>';
        muestraPolizaStep3 += '</div>';

        $('#DatosPolizaStep3').html(muestraPolizaStep3);
        $('.container_cargando').css('display', 'none');
    });

    // Enviar datos
    $("#button_final").click(function () {

        location.href = "#para-gif-02"; //nuevo
        $("#paso_total").hide(); //nuevo
        saveDataTotal();
    });
    
    $('#cotVersion').on('change', function () { //$('#cotAnio').on('change', function () { este es para prueba que aparezcan los datosPersonales al principio 
        
        location.href = "#datosPersonales"; 
        $("#paso1").css('background-color','#d9d6d6');
        $("#paso2").css('background-color','#A61B34');
        $("#paso3").css('background-color','#d9d6d6');
        $("#datosPersonales").fadeIn(1000);
        $("#numero1").removeClass('button_fade'); //no funcionaba sin remove
        $("#numero1").addClass('circle');
        $("#numero2").addClass('button_fade');
        $("#datos_veh").addClass('nav_opcion_text'); //nuevo
        $("#datos_veh").css('color','#d9d6d6'); //nuevo
        $("#datos_per").css('color','#A61B34');
        $("#btn_fin_step1").show();
        $("#captcha2").show();
        
    });


    // Enviar formulario manual
    $("#submitManualBudget").click(function () {

        var manualNombre = $("#manualNombre").val();
        var manualApellido = $("#manualApellido").val();
        var manualEmail = $("#manualEmail").val();
        var manualTel = $("#manualTel").val();
        var manualDominio = $("#manualDominio").val();
        var manualLocalidad = $("#manualLocalidad").val();
        var manualAnio = $("#manualAnio").val();
        var manualMarca = $("#manualMarca").val();
        var manualModelo = $("#manualModelo").val();
        var manualVersion = $("#manualVersion").val();
        var manualGnc = $("#manualGnc").val();
        var manualGncCost = $("#manualGncCost").val();
        var manualAcc = $("#manualAcc").val();
        var manualAccCost = $("#manualAccCost").val();
        var manualAccDesc = $("#manualAccDesc").val();

        if ($.trim(manualNombre) == "") {
            alert("Por favor, ingrese un nombre.");
            $("#manualNombre").focus();
            return false;
        }

        if ($.trim(manualApellido) == "") {
            alert("Por favor, ingrese un apellido.");
            $("#manualApellido").focus();
            return false;
        }

        if ($.trim(manualEmail) == "") {
            alert("Por favor, ingrese un email.");
            $("#manualEmail").focus();
            return false;
        }

        if ($.trim(manualTel) == "") {
            alert("Por favor, ingrese un teléfono.");
            $("#manualTel").focus();
            return false;
        }

        if ($.trim(manualLocalidad) == "") {
            alert("Por favor, ingrese una localidad.");
            $("#manualLocalidad").focus();
            return false;
        }

        if ($.trim(manualAnio) == "") {
            alert("Por favor, ingrese un a\u00f1o.");
            $("#manualAnio").focus();
            return false;
        }

        if ($.trim(manualMarca) == "") {
            alert("Por favor, ingrese una marca.");
            $("#manualMarca").focus();
            return false;
        }

        if ($.trim(manualModelo) == "") {
            alert("Por favor, ingrese un modelo.");
            $("#manualModelo").focus();
            return false;
        }

        if ($.trim(manualVersion) == "") {
            alert("Por favor, ingrese una versi\u00f3n.");
            $("#manualVersion").focus();
            return false;
        }

        if ($.trim(manualVersion) == "") {
            alert("Por favor, ingrese una versi\u00f3n.");
            $("#manualVersion").focus();
            return false;
        }

        if ($.trim(manualVersion) == "") {
            alert("Por favor, ingrese una versi\u00f3n.");
            $("#manualVersion").focus();
            return false;
        }

        if (manualGnc == "SI" && $.trim(manualGncCost) == "") {
            alert("Por favor, ingrese un valor para el equipo de GNC.");
            $("#manualGncCost").focus();
            return false;
        }

        if (manualAcc == "SI" && $.trim(manualAccCost) == "") {
            alert("Por favor, ingrese un valor para los accesorios.");
            $("#manualAccCost").focus();
            return false;
        }

        if (manualAcc == "SI" && $.trim(manualAccDesc) == "") {
            alert("Por favor, ingrese una descripci\u00f3n para los accesorios.");
            $("#manualAccDesc").focus();
            return false;
        }

        $(".modal-body").animate({
            "opacity": 0.3
        }, 300);
        $(".modal-preloader").show();

        $.post('Ws/cotizacionMail.php', {
            doAction: 1,
            cliNombre: manualNombre,
            cliApellido: manualApellido,
            cliEmail: manualEmail,
            cliTel: manualTel,
            cliDominio: manualDominio,
            idGuarda: manualLocalidad,
            cotAnio: manualAnio,
            cotMarca: manualMarca,
            cotModelo: manualModelo,
            cotVersion: manualVersion,
            cotGnc: manualGnc,
            cotGncCost: manualGncCost,
            cotAcc: manualAcc,
            cotAccCost: manualAccCost,
            cotAccDesc: manualAccDesc,
            cotCasco: 'A cotizar',
            cotSuma: 'A cotizar',
            cotCuota: 'A cotizar'
        }, function (data) {
            if (data == "1") {
                alert('Se ha enviado la solicitud a nuestro departamento de ventas.\nNos contactaremos con usted a la brevedad.');
            } else {
                alert('Ha ocurrido un error al intentar enviar la cotizaci\u00f3n.\nPor favor, intente nuevamente m\u00e1s tarde.');
                grecaptcha.reset();
            }
            $(".modal-body").animate({
                "opacity": 1
            }, 300);
            $(".modal-preloader").hide();
            $('#myModal').modal('hide');
        });
    });

});
// Funcion para cargar los modelos

$("#btnfinstep2").click(function () {  //btnfinstep2 button_final
    $('.container_cargando2').css('display', 'block');
    location.href = "#para-gif-02";
    if (!validate1stStep()) {
        $('.container_cargando2').css('display', 'none');
        return false;
    }});

function loadModels() {
    var idMarca = $("#cotMarca").val();
    var anio = $("#cotAnio").val();
    if (idMarca == "") {
        alert("Por favor, seleccione una marca.");
        $("#cotMarca").focus();
        return false;
    }

    $("select#cotModelo option").remove();
    $("select#cotModelo").addClass('content-loading');
    $.post('cotizadorWs_new.php', {
        anio: anio,
        idMarca: idMarca,
        doAction: 2
    }, function (data) {
        // Verifica errores
        error = $(data).find("listError").text();
        if ($.trim(error) != "") {
            alert($(data).find("descripcion").text());
            grecaptcha.reset();
            //alert("En este momento el servidor de Rio Uruguay no esta respondiendo.\nPor favor, intente nuevamente mas tarde.");
            $("select#cotModelo").removeClass('content-loading');
            return false;
        }

        // Lee el XML
        rows = $(data).find("listGrupoModelo").html();
        // Guarda los arrays con datos
        var modelId = [];
        var modelDesc = [];
        $(rows).find("id").each(function (i, v) {
            modelId[i] = $(this).text();
        });
        if (modelId.length == 0) {
            alert('No existen modelos para ese a\u00f1o en esa marca.\nIntente con otro a\u00f1o distinto.');
            grecaptcha.reset();
            $("select#cotModelo").removeClass('content-loading');
            return false;
        }

        $(rows).find("descripcion").each(function (i, v) {
            modelDesc[i] = $(this).text();
        });
        // Genera las opciones del select
        var modelOption = '<option selected="selected" value="">SELECCIONAR</option>';
        $(modelId).each(function (i, v) {
            modelOption += '<option value="' + modelId[i] + '">' + modelDesc[i] + '</option>';
        });
        // Reemplaza el HTML por el select generado
        $("select#cotModelo").html(modelOption);
        $("select#cotModelo").removeClass('content-loading');
        return false;
    });
}

// Valida la primer parte del form
function validate1stStep() {
    if ($("#idGuarda").val() == "") {
        alert("Ingrese una localidad.");
        $("#cotLocalidad").focus();
        return false;
    }

    if ($(".checkbox_gnc.active").attr('data-choice') == "SI" && $("#cotGncCost").val() == "") {
        alert("Ingrese un valor para el equipo de GNC.");
        $("#cotGncCost").focus();
        return false;
    }

    if ($(".checkbox_accesorio.active").attr('data-choice') == "SI" && $("#cotAccCost").val() == "") {
        alert("Ingrese un valor para los accesorios.");
        $("#cotAccCost").focus();
        return false;
    }

    if ($("#cotMarca option:selected").length == 0 || $("#cotMarca option:selected").val() == "") {
        alert("Por favor, seleccione una Marca.");
        $("#cotMarca").focus();
        return false;
    }

    if ($("#cotModelo option:selected").length == 0 || $("#cotModelo option:selected").val() == "") {
        alert("Por favor, seleccione un Modelo.");
        $("#cotModelo").focus();
        return false;
    }

    if ($("#cotVersion option:selected").length == 0 || $("#cotVersion option:selected").val() == "") {
        alert("Por favor, seleccione una Version.");
        $("#cotVersion").focus();
        return false;
    }

    if ($("#cliNombre").val() == "") {
        alert("Ingrese el nombre del titular.");
        $("#cliNombre").focus();
        return false;
    }

    if ($("#cliApellido").val() == "") {
        alert("Ingrese el apellido del titular.");
        $("#cliApellido").focus();
        return false;
    }

    if ($("#cliTel").val() == "") {
        alert("Ingrese un teléfono de contacto.");
        $("#cliTel").focus();
        return false;
    }
    if ($("#cotLocalidad").val() == "") {
        alert("Por favor, ingrese una localidad.");
        $("#cotLocalidad").focus();
        return false;
    }

    if ($("#cliEmail").val() == "") {
        alert("Ingrese un email de contacto.");
        $("#cliEmail").focus();
        return false;
    } else {
        var validador = emailIsValid($("#cliEmail").val());
        if (!validador) {
            alert("Ingrese un email valido");
            $("#cliEmail").focus();
            return false;
        }
    }
    return true;

}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Valida el captcha
/*function validateCaptcha() {

    /*CAPTCHA VALIDATION*/
/*if ($("#recaptcha_response_field").val() == "") {
        alert("Por favor, complete el captcha.");
        $("#recaptcha_response_field").focus();
        return false;
    }

    var isValidCaptcha = 0;

    $.ajax({
        url: 'captcha.php',
        method: 'post',
        data: {
            recaptcha_response_field: $("#recaptcha_response_field").val(),
            recaptcha_challenge_field: $("#recaptcha_challenge_field").val()
        },
        async: false,
        success: function (data) {
            if (data != "1") {
                alert('El captcha no es correcto. Por favor, intente nuevamente.');
                $("#recaptcha_response_field").focus();
                return false;
            } else {
                isValidCaptcha = 1;
            }
        }
    });

    if (isValidCaptcha == 0) {
        return false;
    }

    return true;

}*/

function validateCaptcha() {

    /*CAPTCHA VALIDATION*/
    if ($("#securityCode").val() == "") {
        alert("Por favor, complete el código de seguridad.");
        $("#securityCode").focus();
        $('.container_cargando').css('display', 'none');
        return false;
    }

    var isValidCaptcha = 0;

    $.ajax({
        url: '../captcha.php',
        method: 'post',
        data: {
            //securityCode: $("#securityCode").val(),
            g_recaptcha_response: grecaptcha.getResponse(),
            //recaptcha_challenge_field: $("#recaptcha_challenge_field").val()
        },
        async: false,
        success: function (data) {
            if (data != "1") {
                alert('Por favor, complete el captcha.');
                $("#securityCode").focus();
                $('.container_cargando').css('display', 'none');
                return false;
            } else {
                isValidCaptcha = 1;
            }
        }
    });

    if (isValidCaptcha == 0) {
        return false;
    }

    return true;

}

// Funcion carga datos
function saveDataStep2() {
    $.post('cotizadorWs_new.php', {
        doAction: 10,
        cliNombre: $("#cliNombre").val(),
        cliApellido: $("#cliApellido").val(),
        cliEmail: $("#cliEmail").val(),
        cliTel: $("#cliTel").val(),
        cliDominio: $("#cliDominio").val(),
        idGuarda: $("#idGuarda").val(),
        cotAnio: $("#cotAnio").val(),
        cotMarca: $("#cotMarca").val(),
        cotModelo: $("#cotModelo").val(),
        cotVersion: $("#cotVersion").val(),
        cotGnc: $("#cotGnc").val(),
        cotGncCost: $("#cotGncCost").val(),
        cotAcc: $("#cotAcc").val(),
        cotAccCost: $("#cotAccCost").val(),
        cotAccDesc: $("#cotAccDesc").val()
    }, function (data) {
        if (data != "-1") {
            $("#cotID").val($.trim(data));
        }
    });
}

// Funcion completar carga de datos
function saveDataTotal() {
    $('.container_cargando2').css('display', 'block');
    // $("#cotSpecs").slideUp();
    // $(".modal-body").animate({"opacity": 0.3}, 300);
    // $(".modal-preloader").show();
    $.post('cotizadorWs_new.php', {
        doAction: 11,
        cotID: $("#cotID").val(),
        cotRC: $(".poliza_opcion_container.poliza_seleccionada input[name='codigoRC']").val(),
        cotCasco: $(".poliza_opcion_container.poliza_seleccionada input[name='codigoCasco']").val(),
        cotPrima: $(".poliza_opcion_container.poliza_seleccionada input[name='prima']").val(),
        cotPremio: $(".poliza_opcion_container.poliza_seleccionada input[name='premio']").val(),
        cotIva: $(".poliza_opcion_container.poliza_seleccionada input[name='iva']").val(),
        cotSuma: $(".poliza_opcion_container.poliza_seleccionada input[name='sumaAsegurada']").val(),
        cotCuota: $(".poliza_opcion_container.poliza_seleccionada input[name='valorCuota']").val(),
    }, function (data) {

        if ($.trim(data) != "1") {
            $('.container_cargando2').css('display', 'none');
            alert('Ha ocurrido un error al intentar enviar la cotizaci\u00f3n.\nPor favor, intente nuevamente m\u00e1s tarde.');
            grecaptcha.reset();
            // $(".modal-body").animate({"opacity": 1}, 300);
            // $(".modal-preloader").hide();
            return false;
        }
        $.post('../../Ws/cotizacionMail.php', {
            doAction: 1,
            cliNombre: $("#cliNombre").val(),
            cliApellido: $("#cliApellido").val(),
            cliEmail: $("#cliEmail").val(),
            cliTel: $("#cliTel").val(),
            cliDominio: $("#cliDominio").val(),
            cliLocalidad: $("#cotLocalidad").val(),
            cotAnio: $("#cotAnio").val(),
            cotMarca: $("#cotMarca option:selected").text(),
            cotModelo: $("#cotModelo option:selected").text(),
            cotVersion: $("#cotVersion option:selected").text(),
            cotGnc: $('.checkbox_gnc.active').attr('data-choice'),
            cotGncCost: $("#cotGncCost").val(),
            cotAcc: $(".checkbox_accesorio.active").attr('data-choice'),
            cotAccCost: $("#cotAccCost").val(),
            cotAccDesc: $("#cotAccDesc").val(),
            cotCasco: $(".poliza_opcion_container.poliza_seleccionada input[name='descripcionCasco']").val(),
            cotSuma: $(".poliza_opcion_container.poliza_seleccionada input[name='sumaAsegurada']").val(),
            cotCuota: $(".poliza_opcion_container.poliza_seleccionada input[name='valorCuota']").val()
        }, function (data) {
            if (data == "1") {
                console.log('se envio correctamente');
                // alert('Se ha enviado la solicitud a nuestro departamento de ventas.\nNos contactaremos con usted a la brevedad.');
                $('#page_final').css('display', 'flex');
                $('#page_cuota').css('display', 'none');
                $('.nav_opcion_container').css('display', 'none');
                $('.container_cargando2').css('display', 'none');
            } else {
                $('.container_cargando2').css('display', 'none');
                alert('Ha ocurrido un error al intentar enviar la cotizaci\u00f3n.\nPor favor, intente nuevamente m\u00e1s tarde.');
                grecaptcha.reset();
            }
            // alert("La cotizaci&oacute;n ha sido solicitada correctamente. Un asesor de ventas lo contactar&aacute; a la brevedad.")
            // $(".modal-body").animate({"opacity": 1}, 300);
            // $(".modal-preloader").hide();
            // $('#myModal').modal('hide');
            // if($('#myModal').length == 0){
            //     var alertHtml = '<div class="alert alert-success" role="alert"><b>La cotizaci&oacute;n ha sido solicitada correctamente.</b> Un asesor de ventas lo contactar&aacute; a la brevedad.</div>';
            //     $("#resultsSelect").html(alertHtml);
            // }
        });
    });
}

function saveAPI() {

    //    // Guarda datos en itechnology
    $.ajax({
        url: 'cotizadorWs_new.php',
        type: 'post',
        data: {
            doAction: 99,
            cliNombre: $("#cliNombre").val(),
            cliApellido: $("#cliApellido").val(),
            cliEmail: $("#cliEmail").val()
        }
    });

    // Guarda datos en icomMarketing
    $.ajax({
        url: 'cotizadorWs_new.php',
        type: 'post',
        data: {
            doAction: 98,
            cliNombre: $("#cliNombre").val(),
            cliApellido: $("#cliApellido").val(),
            cliEmail: $("#cliEmail").val(),
            cliTel: $("#cliTel").val(),
            alianza: $("#alianza").val()
        },
        success: function (data) {
            facebookAPI();
        }
    });
}

var CaptchaCallback = function () {
    // grecaptcha.render('captcha1', {'sitekey' : '6LeYVzcUAAAAAHgt5d7-xJs-gR4jQQe5eTf9puLD','theme' : 'dark'});
    grecaptcha.render('captcha2', {
        'sitekey': '6LfcFSwUAAAAAE6ACw4WkUtj0y2xlYKhfxGkzULn'
    });
};