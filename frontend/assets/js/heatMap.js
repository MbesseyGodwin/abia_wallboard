jQuery(document).ready(function($) {    
  $.ajax({
    url: BaseUrl + "GetRiversMapData",
    success: function(returnData) {
      var data = [];
      for(var i = 0; i < returnData.length; i++){        
        var lgaData = [];
        lgaData.push(returnData[i]["lgaName"]);
        lgaData.push(returnData[i]["lgaCount"]);
        data.push(lgaData);
      }
      Highcharts.getJSON("/frontend/assets/data/Rivers_LGA.geojson", function(geojson) {
        // Initiate the chart
        Highcharts.mapChart("container", {
          chart: {
            map: geojson,
            backgroundColor: "#000"
          },
      
          title: {
            text: ""
          },
      
          mapNavigation: {
            enabled: false,
            buttonOptions: {
              verticalAlign: "bottom"
            }
          },
      
          colorAxis: {
            tickPixelInterval: 100
          },
      
          series: [
            {
              data: data,
              keys: ["code_hasc", "value"],
              joinBy: "code_hasc",
              name: "Patient",
              states: {
                hover: {
                  color: "#a4edba"
                }
              },
              dataLabels: {
                enabled: true,
                format: "{point.properties.admin2Name}"
              }
            }
          ]
        });
      });
    }
  });
});

/* var data = [
  ["Akuku-Toru", 500],
  ["Abua/Odual", 631],
  ["Oyigbo", 461],
  ["Ahoada East", 463],
  ["Omuma", 252],
  ["Asari-Toru", 431],
  ["Bonny", 62],
  ["Khana", 41],
  ["Degema", 168],
  ["Ogu/Bolo", 425],
  ["Etche", 4631],
  ["Ahoada West", 4631],
  ["Gokana", 31],
  ["Okrika", 95],
  ["Emuoha", 41],
  ["Eleme", 159],
  ["Andoni", 357],
  ["Opobo/Nkoro", 56],
  ["port harcourt", 456],
  ["Ogba/Egbema/Ndoni", 654],
  ["Obio/Akpor", 321],
  ["Tai", 123],
  ["Ikwerre", 231]
]; */


