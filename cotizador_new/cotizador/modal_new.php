<!-- Modal Cotizacion -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #57585B; border-bottom: 4px solid #F3DF0B; border-radius:5px 5px 0px 0px;">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" style="color: #fff">Cotice su veh&iacute;culo</h4>
                </div>
                <div class="modal-body cotizacionModal" id="requestForm">
                    <div class="row" name="step1">
                        <div class="col-xs-12">
                            <label class="control-label" for="">Localidad <small>(Escriba al menos 3 caracteres y aguarde resultados)</small></label>
                            <input class="form-control" type="text" id="cotLocalidad" name="cotLocalidad" placeholder="Escriba la localidad o cod postal" />
                            <input type="hidden" id="idGuarda" name="idGuarda" />
                        </div>
                    </div>
                    <div class="row" name="step1">
                        <div class="col-xs-4">
                            <label class="control-label" for="">A&ntilde;o</label>
                            <select class="form-control" id="cotAnio" name="cotAnio">
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
                        <div class="col-xs-8">
                            <label class="control-label" for="">Marca</label>
                            <div id="marcaContent">
                                <select class="form-control">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row" name="step2">
                        <div class="col-xs-5">
                            <label class="control-label" for="">Modelo</label>
                            <select class="form-control" name="cotModelo" id="cotModelo">
                            </select>
                        </div>
                        <div class="col-xs-7">
                            <label class="control-label" for="">Versi&oacute;n</label>
                            <select class="form-control" name="cotVersion" id="cotVersion">
                            </select>
                        </div>
                    </div>
                    <div class="row" name="step3">
                        <div class="col-xs-2">
                            <label class="control-label" for="">GNC</label>
                            <select class="form-control" name="cotGnc" id="cotGnc">
                                <option value="NO">NO</option>
                                <option value="SI">SI</option>
                            </select>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Costo del equipo</label>
                            <input type="text" class="form-control" maxlength="5" name="cotGncCost" id="cotGncCost" disabled />
                        </div>
                        <div class="col-xs-2">
                            <label class="control-label" for="">Accesorios</label>
                            <select class="form-control" name="cotAcc" id="cotAcc">
                                <option value="NO">NO</option>
                                <option value="SI">SI</option>
                            </select>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Costo de los accesorios</label>
                            <input type="text" class="form-control" maxlength="5" name="cotAccCost" id="cotAccCost" disabled />
                        </div>
                    </div>
                    <div class="row" name="step4">
                        <div class="col-xs-12">
                            <label class="control-label" for="">Descripci&oacute;n de los accesorios</label>
                            <textarea class="form-control" name="cotAccDesc" id="cotAccDesc" style="resize: none;"></textarea>
                        </div>
                    </div>                    
                </div>
                <div class="modal-body cotizacionModal" id="customerForm" style="display:none;">
                    <img alt="Cargando..." class="modal-preloader" src="img/preloader.gif" />
                    <div class="row">
                        <div class="col-xs-6">
                            <label class="control-label" for="">Nombre</label>
                            <input class="form-control" type="text" id="cliNombre" name="cliNombre" maxlength="100" />
                        </div>
                        <div class="col-xs-6">
                            <label class="control-label" for="">Apellido</label>
                            <input class="form-control" type="text" id="cliApellido" name="cliApellido" maxlength="100" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-5">
                            <label class="control-label" for="">Email</label>
                            <div class="input-group">
                                <span class="input-group-addon">@</span>
                                <input type="text" class="form-control" id="cliEmail" name="cliEmail" maxlength="100" />
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Tel&eacute;fono (opcional)</label>
                            <div class="input-group">
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-phone-alt" aria-hidden="true"></span>
                                </span>
                                <input type="text" class="form-control" id="cliTel" name="cliTel" maxlength="50" />
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <label class="control-label" for="">Dominio (opcional)</label>
                            <input type="text" class="form-control" id="cliDominio" name="cliDominio" maxlength="10" />
                        </div>
                    </div>
                    <div class="row" style="display: inline!important;">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <div id="captcha2"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" id="olderForm" style="display:none;">
                    <img alt="Cargando..." class="modal-preloader" src="img/preloader.gif" />
                    <div class="row">
                        <div class="col-xs-6">
                            <label class="control-label" for="">Nombre</label>
                            <input class="form-control" type="text" id="manualNombre" name="manualNombre" maxlength="100" />
                        </div>
                        <div class="col-xs-6">
                            <label class="control-label" for="">Apellido</label>
                            <input class="form-control" type="text" id="manualApellido" name="manualApellido" maxlength="100" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-5">
                            <label class="control-label" for="">Email</label>
                            <div class="input-group">
                                <span class="input-group-addon">@</span>
                                <input type="text" class="form-control" id="manualEmail" name="manualEmail" maxlength="100" />
                            </div>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Tel&eacute;fono (opcional)</label>
                            <div class="input-group">
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-phone-alt" aria-hidden="true"></span>
                                </span>
                                <input type="text" class="form-control" id="manualTel" name="manualTel" maxlength="50" />
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <label class="control-label" for="">Dominio (opcional)</label>
                            <input type="text" class="form-control" id="manualDominio" name="manualDominio" maxlength="10" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-5">
                            <label class="control-label" for="">Localidad</label>
                            <input type="text" class="form-control" id="manualLocalidad" name="manualLocalidad" maxlength="100" />
                        </div>
                        <div class="col-xs-2">
                            <label class="control-label" for="">A&ntilde;o</label>
                            <input type="text" class="form-control" id="manualAnio" name="manualAnio" maxlength="10" />
                        </div>
                        <div class="col-xs-5">
                            <label class="control-label" for="">Marca</label>
                            <input type="text" class="form-control" id="manualMarca" name="manualMarca" maxlength="50" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <label class="control-label" for="">Modelo</label>
                            <input type="text" class="form-control" id="manualModelo" name="manualModelo" maxlength="50" />
                        </div>
                        <div class="col-xs-6">
                            <label class="control-label" for="">Versi&oacute;n</label>
                            <input type="text" class="form-control" id="manualVersion" name="manualVersion" maxlength="50" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-2">
                            <label class="control-label" for="">GNC</label>
                            <select class="form-control" name="manualGnc" id="manualGnc">
                                <option value="NO">NO</option>
                                <option value="SI">SI</option>
                            </select>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Costo del equipo</label>
                            <input type="text" class="form-control" maxlength="5" name="manualGncCost" id="manualGncCost" />
                        </div>
                        <div class="col-xs-2">
                            <label class="control-label" for="">Accesorios</label>
                            <select class="form-control" name="manualAcc" id="manualAcc">
                                <option value="NO">NO</option>
                                <option value="SI">SI</option>
                            </select>
                        </div>
                        <div class="col-xs-4">
                            <label class="control-label" for="">Costo de los accesorios</label>
                            <input type="text" class="form-control" maxlength="5" name="manualAccCost" id="manualAccCost" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <label class="control-label" for="">Descripci&oacute;n de los accesorios</label>
                            <textarea class="form-control" name="manualAccDesc" id="manualAccDesc" style="resize: none;"></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4 col-md-offset-3">
                            <div class="g-recaptcha" data-sitekey="6LdomikUAAAAAMIh-1T5nopwlvvCmG4AKXL-P0Gc"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" id="resultsSelect" style="display:none;">
                    <img alt="Cargando..." class="modal-preloader" src="img/preloader.gif" />
                    <div class="row">
                        <div class="col-md-12">
                            <input type="hidden" name="cotID" id="cotID" value="" />
                            <div id="scrollContent">
                            </div>
                        </div>
                        <div class="col-md-12">
                            <h6 style="color:#333;">Especificaciones:</h6>
                            <div id="cotSpecs">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btnCotizacion" id="submitContinue" style="display:none;">Continuar</button>
                    <button type="button" class="btn btn-default" id="backToContinue" style="display:none;">Volver</button>
                    <button type="button" class="btn btnCotizacion" id="submitBudget" style="display:none;">Solicitar cotizaci&oacute;n</button>
                    <button type="button" class="btn btnCotizacion" id="submitManualBudget" style="display:none;">Solicitar cotizaci&oacute;n</button>
                    <button type="button" class="btn btnCotizacion" id="submitAquireBudget" style="display:none;"
                            data-toggle="tooltip" data-placement="top" title="Esta acci&oacute;n no tiene obligaci&oacute;n de compra. Un ejecutivo de cuentas se contactar&aacute; con usted.">Confirmar</button>
                </div>
            </div>
        </div>
    </div>