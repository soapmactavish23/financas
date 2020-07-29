var datatable = $('#datatable').DataTable( {
	ajax: {
		url: url + '/api.php',
		deferRender: true,
		dataSrc: function (json) { if (json.data) return json.data; else return false; },
		type: "POST",
		data: function (d) {
			d.classe = 'cartao';
			d.metodo = 'obterTodos';
			d.token = token;
		}
	},
	columns: [
		{ data: "nome_cartao", className: "details-control" },
        { data: "limite", className: "details-control" },
        { data: "fechamento", className: "details-control" },
        { data: "vencimento", className: "details-control" },
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
	$('.modal-content').load('partial/cartao-form.html', function(responseTxt,statusTxt,xhr) {
		if ( statusTxt == 'success' ) $('.modal').modal('show');
	});
}