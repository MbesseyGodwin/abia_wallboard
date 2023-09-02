// Initialize the amCharts theme
am4core.useTheme(am4themes_animated);

// Create a map chart
var chart = am4core.create("chartdiv", am4maps.MapChart);

try {
  // Load world map geodata
  chart.geodata = am4geodata_worldHigh;
} catch (e) {
  // Handle errors when geodata cannot be loaded
  chart.raiseCriticalError(new Error("Map geodata could not be loaded."));
}

// Set the map projection to Mercator
chart.projection = new am4maps.projections.Mercator();

// Add an event listener to zoom out on background click
chart.chartContainer.background.events.on("hit", function () {
  zoomOut();
});

// Define a color set for map polygons
var colorSet = new am4core.ColorSet();
var morphedPolygon;

// Create a map polygon series for countries
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;

// Specify the tooltip text for countries
polygonSeries.mapPolygons.template.tooltipText = "{name}";

// Define the countries to include
polygonSeries.include = [
  "ABI-ABN",
  "ABI-ABS",
  "ABI-ARC",
  "ABI-BEN",
  "ABI-IKW",
  "ABI-ISN",
  "ABI-ISS",
  "ABI-ISU",
  "ABI-OBI",
  "ABI-OHA",
  "ABI-OSI",
  "ABI-UGW",
  "ABI-UKE",
  "ABI-UKW",
  "ABI-UMN",
  "ABI-UMS",
  "ABI-UMU",
];

// Customize the appearance and behavior of countries
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.strokeOpacity = 1;
polygonTemplate.stroke = am4core.color("#ffffff");
polygonTemplate.fillOpacity = 1;
polygonTemplate.tooltipText = "{name}";

// Assign a single fill color to all countries
// from here i will be able to add dynamic colors to each lga based on a condition
polygonTemplate.fill = am4core.color("#14e519");


// Define the HTML template for tooltips
polygonTemplate.tooltipHTML = `<h1 class="text-light text-uppercase">{name}</h1>`;

// Apply a desaturate filter to countries
var desaturateFilter = new am4core.DesaturateFilter();
desaturateFilter.saturation = 1;
polygonTemplate.filters.push(desaturateFilter);

// Set a custom fill color for countries
polygonTemplate.adapter.fill = "#dcaf67";

// Assign colors from the color set to countries
// polygonTemplate.adapter.add("fill", function (fill, target) {
//   return colorSet.getIndex(target.dataItem.index + 1);
// });

// Set fill opacity to 1 when hovered
var hoverState = polygonTemplate.states.create("hover");
hoverState.properties.fillOpacity = 1;

// Handle click events on countries
polygonTemplate.events.on("hit", function (event) {
  event.target.zIndex = 1000000;
  selectPolygon(event.target);
});

// Create a pie chart
var pieChart = chart.seriesContainer.createChild(am4charts.PieChart);
pieChart.width = 100;
pieChart.height = 100;
pieChart.hidden = true;

// Set minimum width and height for the pie chart container
pieChart.chartContainer.minHeight = 1;
pieChart.chartContainer.minWidth = 1;

// Define data for the pie chart
var pieSeries = pieChart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "value";
pieSeries.dataFields.category = "category";
pieSeries.data = [
  { value: 100, category: "Retention" },
  { value: 20, category: "Dead" },
  { value: 10, category: "IIT" },
  { value: 50, category: "Discontinued" },
];

// Set inner radius for the pie chart
pieSeries.innerRadius = am4core.percent(30);

// Add a drop shadow filter to the pie chart
var dropShadowFilter = new am4core.DropShadowFilter();
dropShadowFilter.blur = 4;
pieSeries.filters.push(dropShadowFilter);

// Customize the appearance of pie slices
var sliceTemplate = pieSeries.slices.template;
sliceTemplate.fillOpacity = 1;
sliceTemplate.strokeOpacity = 0;

// Define properties for the active state of pie slices
var activeState = sliceTemplate.states.getKey("active");
activeState.properties.shiftRadius = 0;

// Define properties for the hover state of pie slices
var sliceHoverState = sliceTemplate.states.getKey("hover");
sliceHoverState.properties.shiftRadius = 0;

// Disable default pie chart animation
var hiddenState = pieSeries.hiddenState;
hiddenState.properties.startAngle = pieSeries.startAngle;
hiddenState.properties.endAngle = pieSeries.endAngle;
hiddenState.properties.opacity = 0;
hiddenState.properties.visible = false;

// Customize series labels for the pie chart
var labelTemplate = pieSeries.labels.template;
labelTemplate.nonScaling = true;
labelTemplate.fill = am4core.color("#FFFFFF");
labelTemplate.fontSize = 20;
labelTemplate.background = new am4core.RoundedRectangle();
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(4, 9, 4, 9);
labelTemplate.background.fill = am4core.color("#7678a0");

// Set a faster transition duration for hiding pie series
pieSeries.hiddenState.transitionDuration = 200;

// Create a label for country selection
var countryLabel = chart.chartContainer.createChild(am4core.Label);
countryLabel.text = "ABIA STATE";
countryLabel.fill = am4core.color("#7678a0");
countryLabel.fontSize = 50;

countryLabel.hiddenState.properties.dy = 1000;
countryLabel.defaultState.properties.dy = 0;
countryLabel.valign = "middle";
countryLabel.align = "right";
countryLabel.paddingRight = 50;
countryLabel.hide(0);
countryLabel.show();

// Function to select a polygon (country)
function selectPolygon(polygon) {
  if (morphedPolygon != polygon) {
    var animation = pieSeries.hide();
    if (animation) {
      animation.events.on("animationended", function () {
        morphToCircle(polygon);
      });
    } else {
      morphToCircle(polygon);
    }
  }
}

// Function to fade out all countries except the selected one
function fadeOut(exceptPolygon) {
  for (var i = 0; i < polygonSeries.mapPolygons.length; i++) {
    var polygon = polygonSeries.mapPolygons.getIndex(i);
    if (polygon != exceptPolygon) {
      polygon.defaultState.properties.fillOpacity = 0.5;
      polygon.animate(
        [
          { property: "fillOpacity", to: 0.5 },
          { property: "strokeOpacity", to: 1 },
        ],
        polygon.polygon.morpher.morphDuration
      );
    }
  }
}

// Function to zoom out and reset
function zoomOut() {
  if (morphedPolygon) {
    pieSeries.hide();
    morphBack();
    fadeOut();
    countryLabel.hide();
    morphedPolygon = undefined;
  }
}

// Function to morph back to the original polygon shape
function morphBack() {
  if (morphedPolygon) {
    morphedPolygon.polygon.morpher.morphBack();
    var dsf = morphedPolygon.filters.getIndex(0);
    dsf.animate(
      { property: "saturation", to: 1 },
      morphedPolygon.polygon.morpher.morphDuration
    );
  }
}

// Function to morph the polygon into a circle
function morphToCircle(polygon) {
  var animationDuration = polygon.polygon.morpher.morphDuration;
  // If there is a country already morphed to a circle, morph it back
  morphBack();
  // Morph the polygon to a circle
  polygon.toFront();
  polygon.polygon.morpher.morphToSingle = true;
  var morphAnimation = polygon.polygon.morpher.morphToCircle();

  polygon.strokeOpacity = 0; // Hide stroke for lines not to cross countries

  polygon.defaultState.properties.fillOpacity = 1;
  polygon.animate({ property: "fillOpacity", to: 1 }, animationDuration);

  // Animate the desaturate filter
  var filter = polygon.filters.getIndex(0);
  filter.animate({ property: "saturation", to: 1 }, animationDuration);

  // Save the currently morphed polygon
  morphedPolygon = polygon;

  // Fade out all other polygons
  fadeOut(polygon);

  // Hide the country label
  countryLabel.hide();

  if (morphAnimation) {
    morphAnimation.events.on("animationended", function () {
      zoomToCountry(polygon);
    });
  } else {
    zoomToCountry(polygon);
  }
}

// Function to zoom to the selected country
function zoomToCountry(polygon) {
  var zoomAnimation = chart.zoomToMapObject(polygon, 2.5, true);
  if (zoomAnimation) {
    zoomAnimation.events.on("animationended", function () {
      showPieChart(polygon);
    });
  } else {
    showPieChart(polygon);
  }
}

// Function to show the pie chart for the selected country
function showPieChart(polygon) {
  polygon.polygon.measure();
  var radius =
    ((polygon.polygon.measuredWidth / 2) * polygon.globalScale) /
    chart.seriesContainer.scale;
  pieChart.width = radius * 2;
  pieChart.height = radius * 2;
  pieChart.radius = radius;

  var centerPoint = am4core.utils.spritePointToSvg(
    polygon.polygon.centerPoint,
    polygon.polygon
  );
  centerPoint = am4core.utils.svgPointToSprite(
    centerPoint,
    chart.seriesContainer
  );

  pieChart.x = centerPoint.x - radius;
  pieChart.y = centerPoint.y - radius;

  var fill = polygon.fill;
  var desaturated = fill.saturate(0.3);

  for (var i = 0; i < pieSeries.dataItems.length; i++) {
    var dataItem = pieSeries.dataItems.getIndex(i);
    dataItem.value = Math.round(Math.random() * 100);
    dataItem.slice.fill = am4core.color(
      am4core.colors.interpolate(
        fill.rgb,
        am4core.color("#ffffff").rgb,
        0.2 * i
      )
    );

    // Background color for the indicator labels
    dataItem.label.background.fill = desaturated;
    dataItem.tick.stroke = fill;
  }

  pieSeries.show();
  pieChart.show();

  countryLabel.text = "{name}";
  countryLabel.dataItem = polygon.dataItem;
  countryLabel.fill = desaturated;
  countryLabel.show();
}


// ... (previous code)

// Specify the time interval (in milliseconds) between country morphs
var morphInterval = 10000; // 10 seconds

// Create an array of country codes to cycle through
var countriesToMorph = [
  "ABI-ABN",
  "ABI-ABS",
  "ABI-ARC",
  "ABI-BEN",
  "ABI-IKW",
  "ABI-ISN",
  "ABI-ISS",
  "ABI-ISU",
  "ABI-OBI",
  "ABI-OHA",
  "ABI-OSI",
  "ABI-UGW",
  "ABI-UKE",
  "ABI-UKW",
  "ABI-UMN",
  "ABI-UMS",
  "ABI-UMU",
];

// Initialize the index for cycling through countries
var currentCountryIndex = 0;

// Function to automatically morph to the next country
function autoMorphToNextCountry() {
  var nextCountryCode = countriesToMorph[currentCountryIndex];
  var nextPolygon = polygonSeries.getPolygonById(nextCountryCode);

  if (nextPolygon) {
    // Zoom out to showcase the current country's full size (change the zoom level to 0.0)
    chart.zoomToMapObject(nextPolygon, 0.0, true);

    // Delay the morphing to allow time for zooming out
    setTimeout(function () {
      selectPolygon(nextPolygon);

      // Increment the index and wrap around if needed
      currentCountryIndex = (currentCountryIndex + 1) % countriesToMorph.length;
    }, 2000); // Delay for 2 seconds (adjust as needed)
  }
}

// Start the automatic morphing loop
setInterval(autoMorphToNextCountry, morphInterval);

// ... (rest of the code)

