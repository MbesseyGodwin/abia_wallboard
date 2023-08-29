var polygonSeries;
var selected;
am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  window.onload = function () {

    /**
     * Pull Map data from the api endpoint
     */
    jQuery.getJSON("https://ndr.shieldnigeriaproject.com/api/surgeWallboard/GetNasarawaSurgeSummaryOnMap", function (geo) {
    // jQuery.getJSON("http://localhost:54249/api/surgeWallboard/GetNasarawaSurgeSummaryOnMap", function (geo) {
      var summaryData = JSON.stringify(geo);
      console.log(summaryData);
      var title = "";
      // Create map instance
      var chart = am4core.create("chartdiv", am4maps.MapChart);
      chart.titles.create().text = title;

      // Set map definition
      chart.geodataSource.url = "/frontend/assets/data/nasarawa_lga.JSON"// + currentMap + ".json";
      chart.geodataSource.events.on("parseended", function (ev) {
        var data = [];
        //var i;

        for (var i = 0; i < ev.target.data.features.length; i++) {

          var lga_priority = geo[i].priority;
          data.push({
            id: geo[i].id,
            state: geo[i].state,
            vlEligible: geo[i].vlEligible == 0 ? 0 : geo[i].vlEligible,
            tx_curr: geo[i].tx_curr,
            tx_new: geo[i].tx_new,
            tx_vls: geo[i].tx_vls,
            tx_curr_expected: geo[i].tx_curr_expected,
            vl_total_result: geo[i].vl_total_result,
            percent_Suppressed: isNaN(Math.round((geo[i].tx_vls) / (geo[i].vl_total_result) * 100)) ? 0 : Math.round((geo[i].tx_vls) / (geo[i].vl_total_result) * 100),
            expected: geo[i].expected,
            sampleCollected: geo[i].sampleCollected,
            percent_sampleCollected: isNaN(Math.round((geo[i].sampleCollected)/(geo[i].vlEligible)*100)) ? 0 : Math.round((geo[i].sampleCollected)/(geo[i].vlEligible)*100) ,
            facilitiesReported: geo[i].facilityReported,
            fill: am4core.color("#9c0505")

          })
        }

        polygonSeries.data = data;

      })

      // Set projection
      chart.projection = new am4maps.projections.Mercator();

      // Create map polygon series
      polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

      // Make map load polygon data (LGA shapes and names) from GeoJSON
      polygonSeries.useGeodata = true;
      // Configure series tooltip
      var polygonTemplate = polygonSeries.mapPolygons.template;
     // polygonTemplate.pointerOrientation = "vertical";
     // polygonTemplate.tooltipPosition = "fixed";

      polygonTemplate.tooltipHTML =  `<center><strong>{state}</strong></center>
      <hr />
      <table>
           <tr>
              <th align="left">Reporting Facilities:</th>
              <td  font-weight: bold;> {facilitiesReported}</td>
           </tr>
           <tr>
              <th align="left">Tx_new:</th>
              <td font-weight: bold;>{tx_new}/{expected}</td>
           </tr>
           <tr>
               <th align="left">OnART:</th>
               <td font-weight: bold;>{tx_curr}/{tx_curr_expected}</td>
           </tr>
           <tr>
              <th align="left">Eligible for Viral Load:</th>
              <td>{vlEligible} </td>
           </tr>
           
         <tr>
              <th align="left">Sample Collected:</th>
              <td>{sampleCollected} ({percent_sampleCollected}%)</td>
           </tr>
           <tr>
               <th align="left">Tx_PVLS:</th>
               <td>{tx_vls}/{vl_total_result} ({percent_Suppressed}%)</td>
         </tr>
          
         
     </table>
     <hr />`;

      polygonTemplate.fill = am4core.color("#212327")   //("#808080") Grey; // "#25b005"
      polygonTemplate.events.on("over", function (ev) {
        if (ev.target != selected) {
          selected.isHover = false;
        }

        // This is needed so that "unhovering" previous polygon does not hide tooltip
        ev.target.isHover = false;
        ev.target.isHover = true;
      });
      // Create hover state and set alternative fill color
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#32CD32")//Green Color


    });

  };

}); // end am4core.ready() 

function selectCountry(id) {
  if (selected) {
    selected.isHover = false;
  }
  selected = polygonSeries.getPolygonById(id);
  selected.isHover = true;
}

var fields_ids =[
  "NAS-TT",//Toto
  "NAS-NE",//Nasarawa-Eggon
  "NAS-KE",//Keana
  "NAS-NS",//Nasarawa
  "NAS-AW",//Awe
  "NAS-KF",//Keffi
  "NAS-OB",//Obi
  "NAS-AK",//Akwanga
  "NAS-KA",//Karu
  "NAS-KK",//Kokona
  "NAS-LA",//Lafia
  "NAS-DO",//Doma
  "NAS-WB"];//Wamba
var clicked = 0;
setInterval(function () {
  const element = fields_ids[clicked];
  document.getElementById(element).click();
  if (clicked == fields_ids.length - 1)
    clicked = 0;
  else
    clicked = clicked + 1;
  return;
}, 20000); 