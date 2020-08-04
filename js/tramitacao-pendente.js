//Datatable
var datatable = $('#datatable').DataTable({
    ajax: {
        url: url + '/api.php',
        deferRender: true,
        dataSrc: function (json) { if (json.data) return json.data; else return false; },
        type: "POST",
        data: function (d) {
            d.classe = 'tramitacao';
            d.metodo = 'obterTodasPendentes';
            d.token = token;
        }
    },
    columns: [
        { data: "idtramitacao", className: "details-control", visible: false},
        { data: 'idconta', className: "details-control", visible: false},
        { data: "descricao", className: "details-control" },
        { data: "categoria", className: "details-control" },
        { data: "tipo_tramitacao", className: "details-control" },
        { data: "valor", className: "details-control" },
        {
            data: "pago", className: "details-control", render: function (pago) {
                if (pago == 'S') {
                    return "PAGO";
                } else {
                    return "PENDENTE";
                }
            }
        },
        { data: "nome_conta", className: "details-control" },
        { data: "data", className: "details-control", render: function (datetime) { return datetime_format(datetime, 'd/m/y') } },
        { data: "dt_update", className: "details-control dt-body-right", render: function (datetime) { return datetime_format(datetime, 'd/m/y h:i') } }
    ],
    responsive: true,
    "order": [],
    language: {
        url: "lib/datatables/Portuguese-Brasil.lang"
    }
});

$('#datatable tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = datatable.row(tr);
    var dataTramitacao = row.data();
    console.log(dataTramitacao);
    if (confirm("Deseja descontar a tramitação #" + dataTramitacao.idtramitacao + "?")) {
        $.ajax({
            type: 'POST',
            url: url + '/api.php',
            data: {
                classe: "tramitacao",
                metodo: "pagar",
                idtramitacao: dataTramitacao.idtramitacao,
                idconta: dataTramitacao.idconta,
                tipo_tramitacao: dataTramitacao.tipo_tramitacao,
                valor: dataTramitacao.valor,
                token: token
            },
            success: function (result) {
                console.log(result);
				datatable.ajax.reload(null, false);
				alert(result.success);
            }
        });
    }
    return false;
});