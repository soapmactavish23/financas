var datatable = $('#datatable').DataTable( {
	ajax: {
		url: url + '/api.php',
		deferRender: true,
		dataSrc: function (json) { if (json.data) return json.data; else return false; },
		type: "POST",
		data: function (d) {
			d.classe = 'conta';
			d.metodo = 'obterTodos';
			d.token = token;
		}
	},
	columns: [
		{ data: "nome_conta", className: "details-control" },
        { data: "tipo_conta", className: "details-control" },
        { data: "instituicao", className: "details-control" },
        { data: "saldo", className: "details-control" },
		{ data: "dt_update", className: "details-control dt-body-right", render: function(datetime) { return datetime_format(datetime,'d/m/y h:i')} }
	],
	responsive: true,
	language: {
		url: "lib/datatables/Portuguese-Brasil.lang"
	}
});

var data;

$('#btn-novo').click( function () {
	data = null;
	loadForm();
});

$('#datatable tbody').on('click', 'tr', function () {
	data = datatable.row( this ).data();
	loadForm();
});

function loadForm() {
	$('.modal-content').load('partial/conta-form.html', function(responseTxt,statusTxt,xhr) {
		if ( statusTxt == 'success' ) $('.modal').modal('show');
	});
}