$('.modal-title').text('Nova Tramitação');
$('#btn-excluir').hide();
$('#form-conta').hide();
$('#form-cartao').hide();
if(data){
    $('.modal-title').text('Tramitação #' + data.idtramitacao);
    $('input[name="idtramitacao"]').val(data.idtramitacao);
    $('input[name="descricao"]').val(data.descricao);
    $('input[name="valor"]').val(data.valor);
    $('input[name="data"]').val(data.data);
    $('#btn-excluir').show();
}

//Conta ou cartao
$('input[id="radio-conta"]').click(function(){
    $('#form-conta').show();
	$('#form-cartao').hide();
	$('#idcartao').val(null);
	
});
$('input[id="radio-cartao"]').click(function(){
    $('#form-conta').hide();
	$('#form-cartao').show();
	$('#idconta').val(null);
});

//Select Picker para conta
var selectConta = $('select[name="idconta"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "conta", metodo: "obterConta", token: token},
	success: function(result) {	
        if ( ! result.data ) result.data = []; 
		$.each( result.data, function(index, element) {
			selectConta.append( $('<option>', {value: element.idconta, text: element.conta}) );
		});

		if (data) selectConta.val(data.idconta);
		else selectConta.val(null);	

		selectConta.selectpicker();				
	}
});

//Select Picker para cartao
var selectCartao = $('select[name="idcartao"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "cartao", metodo: "obterCartao", token: token},
	success: function(result) {	
        if ( ! result.data ) result.data = []; 
		$.each( result.data, function(index, element) {
			selectCartao.append( $('<option>', {value: element.idcartao, text: element.cartao}) );
		});

		if (data) selectCartao.val(data.idcartao);
		else selectCartao.val(null);	

		selectCartao.selectpicker();				
	}
});

//Select Picker para categoria
var selectCategoria = $('select[name="categoria"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "tramitacao", metodo: "obterCategoria", token: token},
	success: function(result) {	
        if ( ! result.data ) result.data = []; 
        selectCategoria.append( $('<option>', {text: '-- Nova Categoria --'}) );
		$.each( result.data, function(index, element) {
			selectCategoria.append( $('<option>', {value: element.categoria, text: element.categoria}) );
		});

		if (data) selectCategoria.val(data.categoria);
		else selectCategoria.val(null);	

		selectCategoria.selectpicker();				
	}
});

$('#categoria').change( function() {	
	if ($(this).val() == '-- Nova Categoria --') {
		$('#div-categoria').html("<input class='form-control' type='text' id='categoria' name='categoria' placeholder='Digite a nova categoria' required>");
		$('#categoria').focus();		
	}
});

$('form').submit(function(){
	var data = $(this).serializeArray();
	data.push({name: 'classe', value: 'tramitacao'});
	data.push({name: 'metodo', value: 'salvar'});
	data.push({name: 'token', value: token});

	$.post( url + '/api.php', data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			$('input[name="idtramitacao"]').val(result.idtramitacao);
			$('#btn-excluir').show();
			alert('Tramitação ID '+result.idtramitacao+' gravada!');
			datatable.ajax.reload(null, false);
		}
	});	
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var data=[];
		data.push({name: 'classe', value: 'tramitacao'});
		data.push({name: 'metodo', value: 'excluir'});
		data.push({name: 'token', value: token});
		data.push(
			{
				name: 'idtramitacao', value: $('input[name="idtramitacao"]').val(),
				name: 'idconta', value: $('select[name="idconta"]').val(),
				name: 'tipo_tramitacao', value: $('select[name="tipo_tramitacao"]').val(),
				name: 'valor', value: $('input[name="valor"]').val()
			}
		);

		$.post( url + '/api.php', data, function (result) {
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="idtramitacao"]').val(null);
				$('#btn-excluir').hide();

				alert('ID '+result.idtramitacao+' excluída!');
				datatable.ajax.reload(null, false);
			}
		});	
	}
});