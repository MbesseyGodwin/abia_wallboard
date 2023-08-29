// Define the chart options
var chartOptions = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Bar Chart with Automatic Category Switching'
    },
    xAxis: {
      categories: ['Category 1', 'Category 2', 'Category 3']
    },
    yAxis: {
      title: {
        text: 'Values'
      }
    },
    series: [{
      name: 'Data Series',
      data: [10, 20, 30]
    }]
  };
  
  // Create the chart
  var chart = Highcharts.chart('container', chartOptions);
  
  // Define the categories and data series
  var categories = ['Category 4', 'Category 5', 'Category 6'];
  var dataSeries = [40, 50, 60];
  
  // Define a function to update the chart data
  function updateChartData() {
    // Update the chart categories and data series
    chart.update({
      xAxis: {
        categories: categories
      },
      series: [{
        name: 'Data Series',
        data: dataSeries
      }]
    });
    // Switch to the next set of categories and data series after 5 seconds
    setTimeout(function() {
      categories = ['Category 7', 'Category 8', 'Category 9'];
      dataSeries = [70, 80, 90];
      updateChartData();
    }, 5000);
  }
  
  // Call the function to update the chart data
  updateChartData();
  