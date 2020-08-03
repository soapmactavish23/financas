//Datatable
var datatable = $('#datatable').DataTable({
    ajax: {
        url: url + '/api.php',
        deferRender: true,
        dataSrc: function (json) { if (json.data) return json.data; else return false; },
        type: "POST",
        data: function (d) {
            d.classe = 'tramitacao';
            d.metodo = 'obterTodosPorMes';
            d.token = token;
            d.periodo = selectPeriodo.val();
        }
    },
    columns: [
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
    },
    buttons: {
        extend: 'pdf',
        text: 'Exportar como PDF',
        exportOptions: {
            modifier: {
                page: 'current'
            }
        }
    }

});

//Select Picker para periodo
var selectPeriodo = $('select[name="periodo"]');
var meses = {
    nome: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],
    digito: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}
for (var i = 0; i < meses.nome.length; i++) {
    selectPeriodo.append($('<option>', { value: meses.digito[i], text: meses.nome[i] }));
}
selectPeriodo.val(null);
selectPeriodo.selectpicker();

//Mudança no Select
selectPeriodo.change(function () {
    datatable.ajax.reload(null, false);
    despesasPorMes();
    receitasPorMes();
});

//Contar despesas por mes
function despesasPorMes() {
    $.ajax({
        url: url + '/api.php',
        type: 'post',
        data: { classe: 'tramitacao', metodo: "contarDespesasPorMes", token: token, periodo: selectPeriodo.val() },
        success: function (result) {
            $.each(result.data, function (index, vet) {
                if (vet.valor_despesa == null) {
                    $('#despesa-mensal').text(0);
                    $('#qtd_despesa').text(0);
                } else {
                    $('#despesa-mensal').text(parseFloat(vet.valor_despesa).toFixed(2));
                    $('#qtd_despesa').text(vet.tot_despesa);
                }
            });
        }
    });
}

//Contar receitas por mes
function receitasPorMes() {
    $.ajax({
        url: url + '/api.php',
        type: 'post',
        data: { classe: 'tramitacao', metodo: "contarReceitasPorMes", token: token, periodo: selectPeriodo.val() },
        success: function (result) {
            $.each(result.data, function (index, vet) {
                if (vet.valor_receita == null) {
                    $('#receita-mensal').text(0);
                    $('#qtd_receita').text(0);
                } else {
                    $('#receita-mensal').text(parseFloat(vet.valor_receita).toFixed(2));
                    $('#qtd_receita').text(vet.tot_receita);
                }
            });
        }
    });
} 