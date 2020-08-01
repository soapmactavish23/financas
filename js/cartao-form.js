$('.modal-title').text('Novo Cartão de Crédito');
if(data){
    $('.modal-title').text(data.instituicao);
    $('input[name="idcartao"]').val(data.idcartao);
    $('input[name="nome_cartao"]').val(data.nome_cartao);
    $('input[name="limite"]').val(data.limite);
}

//Select Picker para Instituição
var selectInstituicao = $('select[name="instituicao"]');
$.ajax({
	type: 'POST',
	url: url+ "/api.php",
	data: {classe: "cartao", metodo: "obterInstituicoes", token: token},
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


//Select Vencimento e Fechamento
var selectVencimento = $('select[name="vencimento"]');
var selectFechamento = $('select[name="fechamento"]');
for(i = 1; i < 32; i++){
    selectVencimento.append( $('<option>', {value: i, text: i}) );
    selectFechamento.append( $('<option>', {value: i, text: i}) );
}
selectVencimento.selectpicker();
selectFechamento.selectpicker();

$('form').submit(function(){
	var data = $(this).serializeArray();
	data.push({name: 'classe', value: 'cartao'});
	data.push({name: 'metodo', value: 'salvar'});
	data.push({name: 'token', value: token});

	$.post( url + '/api.php', data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			// $('input[name="idcartao"]').val(result.idcartao);
			// $('#btn-excluir').show();
			alert('Cartão ID '+result.idcartao+' gravado!');
			datatable.ajax.reload(null, false);
			$('.modal').modal('hide');
		}
	});	
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var data=[];
		data.push({name: 'classe', value: 'cartao'});
		data.push({name: 'metodo', value: 'excluir'});
		data.push({name: 'token', value: token});
		data.push({name: 'idcartao', value: $('input[name="idcartao"]').val()});

		$.post( url + '/api.php', data, function (result) {
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="idcartao"]').val(null);
				$('#btn-excluir').hide();
				alert('ID '+result.idcartao+' excluído!');
				$('.modal').hide()
				datatable.ajax.reload(null, false);
				$('.modal').modal('hide');
			}
		});	
	}
});