$('form').submit(function() {
	$.post(url + '/autentica.php', $(this).serializeArray(), function(result) {			
		if (result) {
			if (result.error) {
				alert(result.error);
			} else {
				console.log(result);
				sessionStorage.setItem('token', result.token);
				window.location.reload(true);
			}
		} else {
			// Nenhum resultado
			$('input').val(null);
			alert('USUÁRIO e SENHA não encontrados');
		}		
	});	
	return false;
});

$(".modal").on('hide.bs.modal', function () {
	window.location.reload(true);
});
