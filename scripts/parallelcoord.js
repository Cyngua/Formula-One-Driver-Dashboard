function createParallelPlot() {
    let w = 1200;
    let h = 400;
    let margin = {top: 40, right: 20, bottom: 5, left: 80}
    const svg = d3.select("#plot2-canvas")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

    let rowConverter = (d) => {
        return {
            name: d.Driver,
            decade: +d.Decade,
            num_pole: +d.Pole_Positions, 
            num_wins: +d.Race_Wins,
            num_podiums: +d.Podiums,
            num_fastest: +d.Fastest_Laps,
            rate_start: +d.Start_Rate,
            rate_pole: +d.Pole_Rate,
            rate_win: +d.Win_Rate,
            rate_podiums: +d.Podium_Rate,
            rate_fastest: +d.FastLap_Rate,
            avg_points: +d.Points_Per_Entry,
            years_active: +d.Years_Active,
            champion: d.Champion,
        };
    };
    d3.csv("../data/F1_driver_dataset.csv", rowConverter).then((data)=>  {
        data = data.filter(d => d.num_wins > 0);
        console.log(data);
        dimensions = [
            "rate_pole",
            "rate_win",
            "rate_podiums",
            "rate_fastest",
            "avg_points"
        ];
        let color = d3.scaleOrdinal()
                    .domain(["True", "False"])
                    .range([ "#B22222", "Grey"])
                    
        let y = {}
        for (let i = 0; i < dimensions.length; i++) {
            if (dimensions[i] == "avg_points"){
                y[dimensions[i]] = d3.scaleLinear()
                        .domain([d3.min(data, (d)=>{ return +d[dimensions[i]]; }), d3.max(data, (d)=>{ return +d[dimensions[i]]; })])
                        .range([h - margin.bottom, margin.top])
            }
            else {
                y[dimensions[i]] = d3.scaleLinear()
                .domain( [0, 1] )
                .range([h - margin.bottom, margin.top])
            }
        }
        let x = d3.scalePoint()
                .range([margin.left, w - margin.right])
                .domain(dimensions);
        
        function path(d) {
            return d3.line()(dimensions.map((p) => { return [x(p), y[p](d[p])]; }));
        }

        svg.selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", (d) => { return "line-" + d.champion } )
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", (d) => { return( color(d.champion))} )
            .style("stroke-width", 2.5)
            .style("opacity", 0.75)
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
                    .text(d.name);
                    })
                    .on("mouseout", function() {
                    //Remove the tooltip
                    d3.select("#tooltip").remove();
                });

        // add axes
        svg.selectAll("myAxis")
                .data(dimensions)
                .enter()
                .append("g")
                .each((d) =>  { 
                    svg.append("g")
                        .attr("class", "coordAxis")
                        .attr("transform", "translate(" + x(d) + ")")
                        .call(d3.axisLeft().ticks(5).scale(y[d])).style("stroke-width", 2)
                        .append("text")
                        .style("text-anchor", "middle")
                        .attr("y", margin.top -15)
                        .text(d)
                        .style("fill", "#FFFAFA");
                    })
        // add legends
        let ChampionGroup = ["True", "False"];
        let legendLine = svg.append("g")
            .attr("class", "legendLine")
            .attr("transform", `translate(${-40},${margin.top})`);
        ChampionGroup.forEach((group, i) => {
            legendLine.append("g")
                .attr("class", "legend-item")
                .attr("transform", `translate(0, ${i * 25})`)
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 25)
                .attr("y2", 0)
                .style("stroke", color(group))
                .style("stroke-width", 3); 
            legendLine.append("g")
                .attr("class", "legend-item")
                .attr("transform", `translate(0, ${i * 25})`)
                .append("text")
                .attr("x", 30)
                .attr("y", 5)
                .style("font-size", "12px")
                .style("fill",  "#FFFAFA")
                .text(group);
        });
        legendLine.append("text")
                    .attr("x", 0)
                    .attr("y", 5)
                    .attr("transform", `translate(0, -25)`)
                    .text("Champion")
                    .style("font-size", "14px")
                    .style("fill",  "#FFFAFA")
                    .style("font-weight", "bold");               
    })
}
