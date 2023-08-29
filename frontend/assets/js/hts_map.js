
    am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      window.onload = function() {
      
      /**
       * Pull Map data from the api endpoint
       */
      jQuery.getJSON("https://ndr.shieldnigeriaproject.com/api/surgeWallboard/GetSurgeSummaryOnMap?state=Rivers",function(geo) {
      
        var summaryData = JSON.stringify(geo);
        console.log(summaryData);
        var title = "";
        // Create map instance
        var chart = am4core.create("chartdiv", am4maps.MapChart);
        chart.titles.create().text = title;
      
        // Set map definition
        chart.geodataSource.url = "/data/rivers.json"// + currentMap + ".json";
        chart.geodataSource.events.on("parseended", function(ev) {
            var data = [];
            //var i;
            
          for (var i = 0; i < ev.target.data.features.length; i++) {
            
            var lga_priority = geo[i].priority;
           /*
            switch (lga_priority) {
              case "red":
                data.push({
                      id: geo[i].id,
                      state:geo[i].state,
                      tx_curr:geo[i].tx_curr,
                      tx_new: geo[i].tx_new,
                      tx_vls: geo[i].tx_vls,
                      tx_curr_expected: geo[i].tx_curr_expected,
                      vl_total_result: geo[i].vl_total_result,
                      expected:geo[i].expected,
                      fill: am4core.color("#f51105")
                })
              break
              case "yellow":
                data.push({
                     id: geo[i].id,
                     state:geo[i].state,
                     tx_curr:geo[i].tx_curr,
                     tx_new: geo[i].tx_new,
                     tx_vls: geo[i].tx_vls,
                     tx_curr_expected: geo[i].tx_curr_expected,
                     vl_total_result: geo[i].vl_total_result,
                     expected:geo[i].expected,
                     fill: am4core.color("#faf207")
                })
                break
              default:
                data.push({
                  id: geo[i].id,
                  state:geo[i].state,
                  tx_curr:geo[i].tx_curr,
                  tx_new: geo[i].tx_new,
                  tx_vls: geo[i].tx_vls,
                  tx_curr_expected: geo[i].tx_curr_expected,
                  vl_total_result: geo[i].vl_total_result,
                  expected:geo[i].expected,
                  fill: am4core.color("#1f6103")
                })
               
             }
              */
            /*
             switch (lga_priority) {
              case "red":*/ 

            data.push({
                      id: geo[i].id,
                      state: geo[i].state,
                      vlEligible: geo[i].vlEligible == 0 ? 0 :geo[i].vlEligible,
                      tx_curr:geo[i].tx_curr,
                      tx_new: geo[i].tx_new,
                      tx_vls: geo[i].tx_vls,
                      tx_curr_expected: geo[i].tx_curr_expected,
                      vl_total_result: geo[i].vl_total_result,
                      percent_Suppressed:isNaN(Math.round((geo[i].tx_vls)/(geo[i].vl_total_result)*100)) ? 0 : Math.round((geo[i].tx_vls)/(geo[i].vl_total_result)*100),
                      expected: geo[i].expected,
                      sampleCollected: geo[i].sampleCollected,
                      facilitiesReported: geo[i].facilityReported,
                      fill:am4core.color("#9c0505")
                      
                    }) 
          }
           
          polygonSeries.data = data;
        })
      
        // Set projection
        chart.projection = new am4maps.projections.Mercator();
      
        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      
        // Make map load polygon data (LGA shapes and names) from GeoJSON
        polygonSeries.useGeodata = true;
        // Configure series tooltip
        var polygonTemplate = polygonSeries.mapPolygons.template;
        //polygonTemplate.tooltipText = "{state}"+"\n"+" Reporting Facilities: {facilitiesReported}" +"\n"+"Tx_new: {tx_new}/{expected}"+"\n" + "OnART:  {tx_curr}/{tx_curr_expected}" +"\n"+ "vlEligible: {vlEligible}"+"\n"+"Tx_VLS: {tx_vls}/{vl_total_result}" +"\n"+ "Sample Collected: {sampleCollected}"/*+ "Percentage Supressed: {percent_Suppressed}"*/;
        //polygonTemplate.tooltipHTML = "<div><b>{state}</b><br>Reporting Facilities: {facilitiesReported}<br>Tx_New: {tx_new}/{expected}";
       
        polygonTemplate.tooltipHTML =  `<center><strong>{state}</strong></center>
       <hr />
       <table>
            <tr>
               <th align="left">Reporting Facilities:</th>
               <td>{facilitiesReported}</td>
            </tr>
            <tr>
               <th align="left">Tx_new:</th>
               <td>{tx_new}/{expected}</td>
            </tr>
            <tr>
                <th align="left">OnART:</th>
                <td>{tx_curr}/{tx_curr_expected}</td>
            </tr>
            <tr>
               <th align="left">vlEligible:</th>
               <td>{vlEligible}</td>
            </tr>
            <tr>
                <th align="left">Tx_PVLS:</th>
                <td>{tx_vls}/{vl_total_result} ({percent_Suppressed}%)</td>
          </tr>
          <tr>
               <th align="left">Sample Collected:</th>
               <td>{sampleCollected}</td>
            </tr>
            <tr>
                <th align="left">Percentage Supressed:</th>
                <td>{percent_Suppressed}%</td>
            </tr>
          
      </table>
      <hr />`;

        polygonTemplate.fill = am4core.color("#808080"); // "#25b005"
        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
       //hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5); #a09d9a
        hs.properties.fill =am4core.color("#32CD32")//("#a09d9a")
      });
      
      };
      
      }); // end am4core.ready() 

