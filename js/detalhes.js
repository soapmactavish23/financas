if (detalhesVetor) {
    $('.modal-title').text(detalhesVetor[0]);
} else {
    $('.modal-title').text("Nenhuma Tramitação para Hoje");
}
var datatable_detalhes = $('#datatable-detalhes').DataTable({
    ajax: {
        url: url + '/api.php',
        deferRender: true,
        dataSrc: function (json) { if (json.data) return json.data; else return false; },
        type: "POST",
        data: function (d) {
            d.classe = 'tramitacao';
            d.metodo = detalhesVetor[1];
            d.token = token;
        }
    },
    columns: [
        { data: "categoria", className: "details-control" },
        { data: "valor", className: "details-control" },
        { data: "data", className: "details-control dt-body-right", render: function (datetime) { return datetime_format(datetime, 'd/m/y') } }
    ],
    responsive: true,
    language: {
        url: "lib/datatables/Portuguese-Brasil.lang"
    }
});

$('#datatable-detalhes tbody').on('click', 'tr', function () {
    data = datatable_detalhes.row(this).data();
    
    if (detalhesVetor[1] == "obterDespesasDiarias") {
        mensagemConfirmacao = "Deseja Pagar a conta";
    } else {
        mensagemConfirmacao = "Deseja Receber agora?";
    }

    if (confirm(mensagemConfirmacao)) {
        $.ajax({
            url: url + '/api.php',
            type: 'post',
            data: {
                classe: "tramitacao",
                metodo: "pagar",
                token: token,
                idtramitacao: data.idtramitacao,
                idconta: data.idconta,
                tipo_tramitacao: data.tipo_tramitacao,
                valor: data.valor
            },
            success: function (result) {
                console.log(result);
                alert(result.success);
                datatable_detalhes.ajax.reload(null, false);
                window.location.reload();
            }
        });
    }
});