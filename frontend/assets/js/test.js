function showPieChart(polygon) {
  polygon.polygon.measure();
  var radius = polygon.polygon.measuredWidth / 2 * polygon.globalScale / chart.seriesContainer.scale;
  pieChart.width = radius * 2;
  pieChart.height = radius * 2;
  pieChart.radius = radius;

  var centerPoint = am4core.utils.spritePointToSvg(polygon.polygon.centerPoint, polygon.polygon);
  centerPoint = am4core.utils.svgPointToSprite(centerPoint, chart.seriesContainer);

  pieChart.x = centerPoint.x - radius;
  pieChart.y = centerPoint.y - radius;

  var fill = polygon.fill;
  var desaturated = fill.saturate(0.3);

  for (var i = 0; i < pieSeries.dataItems.length; i++) {
      var dataItem = pieSeries.dataItems.getIndex(i);
      dataItem.value = Math.round(Math.random() * 100);
      dataItem.slice.fill = am4core.color(am4core.colors.interpolate(
          fill.rgb,
          am4core.color("#ffffff").rgb,
          0.2 * i
      ));

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
