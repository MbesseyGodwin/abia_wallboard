/*Custom script*/

jQuery(document).ready(function($) {
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

	                <td>${xdata[i].hts_tst_pos}/${xdata[i].hts_pos_target}<span style="color:#7DCEA0"> <b>(${xdata[i].PositivePercentage}%)</b></span></td>
	                <td>${xdata[i].tx_new}/${xdata[i].expected}<span style="color:#7DCEA0"> <b>(${xdata[i].tx_newPercentage}%)</b></span></td>
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

  // $.ajax({
  //   url: baseUrl + "GetRiversSurgeSummary",
  //   success(data) {
  //     xdata = createNewData(data);
  //     for (i = 0; i < 10; i++) {
  //       $("tbody").append(`
  //               <tr>
  //                 <td>${xdata[i].state}</td>
  //                 <td>${xdata[i].hts_tst}/${xdata[i].hts_tst} <b>(${xdata[i].hts_tst}%)</b></td>
  //                 <td>${xdata[i].hts_tst_pos}/${xdata[i].hts_tst_pos} <b>(${xdata[i].hts_tst_pos}%)</b></td>
  //                 <td>${xdata[i].tx_new}/${xdata[i].expected}<span style="color:#7DCEA0"> <b>(${xdata[i].tx_newPercentage}%)</b></span></td>
  //                 <td>${xdata[i].tx_curr}/${xdata[i].tx_curr_expected}<span style="color:#7DCEA0"><b>(${xdata[i].tx_currPercentage}%)</b></span></td>
  //                 <td>${xdata[i].tx_vls}/${xdata[i].vl_total_result}<span style="color:#7DCEA0"><b>(${xdata[i].pvlsPercentage}%)</b></span></td>

  //               </tr>

  // 			`);
  //     }

  //     setInterval(() => {
  //       $($("tbody tr")[0]).remove();
  //       let last = xdata[xdata.length - 1];
  //       xdata.pop();
  //       xdata.unshift(last);
  //       $("tbody").append(`
  // 	<tr>

  // 	 <td>${last.state}</td>
  //                 <td>${last.hts_tst}/${last.hts_tst} <b>(${last.hts_tst}%)</b></td>
  //                 <td>${last.hts_tst_pos}/${last.hts_tst_pos} <b>(${last.hts_tst_pos}%)</b></td>
  //                 <td>${last.tx_new}/${last.expected}<span style="color:#7DCEA0"> <b>(${last.tx_newPercentage}%)</b></span></td>
  //                 <td>${last.tx_curr}/${last.tx_curr_expected}<span style="color:#7DCEA0"><b>(${last.tx_currPercentage}%)</b></span></td>
  //                 <td>${last.tx_vls}/${last.vl_total_result}<span style="color:#7DCEA0"><b>(${last.pvlsPercentage}%)</b></span></td>

  // 	</tr>

  //   `);
  //     }, 5000);
  //   }
  // });
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
  /* setInterval(() => {
    $($("tbody tr")[0]).remove();
    let last = xdata[xdata.length - 1];
    xdata.pop();
    xdata.unshift(last);
    $("tbody").append(`
          <tr>
            <td>${last.state}</td>
            <td class='${last.priority}'></td>
            <td>${last.expected}</td>
            <td>${last.tx_new}/<b>${last.tx_new}</b> (${last.tx_new}%)</td>
            <td>${last.expected}</td>
            <td>${last.expected}</td>
            <td>${last.expected}</td>
            <td>${last.tx_new}</td>
            <td><i class="mdi mdi-arrow-${
              last.tx_new > 9 ? "up" : "down"
            }-thick"></i></td>
          </tr>

		`);
  }, 5000); */
});
