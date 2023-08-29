jQuery(document).ready(function($) {
  getData();
});

function getData() {
  let label = [];
  var positives = [];
  var tested = [];
  var yield = [];
  $.ajax({
    url: htsBaseUrl + "GetSurgeSummary",
    success: function(data) {
      var ctx = document.getElementById("yield_by_state").getContext("2d");
      let responseData = data;
      console.log(data);
      responseData.forEach(element => {
        label.push(element.Lga);
        tested.push(element.TestedCount);
        positives.push(element.PositiveCount);
        var yieldResult = numeral(
          element.PositiveCount / element.TestedCount
        ).format("0.00");
        yield.push(yieldResult);
      });

      var data = {
        labels: label,
        datasets: [
          {
            label: "Yield",
            type: "scatter",
            data: yield,
            fill: false,
            backgroundColor: "gray",
            pointBorderColor: "red",
            pointRadius: 10,
            pointBorderWidth: 3,
            yAxisID: "y-axis-2"
          },
          {
            label: "Tested",
            backgroundColor: "rgb(92, 185, 96)",
            data: tested
          },
          {
            label: "Positive",
            backgroundColor: "rgb(239, 83, 80)",
            data: positives
          }
        ]
      };

      var myBarChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          barValueSpacing: 10,
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  labelString: "Testing",
                  fontSize: 15,
                  fontColor: "#fff"
                },
                gridLines: {
                  color: "white",
                  borderDash: [2, 5]
                }
              },
              {
                ticks: {
                  beginAtZero: true,
                  labelString: "Testing",
                  fontSize: 15,
                  fontColor: "red",
                  fontStyle: "bold"
                },
                id: "y-axis-2",
                position: "right"
              }
            ],
            xAxes: [
              {
                ticks: {
                  fontSize: 15,
                  fontColor: "#fff"
                }
              }
            ]
          },
          legend: {
            labels: {
              fontSize: 15,
              fontColor: "#fff"
            }
          }
        }
      });
    }
  });
}
