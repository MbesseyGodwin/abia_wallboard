/*Custom script*/ 
/*
jQuery(document).ready(function($){
	let art = parseInt($('[data-art]').text().replace(/,/g, ''));
	let eligible = parseInt($('[data-eligible]').text().replace(/,/g, ''));
	$("[data-cent-eligible]").text(numeral((eligible/art)*100).format('0,0.0') + '%');

	let collected = parseInt($('[data-collected]').text().replace(/,/g, ''));
	$("[data-cent-collected]").text(numeral((collected/eligible)*100).format('0,0.0') + '%');

	let tested = parseInt($('[data-tested]').text().replace(/,/g, ''));
	$("[data-cent-tested]").text(numeral((tested/collected)*100).format('0,0.0') + '%');

	let supressed = parseInt($('[data-supressed]').text().replace(/,/g, ''));
	$("[data-cent-supressed]").text(numeral((supressed/tested)*100).format('0,0.0') + '%');

	$("[data-due]").text(numeral(eligible-collected).format('0,0'));

}); */

/*Custom script*/

jQuery(document).ready(function($) {
	var jsondata;
	/*$.get("http://localhost:2016/api/shield/GetSurgeTxNewModel", function(data, status){
	  console.log("Data: " + data + "\nStatus: " + status);
	});*/
  
	$.ajax({
	    url: baseUrl + "GetSurgeVLStatistics?state=Nasarawa",
		  //url:"http://localhost:51156/api/shield/GetRiversSurgeVLStatistics",
	    success: function(data){
		  i = 0;
		  console.log(data);
      // var jsondata = JSON.parse(data);
      jsondata = data;
      //$('#data-art').text(jsonData["onART"]);
		  $("[data-art]")
				.text(jsondata[i].onART)
		  $("[data-cent-eligible]")
        .text(jsondata[i].EligiblePercent + "%") 
		  $("[data-eligible]")
        //.text(jsondata[i].Eligible + "\n Eligible")
        .text(jsondata[i].vlEligible) 
		  $("[data-tested]")
				.text(jsondata[i].vlResult)
		  $("[data-cent-tested]")
				.text(jsondata[i].vlResultPercentage == 0 ? '---' : jsondata[i].vlResultPercentage + "%") 
		  $("[data-supressed]")
				.text(jsondata[i].supression )
		  $("[data-cent-supressed]")
				.text(jsondata[i].supressionPercent + "%")
		  $("[data-collected]")
				.text(jsondata[i].sampleCollected == 0 ? '---' : jsondata[i].sampleCollected)
	    $("[data-cent-collected]")
				.text(jsondata[i].sampleCollectedPercent == 0 ? '---' : jsondata[i].sampleCollectedPercent+ "%") 
		  /*$("[data-due]")
				.text(jsondata[i].VLDue) */
		  /*
		  $("[data-cent-result]")
				.text(jsondata[i].SampleCollectedPercent)
		   $("[data-result]")
				.text(jsondata[i].VLResult) */
	    //Disabled for ICAP Visit	fetchSurgeSummary();
	  }
	});
});
  
/* Disabled for ICAP Visit
var ids = //["#vl_summary_page", "#surge_summary_page"];
        ["#vl_summary_page"];
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
      }, 1000 * 40);
  

  function fetchSurgeSummary(){
	let xdata;
  let htsdata;

  $.ajax({
    url: htsBaseUrl + "GetSurgeSummary",
    success(data) {
      htsdata = data;
      $.ajax({
        url: baseUrl + "GetRiversSurgeSummary",
        success(data) {
          xdata = createNewData(data, htsdata);
          for (i = 0; i < 10; i++) {
            $("tbody").append(`
	              <tr>
	                <td>${xdata[i].state}</td>	             
                 
                 <td>${xdata[i].hts_tst}/${xdata[i].hst_target}<span style="color:#7DCEA0"> <b>(${xdata[i].TestedPercentage}%)</b></span></td>

	                <td>${xdata[i].hts_tst_pos}/${xdata[i].hts_pos_target}<span style="color:#7DCEA0"> <b>(${xdata[i].PositivePercentage}%)</b></span></td> 	                <td>${xdata[i].tx_new}/${xdata[i].expected}<span style="color:#7DCEA0"> <b>(${xdata[i].tx_newPercentage}%)</b></span></td>
	                <td>${xdata[i].tx_curr}/${xdata[i].tx_curr_expected}<span style="color:#7DCEA0"><b>(${xdata[i].tx_currPercentage}%)</b></span></td>
	                <td>${xdata[i].tx_vls}/${xdata[i].vl_total_result}<span style="color:#7DCEA0"><b>(${xdata[i].pvlsPercentage}%)</b></span></td>
	               
	              </tr>

				`);
          }

          setInterval(() => {
            $($("tbody tr")[0]).remove();
            let last = xdata[xdata.length - 1];
            xdata.pop();
            xdata.unshift(last);
            $("tbody").append(`
		<tr>
		 
		 <td>${last.state}</td>	             
	                <td>${last.hts_tst}/${last.hst_target}<span style="color:#7DCEA0"> <b>(${last.TestedPercentage}%)</b></span></td>
	                <td>${last.hts_tst_pos}/${last.hts_pos_target} <span style="color:#7DCEA0"><b>(${last.PositivePercentage}%)</b></span></td>
	                <td>${last.tx_new}/${last.expected}<span style="color:#7DCEA0"> <b>(${last.tx_newPercentage}%)</b></span></td>
	                <td>${last.tx_curr}/${last.tx_curr_expected}<span style="color:#7DCEA0"><b>(${last.tx_currPercentage}%)</b></span></td>
	                <td>${last.tx_vls}/${last.vl_total_result}<span style="color:#7DCEA0"><b>(${last.pvlsPercentage}%)</b></span></td>
	               
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
  } */