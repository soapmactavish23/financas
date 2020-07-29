var datatable = $('#datatable').DataTable( {
	ajax: {
		url: url + '/api.php',
		deferRender: true,
		dataSrc: function (json) { if (json.data) return json.data; else return false; },
		type: "POST",
		data: function (d) {
			d.classe = 'usuario';
			d.metodo = 'obterTodos';
			d.token = token;
		}
	},
	columns: [
		{ data: "nome", className: "details-control" },
		{ data: "email", visible: true },
		{ data: "dt_update", className: "details-control dt-body-right", render: function(datetime) { return datetime_format(datetime,'d/m/y h:i')} }
	],
	responsive: true,
	language: {
		url: "lib/datatables/Portuguese-Brasil.lang"
	}
});

var data;

$('#btn-novo-usuario').click( function () {
	data = null;
	loadForm();
});

$('#datatable tbody').on('click', 'tr', function () {
	data = datatable.row( this ).data();
	loadForm();
});

function loadForm() {
	$('.modal-content').load('partial/usuario-form.html', function(responseTxt,statusTxt,xhr) {
		if ( statusTxt == 'success' ) $('.modal').modal('show');
	});
}