var datatable = $('#datatable').DataTable({
	ajax: {
		url: url + '/api.php',
		deferRender: true,
		dataSrc: function (json) { if (json.data) return json.data; else return false; },
		type: "POST",
		data: function (d) {
			d.classe = 'tramitacao';
			d.metodo = 'obterTodos';
			d.token = token;
		}
	},
	columns: [
		{ data: "descricao", className: "details-control" },
		{ data: "categoria", className: "details-control" },
		{ data: "tipo_tramitacao", className: "details-control" },
		{ data: "valor", className: "details-control" },
		{
			data: "pago", className: "details-control", render: function (pago) {
				if(pago == 'S'){
					return "PAGO";	
				}else{
					return "PENDENTE";
				}
			}
		},
		{ data: "data", className: "details-control", render: function (datetime) { return datetime_format(datetime, 'd/m/y') } },
		{ data: "dt_update", className: "details-control dt-body-right", render: function (datetime) { return datetime_format(datetime, 'd/m/y h:i') } }
	],
	responsive: true,
	language: {
		url: "lib/datatables/Portuguese-Brasil.lang"
	}
});

var data;

$('#btn-novo').click(function () {
	data = null;
	loadForm();
});

$('#datatable tbody').on('click', 'tr', function () {
	data = datatable.row(this).data();
	loadForm();
});

function loadForm() {
	$('.modal-content').load('partial/tramitacao-form.html', function (responseTxt, statusTxt, xhr) {
		if (statusTxt == 'success') $('.modal').modal('show');
	});
}