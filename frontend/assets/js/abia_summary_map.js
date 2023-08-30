// Wait for the AMCharts core to be ready and set up the theme
am4core.ready(function () {
  am4core.useTheme(am4themes_animated);

  // this code below will set up when the window loads
  window.onload = function () {
    // Display a loading message while waiting for the map to render
    document.getElementById("chartdivmsg").innerHTML = "Please wait, map is loading...";

    // Fetch geographic data (our abia map data) from a JSON API
    jQuery.getJSON(
      "http://127.0.0.1:8001/api/wallboard/GetAbiaMap",
      function (geo) {
        // Create the map chart
        let chart = am4core.create("chartdiv", am4maps.MapChart);
        let title = "";
        chart.titles.create().text = title;

        // Set up the geodata source (from the the abia_geojson file)
        chart.geodataSource.url = "/frontend/assets/data/Abia_map_data.json";

        // Event triggered when geodata parsing is completed
        chart.geodataSource.events.on("parseended", function (ev) {
          let data = [];

          // Loop through the geodata and create a processed data array
          for (let i = 0; i < ev.target.data.features.length; i++) {
            data.push({
              // Extract and organize data properties
              id: geo[i].id,
              lga_name: geo[i].lga_name,
              vlEligible: geo[i].vlEligible == 0 ? 0 : geo[i].vlEligible,
              priority: geo[i].priority,
              tx_curr: geo[i].tx_curr,
              tx_new: geo[i].tx_new,
              tx_vls: geo[i].tx_vls,
              tx_curr_expected: geo[i].tx_curr_expected,
              vl_total_result: geo[i].vl_total_result,
              percent_Suppressed: isNaN(
                Math.round((geo[i].tx_vls / geo[i].vl_total_result) * 100)
              )
                ? 0
                : Math.round((geo[i].tx_vls / geo[i].vl_total_result) * 100),
              expected: geo[i].expected,
              sampleCollected: geo[i].sampleCollected,
              percent_sampleCollected: isNaN(
                Math.round((geo[i].sampleCollected / geo[i].vlEligible) * 100)
              )
                ? 0
                : Math.round(
                    (geo[i].sampleCollected / geo[i].vlEligible) * 100
                  ),
              facilitiesReported: geo[i].facilityReported,
              fill: getPriorityColorFill(geo[i].priority),
            });
          }

          // Hide loading message and update the map's polygon series data
          document.getElementById("chartdivmsg").style.display = "none";
          polygonSeries.data = data;
        });

        // Set the map's projection
        chart.projection = new am4maps.projections.Mercator();

        // Create a polygon series for the map
        polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;

        // Configure the polygon template and its interactions
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipHTML = `<h2 class="text-light">{lga_name}</h2>`;
        polygonTemplate.fill = am4core.color("#212327");

        // Event triggered when hovering over a map polygon
        polygonTemplate.events.on("over", function (event) {
          const dataItem = event.target.dataItem;
          if (dataItem) {
            updateSummaryTable(dataItem.dataContext);
          }
        });

        // Define hover state properties
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = "{hoverColor}";
      }
    );
  };
});

// Define global variables
let polygonSeries; // Stores the map's polygon series
let selected; // Stores the currently selected polygon (map area)

// Array of field IDs corresponding to different map areas LGA IDs and their corresponding lga names
let fields_ids = [
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

// Counter to cycle through field IDs and simulate clicks
let clicked = 0;
// Simulate a click on map areas in a cyclic manner at intervals of 5 seconds (for now)
setInterval(function () {
  const element = fields_ids[clicked];
  document.getElementById(element).click(); // Simulate a click event
  clicked = (clicked + 1) % fields_ids.length; // Move to the next element
}, 5000);

// Function to update the summary table with data from the selected map area
function updateSummaryTable(dataContext) {
  if (selected) {
    // Update various elements in the summary table with relevant data
    document.getElementById("lga_name").textContent = `Summary for: ${dataContext.lga_name}`;
    document.getElementById("facilitiesReported").textContent = dataContext.facilitiesReported;

    // Update Tx_new element with arrow icons based on priority
const txNewElement = document.getElementById("tx_new");

if (dataContext.priority === "red") {
  txNewElement.innerHTML = `${dataContext.tx_new}/${dataContext.expected} <i class="text-danger fa-solid fa-arrow-up"></i>`;
} else if (dataContext.priority === "green") {
  txNewElement.innerHTML = `${dataContext.tx_new}/${dataContext.expected} <i class="text-success fa-solid fa-arrow-up"></i>`;
} else {
  txNewElement.innerHTML = `${dataContext.tx_new}/${dataContext.expected} <i class="text-warning fa-solid fa-arrow-up"></i>`;
}



    // document.getElementById("tx_new").textContent = `${dataContext.tx_new}/${dataContext.expected}`;


    document.getElementById("tx_curr").textContent = `${dataContext.tx_curr}/${dataContext.tx_curr_expected}`;
    document.getElementById("vlEligible").textContent = dataContext.vlEligible;
    document.getElementById("sampleCollected").textContent = `${dataContext.sampleCollected} (${dataContext.percent_sampleCollected}%)`;
    document.getElementById("tx_vls").textContent = `${dataContext.tx_vls}/${dataContext.vl_total_result} (${dataContext.percent_Suppressed}%)`;

    // Get the priority color based on the selected map area's priority
    const priorityColor = getPriorityColor(dataContext.priority);

    // Update the background color of rows in the summary table
    const tableRow = document.getElementById("summaryTable").rows;
    for (let i = 0; i < tableRow.length; i++) {
      // tableRow[i].style.backgroundColor = priorityColor;
      tableRow[i].style.backgroundColor = "#000000";
    }

    // Change the fill color for the selected map area when hovered
    if (selected.states) {
      selected.states.getKey("hover").properties.fill = priorityColor;
    }
  }
}

// Function to get the fill color based on priority for map areas
function getPriorityColorFill(priority) {
  switch (priority) {
    case "red":
      return am4core.color("#9c0505"); // Red color
    case "green":
      return am4core.color("#165712"); // Green color
    case "yellow":
      return am4core.color("#AD9F00"); // Yellow color
    default:
      return am4core.color("#212327"); // Default color
  }
}

// Function to get the text color based on priority for map areas
function getPriorityColor(priority) {
  switch (priority) {
    case "red":
      return "#9c0505"; // Red color
    case "green":
      return "#165712"; // Green color
    case "yellow":
      return "#AD9F00"; // Yellow color
    default:
      return "#fffff"; // Default color
  }
}

// Function to select a country (map area) and update its details
function selectCountry(id) {
  if (selected) {
    selected.isHover = false; // Disable hover state for the previously selected polygon
    selected.tooltip.hide(); // Hide the tooltip for the previously selected polygon
  }
  selected = polygonSeries.getPolygonById(id); // Get the selected polygon by its ID
  selected.isHover = true; // Enable hover state for the selected polygon
  updateSummaryTable(selected.dataItem.dataContext); // Update the summary table with selected polygon's data
}
