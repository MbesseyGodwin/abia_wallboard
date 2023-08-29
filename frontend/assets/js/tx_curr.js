jQuery(document).ready(function($) { 
    $.ajax({
        url: baseUrl + "GetTxCurrArchieved",
        success: function(data) {
                
            plotStackedChart(data);
        }
      });
});

function plotStackedChart(data){
    var data = {
        labels: ["x1", "x2", "x3", "x4", "x5"],
        datasets: [
            {
                label: "Actual",
                backgroundColor: 'white',
                borderWidth: 1,
                data: [40, 150, 50, 60, 70],
                xAxisID: "bar-x-axis1",
                stack: "background"
            },
            {
                label: "Target",
                backgroundColor: 'blue',
                borderWidth: 1,
                data: [100, 100, 100, 100, 100],
                xAxisID: "bar-x-axis2"
            }
        ]
    };

    var options = {
        scales: {
            xAxes: [
                {
                    id: "bar-x-axis2",
                    stacked: true,
                    categoryPercentage: 0.5,
                    barPercentage: 0.5
                },
                {
                    display: true,
                    stacked: true,
                    id: "bar-x-axis1",
                    type: 'category',
                    categoryPercentage: 0.4,
                    barPercentage: 1,
                    gridLines: {
                        offsetGridLines: true
                    }
                }
            ],

            yAxes: [{
                id: "bar-y-axis1",
                stacked: false,
                ticks: {
                    beginAtZero: true
                }
            }]

        }
    };

    var ctx = document.getElementById("tx_curr_performance").getContext("2d");
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}
/* function plotStackedChart(arrayData){
    var ctx = document.getElementById("tx_curr_performance").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Oct-19","Nov-19","Dec-19","Jan-20","Feb-20","Mar-20","Apr-20","May-20","Jun-20","Jul-20","Aug-20","Sep-20"],
            datasets: [{
                label: 'Target',
                backgroundColor: "rgb(29, 83, 80)",
                data: [13230,26459,39688,52917,66147,79376,92605,105834,119064,132293,145522,158751],
            }, {
                label: 'Acheivement',
                backgroundColor: "rgb(92, 185, 96)",
                data: arrayData
            }],
        },
    options: {
        tooltips: {
        displayColors: true,
        callbacks:{
            mode: 'x',
        },
        },
        scales: {
        xAxes: [{
            stacked: true,
            gridLines: {
            display: false,
            }
        }],
        yAxes: [{
            stacked: true,
            ticks: {
            beginAtZero: true,
            },
            type: 'linear',
        }]
        },
            // responsive: true,
            // maintainAspectRatio: false,
            legend: { position: 'bottom' },
        }
    });
} */