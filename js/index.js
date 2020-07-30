var url = window.location.origin + "/api";

if ( sessionStorage.getItem('token') ) {
	var token = sessionStorage.getItem('token');
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jwt = JSON.parse(window.atob(base64));
	var user = JSON.parse(jwt.data);
	var permissions = user.permissao.split(',');
	var menu = $.ajax({
		url: 'json/menu.json', 
		success: function( menu ) {
			var liMenu = '';
			$.each(menu.items, function(i, item) {
				if (item.subitems) {
					var liSubMenu = '';
					$.each(item.subitems, function(i, subitem) {
						if ( permissions.indexOf( subitem.id ) > -1 && subitem.visible != false) {
							liSubMenu += '<li id="'+subitem.id+'"><a class="dropdown-item" href="#'+subitem.id+'">'+subitem.label+'</a></li>';
						}
					});
					if (liSubMenu) liMenu += '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+item.label+'</a><ul class="dropdown-menu">'+liSubMenu+'</ul></li>';
				} else {
					if ( permissions.indexOf( item.id ) > -1 ) {
						liMenu += '<li class="nav-item" id="'+item.id+'"><a class="nav-link" href="#'+item.id+'">'+item.label+'</a></li>';
					}
				}
			});
			liMenu += '<li class="nav-item" id="out"><a class="nav-link" href="#out">Sair</a></li>';
			
			$('title').html(menu.title);
			$('.navbar-brand').html(menu.title);
			$('#menu').html(liMenu);
			$('#user').html('<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Olá '+ user.nome +'</a><ul class="dropdown-menu"><li id="mudasenha"><a class="dropdown-item" href="#mudasenha">Mudar senha</a></li><li id="out"><a class="dropdown-item" href="#out">Sair</a></li></ul></li>');

			//Carregar o Dashboard
			$('.starter').load('partial/dashboard.html');

		}
	});
	
	var loop;
	$('.navbar-nav').on('click', 'li', function() {
		$('.navbar-nav li').removeClass("active");
		$(this).addClass("active");
		id = $(this).attr('id');
		if ( id == 'out' ) {
			sessionStorage.removeItem('token');
			location.reload(true);			
		}
		if (typeof id !== 'undefined' ) {
			$('main').load('partial/'+id+'.html');
			clearInterval(loop);
		}
		$('.navbar-collapse').collapse('hide');	
	});
	
	$.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) { 
		var error = message.split(" - ", 2);
		console.log ( error[1] );
		if ( error[1] == 'Token expirado') {
			sessionStorage.removeItem('token');
			location.reload(true);			
		}
	}

	//Descontar todas as tramitacoes pendentes
	$.ajax({
		url: url + '/api.php',
		type: 'POST',
		data: {classe: 'tramitacao', metodo: 'descontar', token: token},
		success: function(result){
			if(result.error){
				console.log(result.error);
			}else{
				console.log(result.success);
			}
		}
	});

	//Descontar todas as tramitacoes fixas pendentes
	$.ajax({
		url: url + '/api.php',
		type: 'POST',
		data: {classe: 'tramitacao', metodo: 'descontarFixas', token: token},
		success: function(result){
			if(result.error){
				console.log(result.error);
			}else{
				console.log(result.success);
			}
		}
	});

} else {
	$('nav').hide();
	$('main').hide();
	$('.modal-content').load('partial/login.html');
	$('.modal-content').css('width','320px');
	$('.modal').modal('show');
}