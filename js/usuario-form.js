if ( data ) {
	$('input[name="id_usuario"]').val(data.id_usuario);
	$('input[name="nome"]').val(data.nome);
	$('input[name="email"]').val(data.email);
}			

var sel_permissao = $('select[name="permissao[]"]');
$.each(menu.responseJSON.items, function(i, item) {
	if (item.subitems) {
		var optgroup = "<optgroup label='"+item.label+"'>";
		$.each(item.subitems, function(i, subitem) {
			//select.append( $('<option>', {value: subitem.id, text: item.label+': '+subitem.label}) );
			optgroup += "<option value='"+subitem.id+"'>"+subitem.label+"</option>";
		});
		optgroup += "</optgroup>";
		sel_permissao.append(optgroup);
	} else {
		sel_permissao.append( $('<option>', {value: item.id, text: item.label}) );
	}
});			
if ( data ) sel_permissao.val(data.permissao.split(','));
sel_permissao.selectpicker();

if ( data ) {
	if (data.ativado=='S') $('#ativado').prop('checked',true);
} else {
	// oculta o botao excluir e renova senha
	//$('#btn-excluir').hide();
	$('#btn-renovar-senha').hide();
}

$('form').submit(function(){
	var data = $(this).serializeArray();
	data.push({name: 'classe', value: 'usuario'});
	data.push({name: 'metodo', value: 'salvar'});
	data.push({name: 'token', value: token});

	$.post( url + '/api.php', data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			$('input[name="id_usuario"]').val(result.id_usuario);
			$('#btn-renovar-senha').show();
			$('#btn-excluir').show();
			alert('Usuário ID '+result.id_usuario+' gravado!');
			datatable.ajax.reload(null, false);
		}
	});	
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var data=[];
		data.push({name: 'classe', value: 'usuario'});
		data.push({name: 'metodo', value: 'excluir'});
		data.push({name: 'token', value: token});
		data.push({name: 'id_usuario', value: $('input[name="id_usuario"]').val()});

		$.post( url + '/api.php', data, function (result) {
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="id_usuario"]').val(null);
				$('#btn-renovar-senha').hide();
				$('#btn-excluir').hide();

				alert('ID '+result.id_usuario+' excluído!');
				datatable.ajax.reload(null, false);
			}
		});	
	}
});

$('#btn-renovar-senha').click(function(){
	var data=[];
	data.push({name: 'classe', value: 'usuario'});
	data.push({name: 'metodo', value: 'renovarSenha'});
	data.push({name: 'token', value: token});
	data.push({name: 'id_usuario', value: $('input[name="id_usuario"]').val()});
	data.push({name: 'email', value: $('input[name="email"]').val()});
	$.post( url + "/api.php", data, function (result) {
		if ( result.error ) {
			alert(result.error);
		} else {
			alert('Senha do usuário ID '+result.id_usuario+' renovada!');
			datatable.ajax.reload(null, false);
		}
	});
});