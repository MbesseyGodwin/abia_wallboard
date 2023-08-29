am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    
    
    var countryCodes = ["RIV-DG",//Degema
    "RIV-TA",//Tai
    "RIV-AK",//Akuku-Toru
    "RIV-OA",//Obio Akpor
    "RIV-BN",//Bonny
    "RIV-KH",//Khana
    "RIV-OK",//Okrika
    "RIV-ET",//Etche
    "RIV-AO",//Abua
    "RIV-GK",//Gokana
    "RIV-OM",//Omumma
    "RIV-AN",//Andoni
    "RIV-OG",//Ogba
    "RIV-OY",//Oyigbo
    "RIV-OP",//Opobo
    "RIV-AE",//Ahoada-East
    "RIV-AW",//Ahoada-West
    "RIV-OB",//Ogu
    "RIV-PH",//PH
    "RIV-IK",//Ikwerre
    "RIV-AS",//Asari
    "RIV-EL",//Eleme
    "RIV-EM"]
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    
    chart.geodataSource.url = "/frontend/assets/data/Rivers_LGA.JSON"
   /* try {
      //chart.geodata = am4geodata_worldHigh;
     // chart.geodataSource.url = "/frontend/assets/data/Rivers_LGA.JSON"
    }
    catch (e) {
      chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    } */
    
    chart.projection = new am4maps.projections.Mercator();
    chart.padding(10, 20, 10, 20);
    chart.minZoomLevel = 0.9;
    chart.zoomLevel = 0.9;
    chart.maxZoomLevel = 1;
    
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
   // polygonSeries.include = ["AF"];
    
    
    var chart1 = am4core.create("hiddenchartdiv", am4maps.MapChart);
    chart1.padding(10, 20, 10, 20);
  chart1.geodataSource.url = "/frontend/assets/data/Rivers_LGA.JSON";
    
    chart1.projection = new am4maps.projections.Mercator();
    
    var polygonSeries1 = chart1.series.push(new am4maps.MapPolygonSeries());
    polygonSeries1.useGeodata = true;
   // polygonSeries1.include = ["RIV-DG"];
  //polygonSeries1.visible = false;
  
    
    
    var label = chart.chartContainer.createChild(am4core.Label);
    label.x = 100;
    label.y = 100;
    label.fill = am4core.color("#FFFFFF"); //("#000000");
    label.fontSize = 35;
    label.fontWeight = "bold";
    label.text = "{state}";
    label.fillOpacity = 0.2;
    
    var slider = chart.createChild(am4core.Slider);
    slider.padding(0, 15, 0, 60);
    slider.background.padding(0, 15, 0, 60);
    slider.marginBottom = 15;
    slider.valign = "bottom";
    
    var currentIndex = -1;
    var colorset = new am4core.ColorSet();
    
    setInterval(function () {
      var next = slider.start + 1 / countryCodes.length;
      if (next >= 1) {
        next = 0;
      }
      slider.animate({ property: "start", to: next }, 300);
    }, 2000)
    
    slider.events.on("rangechanged", function () {
      changeCountry();
    })
    
    function changeCountry() {
      var totalCountries = countryCodes.length - 1;
      var countryIndex = Math.round(totalCountries * slider.start);
    
      var morphToPolygon;
    
      if (currentIndex != countryIndex) {
        polygonSeries1.data = [];
        polygonSeries1.include = [countryCodes[countryIndex]];
    
        currentIndex = countryIndex;
    
        polygonSeries1.events.once("validated", function () {
    
          morphToPolygon = polygonSeries1.mapPolygons.getIndex(0);
          if(morphToPolygon){
            var countryPolygon = polygonSeries.mapPolygons.getIndex(0);
    
            var morpher = countryPolygon.polygon.morpher;
            var morphAnimation = morpher.morphToPolygon(morphToPolygon.polygon.points);
    
            var colorAnimation = countryPolygon.animate({ "property": "fill", "to": colorset.getIndex(Math.round(Math.random() * 20)) }, 1000);
    
            var animation = label.animate({ property: "y", to: 1000 }, 300);
    
            animation.events.once("animationended", function () {
              label.text = morphToPolygon.dataItem.dataContext["state"];
              label.y = -50;
              label.animate({ property: "y", to: 200 }, 300, am4core.ease.quadOut);
            })
          }
        })
      }
    }
    
    
    });