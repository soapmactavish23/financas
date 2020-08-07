$('.modal-title').text('Nova Transferência');
$('#btn-excluir').hide();
if (data) {
    $('.modal-title').text('Transferência #' + data.idtransferencia);
    $('input[name="idtransferencia"]').val(data.idtransferencia);
    $('input[name="valor"]').val(data.valor);
    $('input[name="data"]').val(data.data);
    $('#btn-excluir').show();
}

//Select Picker para conta que transfere
var saldo_conta_transfer;
var selectContaTransfer = $('select[name="idconta"]');
$.ajax({
    type: 'POST',
    url: url + "/api.php",
    data: { classe: "conta", metodo: "obterContaDisponivel", token: token },
    success: function(result) {
        if (!result.data) result.data = [];
        $.each(result.data, function(index, element) {
            selectContaTransfer.append($('<option>', { value: element.idconta, text: element.conta }));
        });
        if (data) selectContaTransfer.val(data.idconta_transferencia);
        else selectContaTransfer.val(null);

        selectContaTransfer.selectpicker();
    }
});
selectContaTransfer.change(function() {
    $.ajax({
        url: url + '/api.php',
        type: 'post',
        data: { classe: 'conta', metodo: 'obterSaldo', token: token, idconta: selectContaTransfer.val() },
        success: function(result) {
            $.each(result.data, function(index, element) {
                saldo_conta_transfer = element.saldo;
                console.log(saldo_conta_transfer);
            });
        }
    });
});

//Select para obterConta que recebe
var selectContaRecebe = $('select[name="idconta_recebe"]');
$.ajax({
    type: 'POST',
    url: url + "/api.php",
    data: { classe: "conta", metodo: "obterContaDisponivel", token: token },
    success: function(result) {
        if (!result.data) result.data = [];
        $.each(result.data, function(index, element) {
            selectContaRecebe.append($('<option>', { value: element.idconta, text: element.conta }));
        });
        if (data) selectContaRecebe.val(data.idconta_recebe);
        else selectContaRecebe.val(null);

        selectContaRecebe.selectpicker();
    }
});

//Enviar formulario
$('form').submit(function() {
    if (parseFloat(saldo_conta_transfer) > $('input[name="valor"]').val()) {
        if (selectContaTransfer.val() == selectContaRecebe.val()) {
            alert("As duas contas são iguais");
        } else {
            var data = $(this).serializeArray();
            data.push({ name: 'classe', value: 'transferencia' });
            data.push({ name: 'metodo', value: 'salvar' });
            data.push({ name: 'token', value: token });
            $.ajax({
                url: url + '/api.php',
                type: 'post',
                data: data,
                success: function(result) {
                    alert('Transferência #' + result.idtranferencia + ' gravada com sucesso!');
                    datatable.ajax.reload(null, false);
                    $('.modal').modal('hide');
                }
            });
        }
    } else {
        alert("Você não tem saldo suficiente para transferir");
    }
    return false;
});

//Excluir
$('#btn-excluir').click(function() {
    if (confirm('Confirmar Exclusão da Transferência')) {
        $.ajax({
            url: url + '/api.php',
            type: 'post',
            data: {
                classe: 'transferencia',
                metodo: 'excluir',
                token: token,
                idtransferencia: $('input[name="idtransferencia"]').val(),
                idconta_transferencia: selectContaTransfer.val(),
                idconta_recebe: selectContaRecebe.val(),
                valor: $('input[name="valor"]').val()
            },
            success: function(result) {
                if (result.error) {
                    alert(result.error);
                } else {
                    alert('Transferência #' + result.idtransferencia + ' excluída com sucesso!');
                    datatable.ajax.reload(null, false);
                    $('.modal').modal('hide');
                }
            }
        });
    }
});