am5.ready(function () {

    // Set up data
    var data = [{
        category: "unsuppressed",
        value: 89,
        sliceSettings: {
            fill: am5.color(0xdc4534),
        },
        breakdown: [{
            category: "ab Aba North",
            value: 10,
        }, {
            category: "ab Aba South",
            value: 72,
        }, {
            category: "ab Arochukwu",
            value: 44
        }, {
            category: "ab Bende",
            value: 26
        }, {
            category: "ab Ikwuano",
            value: 18
        }, {
            category: "ab Isiala-Ngwa North",
            value: 40
        },
        {
            category: "ab Isiala-Ngwa South",
            value: 49
        },
        {
            category: "ab Isuikwuato",
            value: 24
        },
        {
            category: "ab Obingwa",
            value: 66
        },
        {
            category: "ab Ohafia",
            value: 38
        },
        {
            category: "ab Osisioma Ngwa",
            value: 30
        },
        {
            category: "ab Ugwunagbo",
            value: 22
        },
        {
            category: "ab Ukwa East",
            value: 44
        },
        {
            category: "ab Ukwa west",
            value: 36
        },
        {
            category: "ab Umu Nneochi",
            value: 38
        },
        {
            category: "ab Umuahia North",
            value: 40
        },

        {
            category: "ab Umuahia South",
            value: 69
        },
        ]
    },

    {
        category: "low viramia",
        value: 71,
        sliceSettings: {
            fill: am5.color(0xd7a700),
        },
        breakdown: [{
            category: "ab Aba North",
            value: 10,
        }, {
            category: "ab Aba South",
            value: 12,
        }, {
            category: "ab Arochukwu",
            value: 14
        }, {
            category: "ab Bende",
            value: 16
        }, {
            category: "ab Ikwuano",
            value: 18
        }, {
            category: "ab Isiala-Ngwa North",
            value: 20
        },
        {
            category: "ab Isiala-Ngwa South",
            value: 22
        },
        {
            category: "ab Isuikwuato",
            value: 24
        },
        {
            category: "ab Obingwa",
            value: 26
        },
        {
            category: "ab Ohafia",
            value: 28
        },
        {
            category: "ab Osisioma Ngwa",
            value: 30
        },
        {
            category: "ab Ugwunagbo",
            value: 32
        },
        {
            category: "ab Ukwa East",
            value: 34
        },
        {
            category: "ab Ukwa west",
            value: 36
        },
        {
            category: "ab Umu Nneochi",
            value: 38
        },
        {
            category: "ab Umuahia North",
            value: 40
        },

        {
            category: "ab Umuahia South",
            value: 42
        },
        ]
    }, {
        category: "viral suppression",
        value: 220,
        sliceSettings: {
            fill: am5.color(0x68ac1a),
        },
        breakdown: [{
            category: "ab Aba North",
            value: 100,
        }, {
            category: "ab Aba South",
            value: 200
        }, {
            category: "ab Arochukwu",
            value: 36
        }, {
            category: "ab Bende",
            value: 34
        }, {
            category: "ab Ikwuano",
            value: 32
        }, {
            category: "ab Isiala-Ngwa North",
            value: 30
        },
        {
            category: "ab Isiala-Ngwa South",
            value: 28
        },
        {
            category: "ab Isuikwuato",
            value: 24
        },
        {
            category: "ab Obingwa",
            value: 26
        },
        {
            category: "ab Ohafia",
            value: 24
        },
        {
            category: "ab Osisioma Ngwa",
            value: 22
        },
        {
            category: "ab Ugwunagbo",
            value: 20
        },
        {
            category: "ab Ukwa East",
            value: 18
        },
        {
            category: "ab Ukwa west",
            value: 16
        },
        {
            category: "ab Umu Nneochi",
            value: 14
        },
        {
            category: "ab Umuahia North",
            value: 12
        },
        {
            category: "ab Umuahia South",
            value: 10
        },
        ]
    }]

    // Create root element
    var root = am5.Root.new("chartdiv");


    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create wrapper container
    var container = root.container.children.push(am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout
    }));

    // Create chart
    var columnChart = container.children.push(am5xy.XYChart.new(root, {
        width: am5.p50,
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
    }));

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.set("fill", "#fff");// make the category labels have white color
    yRenderer.labels.template.set("fontSize", 15);

    var yAxis = columnChart.yAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer
    }));

    yRenderer.grid.template.setAll({
        location: 1
    })

    var xAxis = columnChart.xAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
            strokeOpacity: 1
        })
    }));


    // Add series
    var columnSeries = columnChart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        categoryYField: "category",
    }));

    columnSeries.columns.template.setAll({
        tooltipText: "{categoryY}: {valueX}"
    });


    //series.data.setAll(data);
    // Make stuff animate on load
    columnChart.appear(1000, 100);

    // Column chart
    var pieChart = container.children.push(
        am5percent.PieChart.new(root, {
            width: am5.p50,
            innerRadius: am5.percent(40)
        })
    );

    // Create series
    var pieSeries = pieChart.series.push(
        am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category"
        })
    );

    pieSeries.slices.template.setAll({
        templateField: "sliceSettings",
        strokeOpacity: 0
    });

    var currentSlice;
    pieSeries.slices.template.on("active", function (active, slice) {
        if (currentSlice && currentSlice != slice && active) {
            currentSlice.set("active", false)
        }

        var color = slice.get("fill");

        label1.setAll({
            fill: color,
            text: root.numberFormatter.format(slice.dataItem.get("valuePercentTotal"), "#.'%'")
        });

        label2.set("text", slice.dataItem.get("category"));

        columnSeries.columns.template.setAll({
            fill: slice.get("fill"),
            stroke: slice.get("fill")
        });

        columnSeries.data.setAll(slice.dataItem.dataContext.breakdown);
        yAxis.data.setAll(slice.dataItem.dataContext.breakdown);

        currentSlice = slice;
    });

    pieSeries.labels.template.set("forceHidden", true);
    pieSeries.ticks.template.set("forceHidden", true);

    pieSeries.data.setAll(data);

    // Add label
    var label1 = pieChart.seriesContainer.children.push(am5.Label.new(root, {
        text: "",
        fontSize: 35,
        fontweight: "bold",
        centerX: am5.p50,
        centerY: am5.p50
    }));

    var label2 = pieChart.seriesContainer.children.push(am5.Label.new(root, {
        text: "",
        fill: "#fff", //label color for the pie chart text
        fontSize: 15,
        centerX: am5.p50,
        centerY: am5.p50,
        dy: 30
    }));

    // Pre-select first slice
    pieSeries.events.on("datavalidated", function () {
        pieSeries.slices.getIndex(0).set("active", true);
    });
}); // end am5.ready()

fetch("http://127.0.0.1:8001/api/wallboard/GetStateVlcascade")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const dataART = data[0].onART
        const dataEligible = data[0].vlEligible
        const dataSampleCollected = data[0].sampleCollected
        const dataSampleCollectedPercent = data[0].sampleCollectedPercent

        document.querySelector("[data-art]").textContent = numeral(dataART).format("0,0");
        document.querySelector("[data-eligible]").textContent = numeral(dataEligible).format("0,0");
        document.querySelector("[data-percent-collected]").textContent = `${dataSampleCollectedPercent}%`;
        document.querySelector("[data-sample-collected]").textContent = numeral(dataSampleCollected).format("0,0") + " sample collected";
    });
