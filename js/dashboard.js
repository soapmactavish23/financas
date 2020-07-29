var coresBootstrap = [
    '#d9534f',
    '#f0ad4e',
    '#0275d8',
    '#5bc0de',
    '#5cb85c',
    '#292b2c'
];
var coresMarcas = [
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
var chartSituacao = new Chart( $('#panel-situacao'),{
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: 'Registradas',
            data: [],
            backgroundColor: coresBootstrap,
            borderColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Todas as Situações'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        }
    }
});

$.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'veiculo', metodo: 'contarSituacao', token: token},
    success: function(result){
        var busca = parseInt(result.data[0].total);
        var clonado = parseInt(result.data[1].total);
        var furtado = parseInt(result.data[2].total);
        var recuperado = parseInt(result.data[3].total);
        var roubados = parseInt(result.data[4].total);
        var resultadoTotal = busca + clonado + furtado + recuperado + roubados;
        $('#busca-apreensao').text(busca);
        $('#clonado').text(clonado);
        $('#furtado').text(furtado);
        $('#recuperado').text(recuperado);
        $('#roubados').text(roubados);
        $('#total').text(resultadoTotal);
        chartSituacao.data.labels = [];
        chartSituacao.data.datasets[0].data = [];
        $.each( result.data, function(i, field) {
            chartSituacao.data.labels.push(field.situacao);
            chartSituacao.data.datasets[0].data.push(parseInt(field.total));
        });
        chartSituacao.update();
    }
});

var chartMarcas = new Chart( $('#panel-marcas'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Registradas',
            data: [],
            backgroundColor: coresMarcas,
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
            text: 'Todas as marcas roubadas'
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

$.ajax({
    url: url + '/api.php',
    type: 'POST',
    data: {classe: 'veiculo', metodo: 'contarMarcas', token: token},
    success: function(result){
        if(result.error){
            console.log(result.error);
        }else{
            if(result.data){
                chartMarcas.data.labels = [];
                chartMarcas.data.datasets[0].data = [];
                $.each(result.data, function(i, vet){
                    $('#marcas-veiculos').append("<div class='col-lg-2 col-md-4 col-sm-6 mb-1'><div class='card shadow text-white text-center' style='background-color: "+coresMarcas[i]+";'><h2 class='card-title'>"+vet.tot+"</h2><div class='card-text'>"+vet.marca+"<br></div></div></div>");
                    chartMarcas.data.labels.push(vet.marca);
                    chartMarcas.data.datasets[0].data.push(parseInt(vet.tot));
                });
                chartMarcas.update();
            }
        }
    }
});