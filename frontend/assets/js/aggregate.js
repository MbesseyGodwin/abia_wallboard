// JSON data
var ageData = {
    "FY21": [
        {
            "sector": "Children",
            "size": 11341
        },
        {
            "sector": "Adults",
            "size": 45678
        }
    ],
    "FY22": [
        {
            "sector": "Children",
            "size": 29411
        },
        {
            "sector": "Adults",
            "size": 50223
        }
    ]
};

am5.ready(function () {
    // Create root element
    var root = am5.Root.new("AgeCategoryChart");

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        innerRadius: 100,
        layout: root.verticalLayout
    }));

    // Create series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "size",
        categoryField: "sector",
    }));

    // Set initial data
    var currentYear = "FY21";
    series.data.setAll(ageData[currentYear]);

    // Configure series labels
    series.labels.template.setAll({
        fill: am5.color(0xffffff), // Set label color to white
        fontSize: 25
    });

    // Update size values in HTML
    function updateSizeValues(data) {
        var adultsSizeElem = document.getElementById("adultSize");
        var childrenSizeElem = document.getElementById("childrenSize");

        adultsSizeElem.textContent = data.find(function (d) {
            return d.sector === "Adults";
        }).size;

        childrenSizeElem.textContent = data.find(function (d) {
            return d.sector === "Children";
        }).size;
    }

    // Play initial series animation
    series.appear(1000, 100);

    // Add label
    var label = root.tooltipContainer.children.push(am5.Label.new(root, {
        x: am5.p50,
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50,
        fill: am5.color(0xffffff),
        fontSize: 50
    }));

    // Animate chart data
    function loop() {
        label.set("text", currentYear);
        var data = ageData[currentYear];
        currentYear = currentYear === "FY21" ? "FY22" : "FY21";
        series.data.setAll(data);
        updateSizeValues(data); // Update size values in HTML
        chart.setTimeout(loop, 10000);
    }

    loop();
});







// genderData data
var genderData = {
    "FY21": [
        {
            "sector": "male",
            "size": 21345
        },
        {
            "sector": "female",
            "size": 45678
        }
    ],
    "FY22": [
        {
            "sector": "male",
            "size": 29411
        },
        {
            "sector": "female",
            "size": 50223
        }
    ]
};

am5.ready(function () {
    // Create root element
    var root = am5.Root.new("GenderCategoryChart");

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        innerRadius: 100,
        layout: root.verticalLayout
    }));

    // Create series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "size",
        categoryField: "sector",
    }));

    // Set initial data
    var currentYear = "FY21";
    series.data.setAll(genderData[currentYear]);

    // Configure series labels
    series.labels.template.setAll({
        fill: am5.color(0xffffff), // Set label color to white
        fontSize: 25
    });

    // Update size values in HTML
    function updateSizeValues(data) {
        var maleSizeElem = document.getElementById("maleSize");
        var femaleSizeElem = document.getElementById("femaleSize");

        maleSizeElem.textContent = data.find(function (d) {
            return d.sector === "male";
        }).size;

        femaleSizeElem.textContent = data.find(function (d) {
            return d.sector === "female";
        }).size;
    }

    // Play initial series animation
    series.appear(1000, 100);

    // Add label
    var label = root.tooltipContainer.children.push(am5.Label.new(root, {
        x: am5.p50,
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50,
        fill: am5.color(0xffffff),
        fontSize: 50
    }));

    // Animate chart data
    function loop() {
        label.set("text", currentYear);
        var data = genderData[currentYear];
        currentYear = currentYear === "FY21" ? "FY22" : "FY21";
        series.data.setAll(data);
        updateSizeValues(data); // Update size values in HTML
        chart.setTimeout(loop, 10000);
    }

    loop();
});


var mergedData = {};
// Merge FY21 data
mergedData["FY21"] = genderData["FY21"].concat(ageData["FY21"]);

// Merge FY22 data
mergedData["FY22"] = genderData["FY22"].concat(ageData["FY22"]);

jQuery(document).ready(($) => {
    const generateDataset = (data, index) => {
        const { label, ...weekData } = data[index];
        const filteredData = Object.values(weekData).filter((value) => value !== 0);
        const backgroundColor = index === 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';

        return {
            label: label,
            data: filteredData,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            borderWidth: 1
        };
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/api/wallboard/GetQuarterPosToLinkage');
            const data = await response.json();


            console.log(mergedData);

            const labels = Object.keys(data[0]).filter((key) => key.startsWith('week') && data[0][key] !== 0);
            const datasets = data.map((item, index) => generateDataset(data, index));

            const updatedData = {
                labels: labels,
                datasets: datasets
            };

            const options = {
                scales: {
                    xAxes: [{
                        ticks: {
                            fontColor: "#fff",
                            fontSize: 24,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            fontColor: "#fff",
                            fontSize: 24,
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: "#fff",
                        fontSize: 24,
                    }
                }
            };

            const ctx = $('#AllCategoryChart');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: updatedData,
                options: options,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
});
