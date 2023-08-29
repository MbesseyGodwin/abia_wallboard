am4core.ready(function () {
  am4core.useTheme(am4themes_animated);

  window.onload = function () {
      document.getElementById("chartdivmsg").innerHTML = "Please wait, map is loading...";

      jQuery.getJSON("http://127.0.0.1:8001/api/wallboard/GetAbiaMap", function (geo) {
          var title = "";
          var chart = am4core.create("chartdiv", am4maps.MapChart);
          chart.titles.create().text = title;

          chart.geodataSource.url = "/frontend/assets/data/Abia_map_data.json";

          chart.geodataSource.events.on("parseended", function (ev) {
              var data = [];

              for (var i = 0; i < ev.target.data.features.length; i++) {
                  data.push({
                      id: geo[i].id,
                      lga_name: geo[i].lga_name,
                      vlEligible: geo[i].vlEligible == 0 ? 0 : geo[i].vlEligible,
                      priority: geo[i].priority,
                      tx_curr: geo[i].tx_curr,
                      tx_new: geo[i].tx_new,
                      tx_vls: geo[i].tx_vls,
                      tx_curr_expected: geo[i].tx_curr_expected,
                      vl_total_result: geo[i].vl_total_result,
                      percent_Suppressed: isNaN(Math.round((geo[i].tx_vls / geo[i].vl_total_result) * 100))
                          ? 0
                          : Math.round((geo[i].tx_vls / geo[i].vl_total_result) * 100),
                      expected: geo[i].expected,
                      sampleCollected: geo[i].sampleCollected,
                      percent_sampleCollected: isNaN(Math.round((geo[i].sampleCollected / geo[i].vlEligible) * 100))
                          ? 0
                          : Math.round((geo[i].sampleCollected / geo[i].vlEligible) * 100),
                      facilitiesReported: geo[i].facilityReported,
                      fill: getPriorityColorFill(geo[i].priority),
                  });
              }

              document.getElementById("chartdivmsg").style.display = "none";
              polygonSeries.data = data;
          });

          chart.projection = new am4maps.projections.Mercator();

          polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
          polygonSeries.useGeodata = true;

          var polygonTemplate = polygonSeries.mapPolygons.template;
          polygonTemplate.tooltipHTML = `<center><strong class="text-danger">{lga_name}</strong></center>`;

          polygonTemplate.fill = am4core.color("#212327");

          polygonTemplate.events.on("over", function (event) {
              const dataItem = event.target.dataItem;
              if (dataItem) {
                  updateSummaryTable(dataItem.dataContext);
              }
          });

          var hs = polygonTemplate.states.create("hover");
          hs.properties.fill = "{hoverColor}";
      });
  };
});

var polygonSeries;
var selected;

var fields_ids = [
  // ... LGA IDs ...
  "ABI-ABN", // aba north
  "ABI-ABS", // aba south
  "ABI-ARC", // arochukwu
  "ABI-BEN", // bende
  "ABI-IKW", // ikwuano
  "ABI-ISN", //
  "ABI-ISS", //
  "ABI-ISU", //
  "ABI-OBI", // obi ngwa
  "ABI-OHA", // ohafia
  "ABI-OSI", //
  "ABI-UGW", //
  "ABI-UKE", //
  "ABI-UKW", //
  "ABI-UMN", //
  "ABI-UMS", //
  "ABI-UMU", //
];

var clicked = 0;
setInterval(function () {
  const element = fields_ids[clicked];
  document.getElementById(element).click();
  clicked = (clicked + 1) % fields_ids.length;
}, 50000);

function updateSummaryTable(dataContext) {
  document.getElementById("lga_name").textContent = dataContext.lga_name;
  document.getElementById("facilitiesReported").textContent = dataContext.facilitiesReported;
  document.getElementById("tx_new").textContent = `${dataContext.tx_new}/${dataContext.expected}`;
  document.getElementById("tx_curr").textContent = `${dataContext.tx_curr}/${dataContext.tx_curr_expected}`;
  document.getElementById("vlEligible").textContent = dataContext.vlEligible;
  document.getElementById("sampleCollected").textContent = `${dataContext.sampleCollected} (${dataContext.percent_sampleCollected}%)`;
  document.getElementById("tx_vls").textContent = `${dataContext.tx_vls}/${dataContext.vl_total_result} (${dataContext.percent_Suppressed}%)`;

  const priorityColor = getPriorityColor(dataContext.priority);
  const tableRow = document.getElementById("summaryTable").rows;
  
  for (let i = 0; i < tableRow.length; i++) {
      tableRow[i].style.backgroundColor = priorityColor;
  }

  selected.states.getKey("hover").properties.fill = priorityColor;
}

function getPriorityColorFill(priority) {
  switch (priority) {
      case "red":
          return am4core.color("#9c0505");
      case "green":
          return am4core.color("#A43E");
      case "yellow":
          return am4core.color("#e0dd14");
      default:
          return am4core.color("#212327");
  }
}

function getPriorityColor(priority) {
  switch (priority) {
      case "red":
          return "#9c0505"; // Red color
      case "green":
          return "#A43E"; // Green color
      case "yellow":
          return "#e0dd14"; // Yellow color
      default:
          return ""; // Default color
  }
}

function selectCountry(id) {
  if (selected) {
      selected.isHover = false;
  }
  selected = polygonSeries.getPolygonById(id);
  selected.isHover = true;
  updateSummaryTable(selected.dataItem.dataContext);
}
