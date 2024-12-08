function createScatterPlot() {
    let w = 500;
    let h = 400;
    let margin = {top: 40, right: 80, bottom: 40, left: 80}
    const svg = d3.select("#plot4-canvas")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
    let rowConverter = (d) => {
            return {
                name: d.Driver,
                decade: +d.Decade,
                years_active: +d.Years_Active,
                points: +d.Points,
                champion: d.Champion,
            };
        };
    d3.csv("../data/F1_driver_dataset.csv", rowConverter).then((data)=>  {
        let xScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d)=> { return d.years_active; })])
                        .range([margin.left, w - margin.right])
        let yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d)=> { return d.points; })])
                        .range([h - margin.bottom, margin.top]); 
        let pScale = d3.scaleOrdinal()
                        .domain(["True", "False"]) // Champion is true, not Champion is false
                        .range([10, 5]);
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                    return xScale(d.years_active);
            })
            .attr("cy", function(d) {
                    return yScale(d.points);
            })
            .attr("r", function(d) {
                    return pScale(d.champion);
            })
            .attr("fill", function(d) {
                if (d.champion == "True"){
                    return "#B22222";
                }
                else {
                    return "Lightgrey";
                }
            })
            .attr("opacity", 0.8)
            .on("mouseover", function(event,d) { // start code from lecture 9
                //Get this circles x/y values, then augment for the tooltip
                let xPosition = parseFloat(d3.select(this).attr("cx"));
                let yPosition = parseFloat(d3.select(this).attr("cy"));
                //Create the tooltip label
                svg.append("text")
                    .attr("id", "tooltip") // create an id so that we can call it later
                    .attr("x", xPosition)
                    .attr("y", yPosition-5)
                    .attr("text-anchor", "middle")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#FFFAFA")
                    .attr("stroke","white")
                    .attr("stroke-width", 0.5)
                    .text(d.name);
                    })
                    .on("mouseout", function() {
                    //Remove the tooltip
                    d3.select("#tooltip").remove();
                });
        // x axis
        svg.append("g")
            .attr("transform", "translate(0," + (h - margin.bottom) + ")")
            .call(d3.axisBottom(xScale).tickSize(5))
            .selectAll("text")
            .attr("fill", "#FFFAFA")
            .attr("font-family", "Arial")
            .attr("transform", `translate(0,5)`)
            .attr("font-size", "14px");
        // y axis
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(d3.axisLeft(yScale).tickSize(5))
            .selectAll("text")
            .attr("fill", "#FFFAFA")
            .attr("font-family", "Arial")
            .attr("transform", "translate(-5,0)")
            .attr("font-size", "14px");
        // x title and y title
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", (w - margin.left - margin.right) / 2 + margin.left)
            .attr("y", h - margin.bottom / 2 + 30)
            .attr("font-family", "Arial")
            .attr("font-size", "14px")
            .attr("fill", "#FFFAFA")
            .text("Active Years");
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -(h - margin.top - margin.bottom) / 2 - margin.top)
            .attr("y", margin.left / 2 - 35)
            .attr("font-family", "Arial")
            .attr("font-size", "14px")
            .attr("fill", "#FFFAFA")
            .attr("transform", "rotate(-90)")
            .text("Total Points"); 
        svg.append("circle")
            .attr("cx", w - margin.right/2)
            .attr("cy", 30)
            .attr("r", 5)
            .style("fill", "#B22222");
        svg.append("circle")
            .attr("cx", w - margin.right/2)
            .attr("cy", 50)
            .attr("r", 5)
            .style("fill", "Lightgrey");
        svg.append("text")
            .attr("x", w - margin.right/2 + 10)
            .attr("y", 30 + 5*1.2)
            .text("True")
            .attr("font-family", "Arial")
            .attr("fill", "#FFFAFA")
            .attr("font-size", "12px");
        svg.append("text")
            .attr("x", w - margin.right/2 + 10)
            .attr("y", 50 + 5*1.2)
            .text("False")
            .attr("font-family", "Arial")
            .attr("fill", "#FFFAFA")
            .attr("font-size", "12px");
        svg.append("text")
            .attr("x", w - margin.right/2)
            .attr("y", 0)
            .attr("transform", `translate(-5, 15)`)
            .text("Champion")
            .style("font-size", "14px")
            .style("fill",  "#FFFAFA")
            .style("font-weight", "bold"); 

    })
}