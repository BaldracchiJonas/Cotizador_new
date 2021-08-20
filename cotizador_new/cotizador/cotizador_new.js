// 2015-05-26 | Javier Puentes

jQuery.fn.forceNumeric = function ()
{
    return this.each(function ()
    {
        $(this).keydown(function (e)
        {
            var key = e.charCode || e.keyCode || 0;
            var shift = e.shiftKey;
            // Permite backspace, tab, delete, home, end, flechas, punto, numeros y numeros de teclado numerico UNICAMENTE
            return (!shift && (// sin la tecla shift presionada
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

    $("#marcaContent select").addClass('content-loading');
    $(".row[name^='step']:not([name=step1]), #submitBudget").hide();
    $("#cotGncCost, #cotAccCost, #manualTel, #manualAnio, #manualGncCost, #manualAccCost").forceNumeric();
    $('[data-toggle="tooltip"]').tooltip();
    // Autocomplete de cliente
    $("#cotLocalidad").autocomplete({
        serviceUrl: 'http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php',
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
    $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
        doAction: 1
    }, function (data) {
        // Verifica errores
        error = $(data).find("listError").text();
        if ($.trim(error) != "") {
            alert("En este momento el servidor de Rio Uruguay no esta respondiendo.\nPor favor, intente nuevamente mas tarde.");
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
        var carOption = '<select id="cotMarca" class="form-control" name="cotMarca"><option selected="selected" value="">SELECCIONAR</option>';
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

        if ($("#cotAnio").val() == "0") {
            if (confirm('Desea cotizar un auto con a\u00f1o anterior a los que figuran en el listado?')) {
                $("#requestForm").fadeOut(function () {
                    $("#olderForm, #submitManualBudget").fadeIn();
                });
            } else {
                $("#cotAnio option:first").attr("selected", true);
            }
            return false;
        }

        if ($("#cotMarca").val() != "" && $("#cotAnio").val() != "") {
            $(".row[name='step2']").slideDown();
            $(".row[name='step3'], .row[name='step4']").slideUp();
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

        $("#cotVersion").addClass('content-loading');
        $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
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
            $(rows).find("id").each(function (i, v) {
                modelId[i] = $(this).text();
            });
            $(rows).find("descripcion").each(function (i, v) {
                modelDesc[i] = $(this).text();
            });
            // Genera las opciones del select
            var modelOption = '<option selected="selected" value="">SELECCIONAR</option>';
            $(modelId).each(function (i, v) {
                modelOption += '<option value="' + modelId[i] + '">' + modelDesc[i] + '</option>';
            });
            // Reemplaza el HTML por el select generado
            $("#cotVersion").html(modelOption);
            $("#cotVersion").removeClass('content-loading');
            return false;
        });
    });
    // Change de la version
    $(document).on('change', '#cotVersion', function () {
        if ($("#cotVersion").val() != "") {
            $(".row[name='step3']").slideDown();
            $("#submitContinue").show();
        }
    });
    //Change de GNC
    $("#cotGnc").change(function () {
        if ($(this).val() == "SI") {
            $("#cotGncCost").removeAttr("disabled").focus();
        } else {
            $("#cotGncCost").attr("disabled", true).val('');
        }
    });
    //Change de Accesorios
    $("#cotAcc").change(function () {
        if ($(this).val() == "SI") {
            $("#cotAccCost, #cotAccDesc").removeAttr("disabled");
            $(".row[name='step4']").slideDown();
        } else {
            $("#cotAccCost, #cotAccDesc").attr("disabled", true).val('');
            $(".row[name='step4']").slideUp();
        }
    });
    // Fin del step1
    $("#submitContinue").click(function () {

        if(!validate1stStep()){
            return false;
        }

        $("#requestForm, #submitContinue").fadeOut(250, function () {
            $("#customerForm, #submitBudget").fadeIn(250);
        });
        $("#cliNombre").focus();
    });

    // Fin del step2
    $("#submitBudget").click(function () {

        if ($("#submitContinue").length == 0) {
            if(!validate1stStep()){return false;}
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

        if ($("#cliEmail").val() == "") {
            alert("Ingrese un email de contacto.");
            $("#cliEmail").focus();
            return false;
        }
		if ($("#cliTel").val() == "") {
            alert("Ingrese un teléfono de contacto.");
            $("#cliTel").focus();
            return false;
        }

        if ($("#submitContinue").length == 0) {
            if(!validateCaptcha()){return false;}
        }

        // Postea los datos.
        $(".modal-body").animate({"opacity": 0.3}, 300);
        $(".modal-preloader").show();
        $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
            idModeloVehiculo: $("#cotVersion").val(),
            anio: $("#cotAnio").val(),
            idGuarda: $("#idGuarda").val(),
            Gnc: $("#cotGnc").val(),
            ValorGnc: $("#cotGncCost").val(),
            ValorAccesorios: $("#cotAccCost").val(),
            doAction: 8
        }, function (data) {
            // Verifica errores
            error = $(data).find("listError").text();
            if ($.trim(error) != "") {
                alert($(data).find("descripcion").text());
                $(".modal-body").animate({"opacity": 1}, 300);
                $(".modal-preloader").hide();
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
                $(".modal-body").animate({"opacity": 1}, 300);
                $(".modal-preloader").hide();
                return false;
            }

            $(rows).find('codigoRC').parent().each(function (i, v) {

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
                var valorCuota = (parseFloat($(this).find('premio').text())) / 6;
                if (codigoCasco.indexOf('C-20') != -1 || codigoCasco.indexOf('C-80') != -1 || codigoCasco.indexOf('S') != -1 || codigoCasco.indexOf('T') != -1) {

                    if (codigoCasco.indexOf('C-') != -1) {
                        nombreCasco = 'Terceros';
                    } else if (codigoCasco.indexOf('S') != -1) {
                        nombreCasco = 'Terceros completos';
                    } else if (codigoCasco.indexOf('T') != -1) {
                        nombreCasco = 'Todo Riesgo';
                    }

                    contentWidthMultiplier++;
                    policyContent += '<div class="policyContent">';
                    policyContent += '<h5>Opci&oacute;n #' + contentWidthMultiplier + '</h5>';
                    policyContent += '<h4>' + nombreCasco + ' <br /><small>' + descripcionCasco + ' + Resp. Civ. ' + descripcionRC + '</small></h4>';
                    policyContent += '<h4 style="font-size:smaller">Incluye recuperaci&oacute;n vehicular</h4>';
                    policyContent += '<h3>$' + Math.ceil(valorCuota) + '<br /><small>Finales X mes + IVA</small></h3>';
                    policyContent += '<input type="hidden" name="codigoRC" id="codigoRC" value="' + codigoRC + '" />';
                    policyContent += '<input type="hidden" name="descripcionRC" value="' + descripcionRC + '" />';
                    policyContent += '<input type="hidden" name="detalleCoberturaRC" value="' + detalleCoberturaRC + '" />';
                    policyContent += '<input type="hidden" name="codigoCasco" value="' + codigoCasco + '" />';
                    policyContent += '<input type="hidden" name="descripcionCasco" value="' + descripcionCasco + '" />';
                    policyContent += '<input type="hidden" name="detalleCoberturaCasco" value="' + detalleCoberturaCasco + '" />';
                    policyContent += '<input type="hidden" name="prima" value="' + prima + '" />';
                    policyContent += '<input type="hidden" name="premio" value="' + premio + '" />';
                    policyContent += '<input type="hidden" name="iva" value="' + iva + '" />';
                    policyContent += '<input type="hidden" name="sumaAsegurada" value="' + sumaAsegurada + '" />';
                    policyContent += '<input type="hidden" name="valorCuota" value="' + Math.ceil(valorCuota) + '" />';
                    policyContent += '</div>';
                }
                if (contentWidthMultiplier == 3) {
                    return false;
                }

            });
            // Reemplaza el HTML por el generado
            $("#scrollContent").html(policyContent);
            var contentWidth = contentWidthMultiplier * 195;
            $("#scrollContent").css('width', contentWidth + 'px');
            $(".modal-body").animate({"opacity": 1}, 300);
            $(".modal-preloader").hide();
            $("#customerForm, #submitBudget, #requestForm").hide();
            $("#resultsSelect, #submitAquireBudget").show();
            $(".policyContent:first").click();
            saveDataStep2();
            saveAPI();
        });
    });

    $(document).on('click', '.policyContent', function () {
        var elem = $(this);
        $(this).addClass('active').animate({'zoom': 1.2}, 300)
                .siblings().removeClass('active').animate({"zoom": 1}, 300)
                .find("h5").animate({"background-color": "#57585B"}, 300);
        $(this).find("h5").animate({"background-color": "#106B8D"}, 300);
        $("#cotSpecs").fadeOut(function () {
            var specsText = '<b>Suma Asegurada:</b> $' + $(elem).find('[name=sumaAsegurada]').val();
            specsText += '<br /><br /><b>Detalles del veh&iacute;culo:</b> A&ntilde;o: ' + $("#cotAnio option:selected").text();
            specsText += '/ Marca: ' + $("#cotMarca option:selected").text() + ' / Modelo: ' + $("#cotVersion option:selected").text();
            specsText += '/ GNC: ' + $("#cotGnc").val() + ' / Accesorios: ' + $("#cotAcc").val();
            specsText += '<br /><br /><b>Detalles de la p&oacute;liza:</b> ' + $(elem).find('[name=detalleCoberturaCasco]').val();
            specsText += '<br /><br /><b>Detalles de Responsabilidad Civil:</b> ' + $(elem).find('[name=detalleCoberturaRC]').val();
            $("#cotSpecs").html(specsText).fadeIn();
        });
    });

    // Enviar datos
    $("#submitAquireBudget").click(function () {
        saveDataTotal();
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

        $(".modal-body").animate({"opacity": 0.3}, 300);
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
            $(".modal-body").animate({"opacity": 1}, 300);
            $(".modal-preloader").hide();
            $('#myModal').modal('hide');
        });
    });

});
// Funcion para cargar los modelos
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
    $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
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

    if ($("#cotGnc").val() == "SI" && $("#cotGncCost").val() == "") {
        alert("Ingrese un valor para el equipo de GNC.");
        $("#cotGncCost").focus();
        return false;
    }

    if ($("#cotAcc").val() == "SI" && $("#cotAccCost").val() == "") {
        alert("Ingrese un valor para los accesorios.");
        $("#cotAccCost").focus();
        return false;
    }

    if ($("#cotAcc").val() == "SI" && $("#cotAccDesc").val() == "") {
        alert("Cu\u00e1les son los accesorios?");
        $("#cotAccDesc").focus();
        return false;
    }

    return true;

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
        return false;
    }

    var isValidCaptcha = 0;

    $.ajax({
        url: 'captcha.php',
        method: 'post',
        data: {
            //securityCode: $("#securityCode").val(),
            g_recaptcha_response:  grecaptcha.getResponse(),
            //recaptcha_challenge_field: $("#recaptcha_challenge_field").val()
        },
        async: false,
        success: function (data) {
            console.log(data);
            if (data != "1") {
                alert('El código de seguridad no es correcto. Por favor, intente nuevamente.');
                $("#securityCode").focus();
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
    $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
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
    $("#cotSpecs").slideUp();
    $(".modal-body").animate({"opacity": 0.3}, 300);
    $(".modal-preloader").show();
    $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php', {
        doAction: 11,
        cotID: $("#cotID").val(),
        cotRC: $(".policyContent.active input[name='codigoRC']").val(),
        cotCasco: $(".policyContent.active input[name='codigoCasco']").val(),
        cotPrima: $(".policyContent.active input[name='prima']").val(),
        cotPremio: $(".policyContent.active input[name='premio']").val(),
        cotIva: $(".policyContent.active input[name='iva']").val(),
        cotSuma: $(".policyContent.active input[name='sumaAsegurada']").val(),
        cotCuota: $(".policyContent.active input[name='valorCuota']").val(),
    }, function (data) {
        if ($.trim(data) != "1") {
            alert('Ha ocurrido un error al intentar enviar la cotizaci\u00f3n.\nPor favor, intente nuevamente m\u00e1s tarde.');
            grecaptcha.reset();
            $(".modal-body").animate({"opacity": 1}, 300);
            $(".modal-preloader").hide();
            return false;
        }
        $.post('http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionMail.php', {
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
            cotGnc: $("#cotGnc").val(),
            cotGncCost: $("#cotGncCost").val(),
            cotAcc: $("#cotAcc").val(),
            cotAccCost: $("#cotAccCost").val(),
            cotAccDesc: $("#cotAccDesc").val(),
            cotCasco: $(".policyContent.active input[name='descripcionCasco']").val(),
            cotSuma: $(".policyContent.active input[name='sumaAsegurada']").val(),
            cotCuota: $(".policyContent.active input[name='valorCuota']").val()
        }, function (data) {
            if (data == "1") {
                alert('Se ha enviado la solicitud a nuestro departamento de ventas.\nNos contactaremos con usted a la brevedad.');
            } else {
                alert('Ha ocurrido un error al intentar enviar la cotizaci\u00f3n.\nPor favor, intente nuevamente m\u00e1s tarde.');
                grecaptcha.reset();
            }
            $(".modal-body").animate({"opacity": 1}, 300);
            $(".modal-preloader").hide();
            $('#myModal').modal('hide');
            if($('#myModal').length == 0){
                var alertHtml = '<div class="alert alert-success" role="alert"><b>La cotizaci&oacute;n ha sido solicitada correctamente.</b> Un asesor de ventas lo contactar&aacute; a la brevedad.</div>';
                $("#resultsSelect").html(alertHtml);
            }
        });
    });
}

function saveAPI(){

//    // Guarda datos en itechnology
    $.ajax({
        url: 'http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php',
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
        url: 'http://intranet.stopcar.com.ar/Alaweb3/WebServiceRus/cotizacionWs.php',
        type: 'post',
        data: {
            doAction: 98,
            cliNombre: $("#cliNombre").val(),
            cliApellido: $("#cliApellido").val(),
            cliEmail: $("#cliEmail").val(),
            cliTel: $("#cliTel").val(),
            alianza: $("#alianza").val()
        },success: function(data){
            facebookAPI();
        }
    });
}