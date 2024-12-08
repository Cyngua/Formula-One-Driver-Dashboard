function createGlobalMap() {
    let w = 1200;
    let h = 600;
    let margin = {top: 40, right: 20, bottom: 5, left: 80}
    //Define map projection
    let projection = d3.geoEquirectangular()
                            .translate([w/2+margin.left, h/2+margin.top])
                            .scale([180]);
    let path = d3.geoPath()
                .projection(projection);
    let svg = d3.select("#plot1-canvas")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    let rowConverter = (d) => {
        return {
            name: d.Driver,
            decade: +d.Decade,
            nation: d.Nationality,
            champion: d.Champion,
        };
    };
    d3.csv("../data/F1_driver_dataset.csv", rowConverter).then( (data)=> {
        console.log(data);
        const driversByNation = {}; //this should be a list, the data should be like {nation:, count:}
        const championsByNation = {};
        
        // count drivers for each nationality
        data.forEach(d => {
            // special cases
            if (d.nation == "BelgiumÂ France") {
                driversByNation["Belgium"] = (driversByNation["Belgium"] || 0) + 1;
                driversByNation["France"] = (driversByNation["France"] || 0) + 1;
            }
            else if (d.nation == "East Germany" || d.nation == "East Germany, West Germany" || d.nation == "West Germany"){
                driversByNation["Germany"] = (driversByNation["Germany"] || 0) + 1;
            }
            else if (d.nation == "MonacoÂ Netherlands"){
                driversByNation["Monaco"] = (driversByNation["Monaco"] || 0) + 1;
                driversByNation["Netherlands"] = (driversByNation["Netherlands"] || 0) + 1;
            }
            else if (d.nation == "Rhodesia and Nyasaland"){
                driversByNation["Rhodesia"] = (driversByNation["Rhodesia"] || 0) + 1;
                driversByNation["Nyasaland"] = (driversByNation["Nyasaland"] || 0) + 1;
            }
            else if (d.nation == "United States"){
                driversByNation["United States of America"] = (driversByNation["United States of America"] || 0) + 1;
            }
            else {
                driversByNation[d.nation] = (driversByNation[d.nation] || 0) + 1;
            }
            if (d.champion == "True") {
                championsByNation[d.nation] = (championsByNation[d.nation] || 0) + 1;
            }
        });
        const driversByNationRows = Object.entries(driversByNation).map(([nation, count]) => ({ nation, count }));
        const championsByNationRows = Object.entries(championsByNation).map(([nation, count]) => ({ nation, count }));
        console.log(driversByNationRows);
        console.log(championsByNationRows);

        let color = d3.scaleThreshold()
                    .domain([10, 20, 50])
                    .range(["#ecd9d9", "#cc9999", "#ac5959", "#800000"]);

        //Load in GeoJSON data
        d3.json("../data/globe.json").then ((json) => {
            //Find the corresponding country inside the GeoJSON
            for (let j = 0; j < json.features.length; j++) {
                let jsonCountry = json.features[j].properties.name;

                for (let i = 0; i < driversByNationRows.length; i++) {
                    let dataCountry = driversByNationRows[i].nation;
                    let dataValue = driversByNationRows[i].count;
                    // json.features[j].properties.value = 0;
    
                    if (dataCountry == jsonCountry) {
                        // overwrite the value with the count
                        json.features[j].properties.value = dataValue;
                        //Stop looking through the JSON
                        break;
                    }
                }		
            }

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", (d)=> {
                    //Get data value
                    let value = d.properties.value;
                    
                    if (value) {
                        //If value exists…
                        return color(value);
                    } else {
                        //If value is undefined…
                        return "lightgrey";
                    }
                })
                .on("mouseenter", function(event,d) { // start code from lecture 9
                    const [xPosition, yPosition] = d3.pointer(event, svg.node());
                    // Add tooltip
                    svg.append("text")
                        .attr("id", "tooltip")
                        .attr("x", xPosition)
                        .attr("y", yPosition - 10)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "#FFFAFA")
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .text(d.properties.name + ": " + d.properties.value);
                        })
                        .on("mouseout", function() {
                        //Remove the tooltip
                        d3.select("#tooltip").remove();
                    });

        })

        // add legends
        const width = 400;
        const height = 60;
        const legendWidth = 300;

        // Create the SVG container for the legend
        const svgLegend = d3.select("#plot1-canvas")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        const legend = svgLegend.append("g")
            .attr("class", "maplegend")
            .attr("transform", "translate(50, 20)");
        const thresholds = [0, 10, 20, 50]; // Custom labels
        const rectWidth = legendWidth / thresholds.length;

        // Draw rectangles for the legend
        legend.selectAll("rect")
            .data(color.range())
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * rectWidth)
            .attr("y", 0)
            .attr("width", rectWidth)
            .attr("height", 18)
            .attr("fill", d => d);

        // Add labels
        legend.selectAll("text")
            .data(thresholds)
            .enter()
            .append("text")
            .attr("x", (d, i) => i * rectWidth + rectWidth / 2)
            .attr("y", 35)
            .text((d, i) => 
                (i + 1 < thresholds.length) 
                ? `${d}-${thresholds[i + 1]}` 
                : `${d}+`
            )
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style("fill",  "#FFFAFA");
        legend.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("transform", `translate(0, -10)`)
                .text("Number of Drivers")
                .style("font-size", "14px")
                .style("fill",  "#FFFAFA")
                .style("font-weight", "bold");  
    })
}