var datatable = $('#datatable').DataTable({
    ajax: {
        url: url + '/api.php',
        deferRender: true,
        dataSrc: function(json) {
            if (json.data) return json.data;
            else return false;
        },
        type: "POST",
        data: function(d) {
            d.classe = 'transferencia';
            d.metodo = 'obterTodos';
            d.token = token;
        }
    },
    columns: [
        { data: "conta_transferencia", className: "details-control" },
        { data: "conta_recebe", className: "details-control" },
        { data: "valor", className: "details-control" },
        { data: "dt_update", className: "details-control dt-body-right", render: function(datetime) { return datetime_format(datetime, 'd/m/y h:i') } }
    ],
    responsive: true,
    language: {
        url: "lib/datatables/Portuguese-Brasil.lang"
    }
});

var data;

$('#btn-novo').click(function() {
    data = null;
    loadForm();
});

$('#datatable tbody').on('click', 'tr', function() {
    data = datatable.row(this).data();
    loadForm();
});

function loadForm() {
    $('.modal-content').load('partial/transferencia-form.html', function(responseTxt, statusTxt, xhr) {
        if (statusTxt == 'success') $('.modal').modal('show');
    });
}