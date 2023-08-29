/*Custom script*/

jQuery(document).ready(function($) {
    var arraw = $("#arraw");
    let expected = 6750; // 1689; // 22404; ? the new expected is thevalue from the new ndr endpoint

    setInterval(() => {
      expected = expected - Math.round(Math.random() * 10);
      //$("[data-countdown]").text(numeral(expected).format('0,0'));
    }, Math.round(Math.random() * 10000));
  
    var jsondata;
    /*$.get("http://localhost:2016/api/shield/GetSurgeTxNewModel", function(data, status){
      console.log("Data: " + data + "\nStatus: " + status);
    });*/
  
    $.ajax({
      url: baseUrl + "GetNasarawaSurgeTxNewModel",
      success: function(data){
        i = 0;
        //console.log(data);
        jsondata = data;
        setInterval(() => {
          if (i == data.length) {
            i = 0;
          }
  
          //console.log(data[i]);
          /* data[i].in = data[i].in ==  undefined ? 0 : data[i].in
          data[i].in = data[i].in + Math.round(Math.random() * 100) */
  
          //$("[data-states-countdown] div.col").empty();
          $("[data-state]")
            .text(data[i].state)
            .css({ "border-bottom": `solid 16px ${data[i].priority}` });
          //$("[data-pending]").text(numeral(parseInt(data[i].expected) - parseInt(data[i].in)).format('0,0'));
          $("[data-pending]").text(
            numeral(parseInt(data[i].tx_new)).format("0,0")
          );
          var percent;
          if (data[i].tx_new == 0) {
            $("[data-percentage]").text(numeral(0).format("0"));
            percent = 0;
          } else if (data[i].expected == 0) {
            $("[data-percentage]").text(numeral(data[i].tx_new).format("0"));
            percent = 100;
          } else {
            $("[data-percentage]").text(
              numeral(
                (parseInt(data[i].tx_new) / parseInt(data[i].expected)) * 100
              ).format("0.0")
            );
            percent = (data[i].tx_new / data[i].expected) * 100;
          }
  
          if (percent >= 50.0) {
            arraw.addClass("green-text");
            arraw.addClass("mdi-arrow-up-thick");
            arraw.removeClass("red-text");
            arraw.removeClass("mdi-arrow-down-thick");
            arraw.removeClass("yellow-text");
            //mdi-arrow-up-thick
          } else if (percent == 0){
            arraw.addClass("yellow-text");
            arraw.removeClass("green-text");
            arraw.removeClass("mdi-arrow-up-thick");
            arraw.removeClass("red-text");
            arraw.removeClass("mdi-arrow-down-thick");
          } else {
            arraw.addClass("red-text");
            arraw.addClass("mdi-arrow-down-thick");
            arraw.removeClass("green-text");
            arraw.removeClass("mdi-arrow-up-thick");
            arraw.removeClass("yellow-text");
          }
  
          //console.log(data[i]);
  
          if (i < data.length) {
            i++;
          }
        }, 5000);


        

  
        const sumNew = jsondata.reduce(function(prev, cur) {
          return prev + parseInt(cur.tx_new);
        }, 0);
  
        const sumTarget = jsondata.reduce(function(prev, cur) {
          return prev + parseInt(cur.expected);
        }, 0);

        // $("[data-countdown]").text(numeral(expected - sumNew).format("0,0"));
  
        // fetch data for 
        $.ajax({
          url: baseUrl + "GetSurgeStateTxCurrCount?state=Nasarawa",
          success: function(data){
            $("[data-countdown]").text(numeral(data).format("0,0"));
          }
        });

        $("[currentDate]").text(GetmeDate())
      }
    });
  });
  
  /*
  function GetmeDate() {
    var today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } */
  