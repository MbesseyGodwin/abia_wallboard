/*Custom script*/

jQuery(document).ready(function ($) {
  var arraw = $("#arraw");
  //let expected = 120275;
  let expected = 6570;

  var jsondata;
  $.ajax({
    url: baseUrl + "GetNasarawaSurgeTxNewModel",
    success: function (data) {
      i = 0;
      jsondata = data;
      setInterval(() => {
        if (i == data.length) {
          i = 0;
        }

        $("[data-state]")
          .text(data[i].state)
          .css({ "border-bottom": `solid 16px ${data[i].priority}` });
        $("[data-pending]").text(
          numeral(parseInt(data[i].tx_new)).format("0,0")
        );
        var percent;
        if (data[i].tx_new == 0) {
          $("[data-percentage]").text(numeral(0).format("0"));
          percent = 0;
        } else if (data[i].expected == 0) {
          $("[data-percentage]").text(numeral(data[i].tx_new).format("0"));
          percent = 100;
        } else {
          $("[data-percentage]").text(
            numeral(
              (parseInt(data[i].tx_new) / parseInt(data[i].expected)) * 100
            ).format("0.0")
          );
          percent = (data[i].tx_new / data[i].expected) * 100;
        }

        if (percent >= 50.0) {
          arraw.addClass("green-text");
          arraw.addClass("mdi-arrow-up-thick");
          arraw.removeClass("red-text");
          arraw.removeClass("mdi-arrow-down-thick");
          arraw.removeClass("yellow-text");
          //mdi-arrow-up-thick
        } else if (percent == 0) {
          arraw.addClass("yellow-text");
          arraw.removeClass("green-text");
          arraw.removeClass("mdi-arrow-up-thick");
          arraw.removeClass("red-text");
          arraw.removeClass("mdi-arrow-down-thick");
        } else {
          arraw.addClass("red-text");
          arraw.addClass("mdi-arrow-down-thick");
          arraw.removeClass("green-text");
          arraw.removeClass("mdi-arrow-up-thick");
          arraw.removeClass("yellow-text");
        }

        if (i < data.length) {
          i++;
        }
      }, 5000);

      const sumNew = jsondata.reduce(function (prev, cur) {
        return prev + parseInt(cur.tx_new);
      }, 0);

      const sumTarget = jsondata.reduce(function (prev, cur) {
        return prev + parseInt(cur.expected);
      }, 0);

      $("[data-countdown]").text(numeral(expected - sumNew).format("0,0"));

      fetchSurgeVlData();
      fetchSurgeSummary();
      GetSurgeTxCurr();
      fetchTxNewData();
      //getHtsTesting();
      // getStateYieldData();
    }
  });
});

var ids =// ["#surge_countdown_page","#hts_chart","#hts_yield_by_state","#tx_new_page","#tx_curr_page","#vl_summary_page","#surge_summary_page"];
  ["#surge_countdown_page", "#hts_chart", "#hts_yield_by_state", "#tx_new_page", "#tx_curr_page", "#vl_summary_page"];
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

function fetchSurgeVlData() {
  var jsondata;

  $.ajax({
    url: baseUrl + "GetSurgeVLStatistics?state=Nasarawa",
    success: function (data) {
      i = 0;
      //console.log(data);
      jsondata = data;

      $("[data-art]")
        .text(jsondata[i].onART)
      /*  $("[data-cent-eligible]")
        .text(jsondata[i].EligiblePercent + "%") */
      $("[data-eligible]")
        //.text(jsondata[i].Eligible + "\n Eligible")
        .text(jsondata[i].vlEligible)
      $("[data-tested]")
        .text(jsondata[i].vlResult)
      $("[data-cent-tested]")
        .text(jsondata[i].vlResultPercentage == 0 ? '---' : jsondata[i].vlResultPercentage + "%")
      $("[data-supressed]")
        .text(jsondata[i].supression)
      $("[data-cent-supressed]")
        .text(jsondata[i].supressionPercent + "%")
      $("[data-collected]")
        .text(jsondata[i].sampleCollected == 0 ? '---' : jsondata[i].sampleCollected)
      $("[data-cent-collected]")
        .text(jsondata[i].sampleCollectedPercent == 0 ? '---' : jsondata[i].sampleCollectedPercent + "%")
      /*$("[data-due]")
       .text(jsondata[i].VLDue) */
      /*
      $("[data-cent-result]")
       .text(jsondata[i].SampleCollectedPercent)
      $("[data-result]")
       .text(jsondata[i].VLResult) */

    }
  });
}
//Surge Summary Page Data
function fetchSurgeSummary() {
  let xdata;
  let htsdata;

  $.ajax({
    url: htsBaseUrl + "GetSurgeSummary",
    success(data) {
      htsdata = data;

      $.ajax({
        url: baseUrl + "GetNasarawaSurgeSummary",
        success(data) {
          xdata = createNewData(data, htsdata);
          for (i = 0; i < 10; i++) {
            $("#surge_summary_table_body").append(`
	              <tr>
	                <td style="color:white">${xdata[i].state}</td>	             
                  
                 <td style="color:white">${xdata[i].hts_tst}/${xdata[i].hst_target}<span style="color:#7DCEA0"> <b>(${xdata[i].TestedPercentage}%)</b></span></td>

	                <td style="color:white">${xdata[i].hts_tst_pos}/${xdata[i].hts_pos_target}<span style="color:#7DCEA0"> <b>(${xdata[i].PositivePercentage}%)</b></span></td>
	                <td style="color:white">${xdata[i].tx_new}/${xdata[i].expected}<span style="color:#7DCEA0"> <b>(${xdata[i].tx_newPercentage}%)</b></span></td>
	                <td style="color:white">${xdata[i].tx_curr}/${xdata[i].tx_curr_expected}<span style="color:#7DCEA0"><b>(${xdata[i].tx_currPercentage}%)</b></span></td>
	                <td style="color:white">${xdata[i].tx_vls}/${xdata[i].vl_total_result}<span style="color:#7DCEA0"><b>(${xdata[i].pvlsPercentage}%)</b></span></td>
	               
	              </tr>
				`);
          }

          setInterval(() => {
            $($("#surge_summary_table_body tr")[0]).remove();
            let last = xdata[xdata.length - 1];
            xdata.pop();
            xdata.unshift(last);
            $("#surge_summary_table_body").append(`
		<tr>
		 
		 <td style="color:white">${last.state}</td>	             
	                <td style="color:white">${last.hts_tst}/${last.hst_target}<span style="color:#7DCEA0"> <b>(${last.TestedPercentage}%)</b></span></td>
	                <td style="color:white">${last.hts_tst_pos}/${last.hts_pos_target} <span style="color:#7DCEA0"><b>(${last.PositivePercentage}%)</b></span></td>
	                <td style="color:white">${last.tx_new}/${last.expected}<span style="color:#7DCEA0"> <b>(${last.tx_newPercentage}%)</b></span></td>
	                <td style="color:white">${last.tx_curr}/${last.tx_curr_expected}<span style="color:#7DCEA0"><b>(${last.tx_currPercentage}%)</b></span></td>
	                <td style="color:white">${last.tx_vls}/${last.vl_total_result}<span style="color:#7DCEA0"><b>(${last.pvlsPercentage}%)</b></span></td>
	               
		</tr>

	  `);
          }, 5000);
        }
      });
    }
  });
}

function createNewData(xdata, htsdata) {
  var newArr = [];
  for (i = 0; i < xdata.length; i++) {
    const result = htsdata.find(({ Lga }) => Lga === xdata[i].state);
    // console.log("HST", result);
    // console.log("Ndr2", xdata[i].state);
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

    obj.hts_tst = result.TestedCount;
    obj.hts_tst_pos = result.PositiveCount;
    obj.PositivePercentage = result.PositivePercentage;
    obj.TestedPercentage = result.TestedPercentage;
    obj.hst_target = result.hst_target;
    obj.hts_pos_target = result.hts_pos_target;
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
//TX_Curr Data  
function GetSurgeTxCurr() {
  $.ajax({
    url: baseUrl + "GetTxCurrArchieved/?state=Nasarawa",
    success: function (data) {
      //console.log(data)   
      plotStackedChart(data);
    }
  });
};
//function to populate tx_curr data

function plotStackedChart(arrayData) {
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
    labels: ["Oct-20", "Nov-20", "Dec-20", "Jan-21", "Feb-21", "Mar-21", "Apr-21", "May-21", "Jun-21", "Jul-21", "Aug-21", "Sep-21"],
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
        data: [100425, 110554, 120683, 130812, 140941, 151070, 161200, 171329, 181458, 191587, 201716, 211845],
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
          fontColor: '#fff'
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

//TX_New Data
function fetchTxNewData() {
  var label = [];
  var TxData = [];
  var sumTxData = [];
  let xdata = [];
  $.ajax({
    url: baseUrl + "GetNasarawaSurgeTxByWeek",
    success(data) {
      data[0].chartData.forEach(function (value) {
        label.push(value.weeks);
        TxData.push(value.tx_new);
      });
      //Get the last 4 weeks
      var newWeeklabel = label.slice(-6);
      var newTxData = TxData.slice(-6);
      // Sum up txNew
      TxData.reduce(function (a, b, i) {
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
              label: "# of TX_New Identified",
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
        $(".hts").append(`
					  <tr>
						  <td style="color: white">${xdata[i].state}</td>
						  <td style="color: white"><span style="color:#9ecc9e">${xdata[i].tx_new}</span>/${xdata[i].avg}</td>
						  <td style="color: white"><i class="mdi mdi-arrow-${xdata[i].tx_new / xdata[i].avg > 0.8 ? "up" : "down"}-thick ${xdata[i].tx_new / xdata[i].avg > 0.8 ? "green" : "red"
          }-text"></i></td>
					  </tr>`);
      }

      setInterval(() => {
        last = xdata[xdata.length - 1];
        $($(".hts tr")[0]).remove();
        $(".hts").append(`
			  <tr>
				  <td style="color: white">${last.state}</td>
				  <td style="color: white"><span style="color:#9ecc9e">${last.tx_new}</span>/${last.avg}</td>
				  <td style="color: white"><i class="mdi mdi-arrow-${last.tx_new / last.avg > 0.8 ? "up" : "down"}-thick ${last.tx_new / last.avg > 0.8 ? "green" : "red"
          }-text"></i></td>
			  </tr>`);
        xdata.pop();
        xdata.unshift(last);
      }, 5000);

    }
  });

  setInterval(() => {
    $(".mini_chart").toggle();
  }, 20000);

}

//For Populating HTS Chart 
function getHtsTesting() {
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

      // getStateYieldData();
    }
  });
  /*
  var ids = ["#hts_chart", "#hts_yield_by_state"];
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
      $(ids[index]).show(800);
    }, 1000 * 40); */
}

//htsYield by LGA
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
      //console.log(data);
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