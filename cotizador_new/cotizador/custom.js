// Cambiar pantalla
// $('#opcion_cuota').on('click', function () {
//     $('.select').removeClass('select');
//     $(this).addClass('select');
//     $('#page_datos').css('display', 'none');
//     $('#page_cotiza').css('display', 'none');
//     $('#page_cuota').css('display', 'block');
//     $('#page_final').css('display', 'none');
// });
// $('#opcion_datos').on('click', function () {
//     $('.select').removeClass('select');
//     $(this).addClass('select');
//     $('#page_datos').css('display', 'block');
//     $('#page_cotiza').css('display', 'none');
//     $('#page_cuota').css('display', 'none');
//     $('#page_final').css('display', 'none');
// });
// $('#opcion_cotiza').on('click', function () {
//     $('.select').removeClass('select');
//     $(this).addClass('select');
//     $('#page_datos').css('display', 'none');
//     $('#page_cotiza').css('display', 'block');
//     $('#page_cuota').css('display', 'none');
//     $('#page_final').css('display', 'none');
// });
// $('#button_final').on('click', function () {
//     $('#page_final').css('display', 'flex');
//     $('#page_cotiza').css('display', 'none');
//     $('.nav_opcion_container').css('display', 'none');
// });

// modificar pantalla final
$('#datos_vehiculo').on('click', function () {
    $('#page_datos').css('display', 'block');
    $('#page_cotiza').css('display', 'none');
    grecaptcha.reset();
});

$('#btn_modificar_datos_personales').on('click', function () {
    $('#page_datos').css('display', 'block');
    $('#page_cotiza').css('display', 'none');
    grecaptcha.reset();
});

$('#datos_poliza').on('click', function () {
    $('#page_cuota').css('display', 'block');
    $('#page_cotiza').css('display', 'none');
    grecaptcha.reset();
});

// Checkbox gnc
var gnc_choice = $('.checkbox_gnc.active').attr('data-choice');
$('.checkbox_gnc').on('click', function () {
    $('.checkbox_gnc.active').removeClass('active');
    $(this).addClass('active');
    gnc_choice = $(this).attr('data-choice');
});

// Checkbox accesorio
var accesorio_choice = $('.checkbox_accesorio.active').attr('data-choice');
$('.checkbox_accesorio').on('click', function () {
    $('.checkbox_accesorio.active').removeClass('active');
    $(this).addClass('active');
    accesorio_choice = $(this).attr('data-choice');
});

// Checkbox poliza


$(document).on('click', '.poliza_opcion_container', function () {
    if ($(window).width() < 940) {
        $('.poliza_opcion_container.poliza_seleccionada').removeClass('poliza_seleccionada');
        $('.ic_checkbox').removeClass('ic_checkbox').addClass('ic_box');
        $(this).find('.checked i').removeClass('ic_box').addClass('ic_checkbox');
        $(this).addClass('poliza_seleccionada');
    } else {
        $('.poliza_opcion_container.poliza_seleccionada').removeClass('poliza_seleccionada');
        $('.ic_checkbox').removeClass('ic_checkbox').addClass('ic_box');
        $(this).find('.checked i').removeClass('ic_box').addClass('ic_checkbox');
        $(this).addClass('poliza_seleccionada');
    }
});

$(document).on('click', '.poliza_informacion_container', function () {
    if ($(window).width() > 940) {
        $('.poliza_descripcion_container').css('display', 'block');
    }
});

// ver mas opciones poliza

$('.container_btn_ver_mas').on('click', function () {
    if ($(this).find('.btn_ver_mas').val() == 'Ver más...') {
        $(this).find('.btn_ver_mas').val('Ocultar');
        $(this).next('.poliza_descripcion_container').css('display', 'block');
    } else {
        $(this).find('.btn_ver_mas').val('Ver más...');
        $(this).next('.poliza_descripcion_container').css('display', 'none');
    }
});
