/*Custom script*/

jQuery(document).ready(function($) {
  var label = [];
  var TxData = [];
  var sumTxData = [];
  let xdata = [];
  $.ajax({
    url: baseUrl + "GetNasarawaSurgeTxByWeek",
    success(data) {
      data[0].chartData.forEach(function(value) {
        label.push(value.weeks);
        TxData.push(value.tx_new);
      });
      //Get the last 4 weeks
      var newWeeklabel = label.slice(-6);
      var newTxData = TxData.slice(-6);
      // Sum up txNew
      TxData.reduce(function(a, b, i) {
        return (sumTxData[i] = a + b);
      }, 0);
      var newsumTxData = sumTxData.slice(-6);

      var ctx = $("#trend");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: newWeeklabel,
          datasets: [
            {
              label: "# of Tx_New Identified",
              data: newTxData,
              fill: false,
              lineTension: 0,
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)"
              ],
              borderWidth: 5
            }
          ]
        },
        options: {
          scales: {
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

      var ctx = $("#trend2");
      let myChart2 = new Chart(ctx, {
        type: "line",
        data: {
          labels: newWeeklabel,
          datasets: [
            {
              label: "# of Positives Identified (Cummulative)",
              data: newsumTxData,
              lineTension: 0,
              backgroundColor: [
                "rgba(255, 206, 86, 0.75)",
                "rgba(75, 192, 192, 0.75)",
                "rgba(153, 102, 255, 0.75)",
                "rgba(75, 192, 192, 0.75)",
                "rgba(153, 102, 255, 0.75)",
                "rgba(255, 159, 64, 0.75)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  labelString: "Testing"
                }
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

      // Table
      xdata = data[1].chartData;

      for (i = 0; i < 8; i++) {
        $("[data-ticker]").append(`
					<tr>
						<td>${xdata[i].state}</td>
						<td><span style="color:#9ecc9e">${xdata[i].tx_new}</span>/${xdata[i].avg}</td>
						<td><i class="mdi mdi-arrow-${xdata[i].tx_new/xdata[i].avg > 0.8 ? "up" : "down"}-thick ${
          xdata[i].tx_new/xdata[i].avg > 0.8? "green" : "red"
        }-text"></i></td>
					</tr>`);
      }

      setInterval(() => {
        last = xdata[xdata.length - 1];
        $($("[data-ticker] tr")[0]).remove();
        $("[data-ticker]").append(`
			<tr>
				<td>${last.state}</td>
				<td><span style="color:#9ecc9e">${last.tx_new}</span>/${last.avg}</td>
				<td><i class="mdi mdi-arrow-${last.tx_new/last.avg > 0.8 ? "up" : "down"}-thick ${
          last.tx_new/last.avg > 0.8 ? "green" : "red"
        }-text"></i></td>
			</tr>`);
        xdata.pop();
        xdata.unshift(last);
      }, 5000);

      //fetch tx_curr archeivement 
      $.ajax({
        url: baseUrl + "GetTxCurrArchieved/?state=Nasarawa",
        success: function(data) {
                
            plotStackedChart(data);
        }
      });
    }
  });

  setInterval(() => {
    $(".mini_chart").toggle();
  }, 20000);


  var ids = ["#tx_new_trend", "#tx_curr_archeivement"];
  ids.forEach(e => {
      $(e).hide();
  });
  var index = 0;
  $(ids[index]).show(300);
  setInterval(() => {
      if(index >= ids.length - 1)
          index = 0;
      else
          index = index + 1;
      ids.forEach(e => {
          $(e).hide();
      });
      $(ids[index]).show(500);
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
    if(result !== undefined){
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

function plotStackedChart(arrayData){
  var ctx = document.getElementById("tx_curr_performance");//.getContext('2d');
  // var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //         labels: ["Oct-19","Nov-19","Dec-19","Jan-20","Feb-20","Mar-20","Apr-20","May-20","Jun-20","Jul-20","Aug-20","Sep-20"],
  //         datasets: [{
  //             label: 'Target Projection',
  //             backgroundColor: "rgb(29, 83, 80)",
  //             data: [13230,26459,39688,52917,66147,79376,92605,105834,119064,132293,145522,158751],
  //             xAxisID: "bar-x-axis1"
  //         }, {
  //             label: 'Acheivement',
  //             backgroundColor: "rgb(92, 185, 96)",
  //             data: arrayData,
  //             xAxisID: "bar-x-axis2"
  //         }],
  //     },
  // options: {
  //   title: {
  //     display: true,
  //     text: 'Progress Towards FY20 Treatment Goal Priority',
  //     fontSize:14,
  //     fontColor:"#fff"
  //   },
  //     tooltips: {
  //     displayColors: true,
  //     callbacks:{
  //         mode: 'x',
  //     },
  //     },
  //     scales: {
  //     // xAxes: [{
  //     //     stacked: true,
  //     //     gridLines: {
  //     //     display: false,
  //     //     },
  //     //     ticks: {
  //     //       fontSize: 15,
  //     //       fontColor: "#fff"
  //     //     }
  //     // }],
  //     xAxes: [
  //       {
  //         id: "bar-x-axis2",
  //         stacked: true,
  //         categoryPercentage: 0.5,
  //         barPercentage: 0.5
  //     },
  //     {
  //         display: true,
  //         stacked: true,
  //         id: "bar-x-axis1",
  //         type: 'category',
  //         categoryPercentage: 0.4,
  //         barPercentage: 1,
  //         gridLines: {
  //             offsetGridLines: true
  //         }
  //     }
  //     ],
  //     yAxes: [{
  //         stacked: false,
  //         ticks: {
  //           beginAtZero: true,
  //           labelString: "Testing",
  //           fontSize: 15,
  //           fontColor:'#fff'
  //       },
  //       gridLines: {
  //           color: "white",
  //           borderDash: [2, 5]
  //       }
  //     }]
  //     },
  //     legend: {
  //       labels: {
  //         fontSize: 15,
  //         fontColor: "#fff"
  //       }
  //       // reverse: true
  //     }
  //     }
  // });
  var data = {
    labels: ["Oct-20","Nov-20","Dec-20","Jan-21","Feb-21","Mar-21","Apr-21","May-21","Jun-21","Jul-21","Aug-21","Sep-21"],
    datasets: [
      
        {
          label: 'Achievement',
              data: arrayData,
              xAxisID: "bar-x-axis2",
              backgroundColor: "rgba(0,255,255, 0.5)",
            borderWidth: 1,
            xAxisID: "bar-x-axis2"
        },
        {
          label: 'Target Projection',
              backgroundColor: "rgb(47,107,37)",
            data: [100425,110554,120683,130812,140941,151070,161200,171329,181458,191587,201716,211845],           
            borderWidth: 1,
            xAxisID: "bar-x-axis1",
            stack: "background"
        }
    ]
};

var options = {
    scales: {
        xAxes: [
            {
                id: "bar-x-axis1",
                categoryPercentage: 0.6,
                barPercentage: 0.3,
                stacked: true,
                ticks: {
                  fontSize: 15,
                  fontColor: "#fff"
                }
            },
            {
                display: true,
                stacked: true,
                id: "bar-x-axis2",
                type: 'category',
                categoryPercentage: 0.4,
                barPercentage: 1,
                gridLines: {
                    offsetGridLines: true
                },
                ticks: {
                  fontColor: "#000"
                }
            }
        ],

        yAxes: [{
            id: "bar-y-axis1",
            stacked: false,
            ticks: {
                beginAtZero: true,
                labelString: "Testing",
                fontSize: 15,
                fontColor:'#fff'
            },
                  gridLines: {
                      color: "white",
                      borderDash: [2, 5]
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
};

var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});
}