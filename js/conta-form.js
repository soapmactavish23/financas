$('.modal-title').text('Nova Conta');
$('#btn-excluir').hide();
//Listar indicadores
if(data){ 
    $('.modal-title').text(data.nome_conta);
	$('input[name="idconta"]').val(data.idconta);
    $('input[name="nome_conta"]').val(data.nome_conta);
	$('input[name="saldo"]').val(data.saldo);
	$('#btn-excluir').show();
}

//Select Picker para Instituição
var selectInstituicao = $('select[name="instituicao"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "conta", metodo: "obterInstituicoes", token: token},
	success: function(result) {	
        if ( ! result.data ) result.data = []; 
        selectInstituicao.append( $('<option>', {text: '-- Nova Instituição --'}) );
		$.each( result.data, function(index, element) {
			selectInstituicao.append( $('<option>', {value: element.instituicao, text: element.instituicao}) );
		});

		if (data) selectInstituicao.val(data.instituicao);
		else selectInstituicao.val(null);	

		selectInstituicao.selectpicker();				
	}
});

$('#instituicao').change( function() {	
	if ($(this).val() == '-- Nova Instituição --') {
		$('#div-instituicao').html("<input class='form-control' type='text' id='instituicao' name='instituicao' placeholder='Digite a nova instituição' required>");
		$('#instituicao').focus();		
	}
});

//Select Picker para Tipo de Conta
var selectTipoConta = $('select[name="tipo_conta"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "conta", metodo: "obterTiposDeContas", token: token},
	success: function(result) {	
        if ( ! result.data ) result.data = []; 
        selectTipoConta.append( $('<option>', {text: '-- Novo Tipo de Conta --'}) );
		$.each( result.data, function(index, element) {
			selectTipoConta.append( $('<option>', {value: element.tipo_conta, text: element.tipo_conta}) );
		});

		if (data) selectTipoConta.val(data.tipo_conta);
		else selectTipoConta.val(null);	

		selectTipoConta.selectpicker();				
	}
});

$('#tipo_conta').change( function() {	
	if ($(this).val() == '-- Novo Tipo de Conta --') {
		$('#div-tipo_conta').html("<input class='form-control' type='text' id='tipo_conta' name='tipo_conta' placeholder='Digite um novo tipo de conta' required>");
		$('#tipo_conta').focus();		
	}
});

$('form').submit(function(){
	var data = $(this).serializeArray();
	data.push({name: 'classe', value: 'conta'});
	data.push({name: 'metodo', value: 'salvar'});
	data.push({name: 'token', value: token});

	$.post( url + '/api.php', data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			$('input[name="idconta"]').val(result.idconta);
			$('#btn-excluir').show();
			alert('Conta ID '+result.idconta+' gravada!');
			datatable.ajax.reload(null, false);
			$('.modal').modal('hide');
		}
	});	
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var data=[];
		data.push({name: 'classe', value: 'conta'});
		data.push({name: 'metodo', value: 'excluir'});
		data.push({name: 'token', value: token});
		data.push({name: 'idconta', value: $('input[name="idconta"]').val()});

		$.post( url + '/api.php', data, function (result) {
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="idconta"]').val(null);
				$('#btn-excluir').hide();
				alert('ID '+result.idconta+' excluída!');
				datatable.ajax.reload(null, false);
				$('.modal').modal('hide');
			}
		});	
	}
});