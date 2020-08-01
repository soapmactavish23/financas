//Apresentar o nome de usuário
$('#nome-usuario').text("Olá " + user.nome);

//Recuperar o saldo geral
var saldo_geral = $.ajax({
    url: url + '/api.php',
    type: "POST",
    data: {classe: 'conta', metodo: 'contarSaldoGeral', token: token},
    success: function(result){
        $.each(result.data, function (i, vet) {
            $('#saldo-geral').text(vet.saldo);
        });
    }
});

//Recuperar contas a pagar hoje
var receita_diaria = $.ajax({
    url: url + '/api.php',
    type: "post",
    data: {classe: 'tramitacao', metodo: 'contarDespesasDiarias', token: token},
    success: function(result){
        $.each(result.data, function (i, vet) {
            if(vet.valor && vet.tot_despesa){
                $('#despesa-diaria').text(vet.valor);
                $('#qtd_despesa').text(vet.tot_despesa);
            }else{
                $('#despesa-diaria').text(0);
                $('#qtd_despesa').text(0);
            }
            
        });
    }
});

//Recuperar contas a receber hoje
var despesa_diaria = $.ajax({
    url: url + '/api.php',
    type: "post",
    data: {classe: 'tramitacao', metodo: 'contarReceitasDiarias', token: token},
    success: function(result){
        $.each(result.data, function (i, vet) {
            if(vet.valor && vet.tot_receita){
                $('#receita-diaria').text(vet.valor);
                $('#qtd_receita').text(vet.tot_receita);
            }else{
                $('#receita-diaria').text(0);
                $('#qtd_receita').text(0);
            }
            
        });
    }
});

var detalhesVetor = [];

//Ver detalhes
$('#btn-detalhes-receita').click( function () {
    var data = [
        titulo = "Receitas de Hoje",
        metodo = "obterReceitasDiarias"
    ];
    loadForm(data);
});

$('#btn-detalhes-despesa').click(function(){
    var data = [
        titulo = "Despesas de Hoje",
        metodo = "obterDespesasDiarias"
    ];
    loadForm(data);
});

function loadForm(m) {
    detalhesVetor = m;
	$('.modal-content').load('partial/detalhes.html', function(responseTxt,statusTxt,xhr) {
		if ( statusTxt == 'success' ){
            $('.modal').modal('show');
        }
	});
}

var coresBootstrap = [
    '#d9534f',
    '#f0ad4e',
    '#0275d8',
    '#5bc0de',
    '#5cb85c',
    '#292b2c',
    '#eb5b2d',
    '#a3e3fb',
    '#0c4c8c',
    '#8e5847',
    '#a6c5c8',
    '#2f6765',
    '#372528',
    '#313725',
    '#2b2537',
    '#25372b'
];

//Gráfico de contas
var chartContas = new Chart($('#painel-contas'),{
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: coresBootstrap
        }],
        labels: []
    },
    options: {
        responsive: true,
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Todas as Contas Bancárias',
            fontSize: 16,
            fontFamily: 'Arial'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});		

var graficoContas = $.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'conta', metodo: 'contarContas', token: token},
    success: function(result){
        if(result.error){
            console.log(result.error);
        }else{
            if(result.data){
                chartContas.data.labels = [];
                chartContas.data.datasets[0].data = [];
                $.each(result.data, function(i, vet){
                    chartContas.data.labels.push(vet.instituicao);
                    chartContas.data.datasets[0].data.push(parseInt(vet.saldo));
                });
                chartContas.update();
            }
        }
    }
});

//Gráfico de painel-dt-conta
var chartDtDespesas = new Chart($('#painel-dt-conta'),{
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Valor',
            data: [],
            backgroundColor: coresBootstrap,
            borderColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Data de Pagamento das Despesas',
            fontSize: 16,
            fontFamily: 'Arial'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});		

var graficoDtDespesa = $.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'tramitacao', metodo: 'obterDtDespesa', token: token},
    success: function(result){
        if(result.error){
            console.log(result.error);
        }else{
            if(result.data){
                chartDtDespesas.data.labels = [];
                chartDtDespesas.data.datasets[0].data = [];
                $.each(result.data, function(i, vet){
                    chartDtDespesas.data.labels.push(vet.dt);
                    chartDtDespesas.data.datasets[0].data.push( parseInt(vet.valor) );
                });
                chartDtDespesas.update();
            }
        }
    }
});

//Gráfico de despesas
var chartDespesas = new Chart( $('#painel-despesa'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Valor',
            data: [],
            backgroundColor: coresBootstrap,
            borderColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Todas as Despesas por Categória'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: { 
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var graficoDespesa = $.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'tramitacao', metodo: 'contarDespesas', token: token},
    success: function(result){
        chartDespesas.data.labels = [];
        chartDespesas.data.datasets[0].data = [];
        $.each(result.data, function(i, vet){
            chartDespesas.data.labels.push(vet.categoria);
            chartDespesas.data.datasets[0].data.push(parseInt(vet.valor));

        });
        chartDespesas.update();
    }
});


//Gráfico de Receita
var chartReceita = new Chart( $('#painel-receita'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Valor',
            data: [],
            backgroundColor: coresBootstrap,
            borderColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Todas as Receitas por Categória'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: { 
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var graficoReceita = $.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'tramitacao', metodo: 'contarReceitas', token: token},
    success: function(result){
        chartReceita.data.labels = [];
        chartReceita.data.datasets[0].data = [];
        $.each(result.data, function(i, vet){
            chartReceita.data.labels.push(vet.categoria);
            chartReceita.data.datasets[0].data.push(parseInt(vet.valor));
        });
        chartReceita.update();
    }
});

setInterval(saldo_geral, 120000);
setInterval(graficoContas, 120000);
setInterval(graficoDtDespesa, 120000);
setInterval(graficoDespesa, 120000);
setInterval(graficoReceita, 120000);
