/*Custom script*/ 

jQuery(document).ready(function($){



	let ctx = $('#yield');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: ['week1', 'week2', 'week3', 'week4'],
	        datasets: [{
	            label: '# of people tested/%age yield',
	            data: [12, 19, 3, 5],
	            backgroundColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)'
	            ],
	            fill: false,
	            radius: [10, 50, 12, 11],
	            borderColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)',
	                'rgba(255, 99, 132, 1)'
	            ],
	            borderWidth: 4
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
	    }
	});


});

