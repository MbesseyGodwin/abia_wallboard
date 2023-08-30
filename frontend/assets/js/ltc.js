jQuery(document).ready(($) => {
  const generateDataset = (data, index) => {
    const { label, ...weekData } = data[index];
    const filteredData = Object.values(weekData).filter((value) => value !== 0);
    const backgroundColor = index === 0 ? 'rgba(0, 242, 0, 1) ' : 'rgba(54, 162, 235, 1)';

    return {
      label: label,
      data: filteredData,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
      borderWidth: 1
    };
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/api/wallboard/GetQuarterPosToLinkage');
      const data = await response.json();

      const labels = Object.keys(data[0]).filter((key) => key.startsWith('week') && data[0][key] !== 0);
      const datasets = data.map((item, index) => generateDataset(data, index));

      const updatedData = {
        labels: labels,
        datasets: datasets
      };

      const options = {
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "#fff",
              fontSize: 24,
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: false,
              fontColor: "#fff",
              fontSize: 24,
            }
          }]
        },
        legend: {
          labels: {
            fontColor: "#fff",
            fontSize: 24,
          }
        }
      };

      const ctx = $('#ltc');
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: updatedData,
        options: options,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
});
