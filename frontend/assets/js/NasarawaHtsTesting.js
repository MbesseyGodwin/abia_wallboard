jQuery(document).ready(function ($) {
  $.ajax({
    url: htsBaseUrl + "getHtsTestingCommunityModality",
    success: function (data) {
      var ctx = document.getElementById("hts_by_modality").getContext("2d");
      //offerred 
      var offerred = [];
      offerred.push(data.Offerred);
      offerred.push(0);
      offerred.push(0);
      offerred.push(0);
      //eligible
      var eligible = [];
      eligible.push(data.Eligible);
      eligible.push(0);
      eligible.push(0);
      eligible.push(0);
      //tested
      var tested = [];
      tested.push(data.Tested);
      tested.push(0);
      tested.push(0);
      tested.push(0);
      //positives
      var positives = [];
      positives.push(data.Positve);
      positives.push(0);
      positives.push(0);
      positives.push(0);
      //yeild
      var yield = [];
      yield.push((data.Positve / data.Tested) * 100);
      //yield.push(0);

      var data = {
        labels: ["Community", "Index", "VTC", "Stand Alone", "TB", "STI", "OPD", "Outreach", "Others"],
        datasets: [
          {
            label: "Yield",
            type: 'scatter',
            data: yield,
            fill: false,
            //borderColor: '#EC932F',
            backgroundColor: 'gray',
            pointBorderColor: 'red',
            pointRadius: 10,
            pointBorderWidth: 3,
            //pointBackgroundColor: '#EC932F',
            //pointHoverBackgroundColor: '#EC932F',
            //pointHoverBorderColor: '#EC932F'
            yAxisID: 'y-axis-2'
          },
          {
            label: "Offerred",
            backgroundColor: "rgb(25, 118, 210)",
            data: offerred
          }, {
            label: "Eligible",
            backgroundColor: "rgb(255, 193, 62)",
            data: eligible
          }, {
            label: "Tested",
            backgroundColor: "rgb(92, 185, 96)",
            data: tested
          }, {
            label: "Positive",
            backgroundColor: "rgb(239, 83, 80)",
            data: positives
          }]
      };

      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          title: {
            display: true,
            text: 'HTS by Modality',
            fontSize: 14,
            fontColor: "#fff"
          },
          barValueSpacing: 10,
          scales: {
            yAxes: [{
              ticks: {
                min: 0,
              }
            }],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  labelString: "Testing",
                  fontSize: 15,
                  fontColor: '#fff'
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
                  fontColor: 'red',
                  fontStyle: 'bold'
                },
                id: "y-axis-2",
                position: "right"
              }
            ],
            xAxes: [{
              ticks: {
                fontSize: 15,
                fontColor: '#fff'
              }
            }]
          },
          legend: {
            labels: {
              fontSize: 15,
              fontColor: "#fff"
            }
            // reverse: true
          }
        }
      });

      getStateYieldData();
    }
  });

  var ids = ["#hts_chart", "#hts_yield_by_state"];
  ids.forEach(e => {
    $(e).hide();
  });
  var index = 0;
  $(ids[index]).show(300);
  setInterval(() => {
    if (index >= ids.length - 1)
      index = 0;
    else
      index = index + 1;
    ids.forEach(e => {
      $(e).hide();
    });
    $(ids[index]).show(800);
  }, 1000 * 40);
});

function createNewData(xdata, htsdata) {
  var newArr = [];
  for (i = 0; i < xdata.length; i++) {
    const result = htsdata.find(({ Lga }) => Lga === xdata[i].state);
    //console.log(result);
    //console.log(xdata[i].state);
    var obj = {};
    var tx_new = xdata[i].tx_new;
    var tx_newPercentage = 0;
    var tx_currPercentage = 0;
    var pvlsPercentage = 0;
    var tx_curr = xdata[i].tx_curr;
    var vl_total_result = xdata[i].vl_total_result;
    obj.tx_vls = xdata[i].tx_vls;
    obj.expected = xdata[i].expected;
    obj.tx_curr_expected = xdata[i].tx_curr_expected;
    obj.hts_tst = xdata[i].hts_tst;
    obj.hts_tst_pos = xdata[i].hts_tst_pos;
    obj.state = xdata[i].state;
    obj.tx_curr = tx_curr;
    obj.tx_new = tx_new;
    obj.vl_total_result = vl_total_result;
    if (result !== undefined) {
      obj.hts_tst = result.TestedCount;
      obj.hts_tst_pos = result.PositiveCount;
      obj.PositivePercentage = result.PositivePercentage;
    }
    //console.log(result.Lga, result.TestedCount);
    if (tx_new !== 0) {
      tx_newPercentage = numeral((tx_new / xdata[i].expected) * 100).format(
        "0.0"
      );
    }
    if (tx_curr !== 0) {
      tx_currPercentage = numeral(
        (tx_curr / xdata[i].tx_curr_expected) * 100
      ).format("0.0");
    }

    if (tx_new !== 0) {
      tx_newPercentage = numeral((tx_new / xdata[i].expected) * 100).format(
        "0.0"
      );
    }
    if (tx_curr !== 0) {
      tx_currPercentage = numeral(
        (tx_curr / xdata[i].tx_curr_expected) * 100
      ).format("0.0");
    }
    if (vl_total_result !== 0 && xdata[i].tx_vls !== 0) {
      pvlsPercentage = numeral(
        (xdata[i].tx_vls / vl_total_result) * 100
      ).format("0.0");
    }
    obj.tx_newPercentage = tx_newPercentage;
    obj.tx_currPercentage = tx_currPercentage;
    obj.pvlsPercentage = pvlsPercentage;
    newArr.push(obj);
  }
  return newArr;
}

function getStateYieldData() {
  let label = [];
  var positives = [];
  var tested = [];
  var yield = [];
  $.ajax({
    url: htsBaseUrl + "GetSurgeSummary",
    success: function (data) {
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
          title: {
            display: true,
            text: 'HTS yield by LGA',
            fontSize: 14,
            fontColor: "#fff"
          },
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
            //reverse:true
          }
        }
      });
    }
  });
}