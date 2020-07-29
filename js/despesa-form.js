$('.modal-title').text("Nova Despesa");
if ( data ) {
    $('.modal-title').text("Despesa #"+data.iddespesa);
	$('input[name="iddespesa"]').val(data.iddespesa);
	$('input[name="despesa"]').val(data.despesa);
}			

if ( data ) sel_permissao.val(data.permissao.split(','));
sel_permissao.selectpicker();

if ( data ) {
	if (data.tipo_despesa=='T') $('tipo_despesa').prop('checked',true);
} else {
	$('#btn-excluir').hide();
}

$('form').submit(function(){
	var data = $(this).serializeArray();
	data.push({name: 'classe', value: 'despesa'});
	data.push({name: 'metodo', value: 'salvar'});
	data.push({name: 'token', value: token});

	$.post( url + '/api.php', data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			$('input[name="iddespesa"]').val(result.id_usuario);
			$('#btn-excluir').show();
			alert('Despesa ID '+result.iddespesa+' gravado!');
			datatable.ajax.reload(null, false);
		}
	});	
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var data=[];
		data.push({name: 'classe', value: 'despesa'});
		data.push({name: 'metodo', value: 'excluir'});
		data.push({name: 'token', value: token});
		data.push({name: 'iddespesa', value: $('input[name="iddespesa"]').val()});

		$.post( url + '/api.php', data, function (result) {
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="iddespesa"]').val(null);
				$('#btn-excluir').hide();

				alert('ID '+result.iddespesa+' excluído!');
				datatable.ajax.reload(null, false);
			}
		});	
	}
});