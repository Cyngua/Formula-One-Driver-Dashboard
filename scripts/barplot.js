function createBarchart(){
    let w = 450;
    let h = 380;
    let margin = {top: 40, right: 80, bottom: 40, left: 60}
    let svg = d3.select("#plot4-canvas")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
    let rowConverter = (d) => {
        return {
            name: d.Driver,
            decade: +d.Decade,
            win: +d.Race_Wins,
            podiums: +d.Podiums,
            champion: d.Champion
        };
    };
    d3.csv("../data/F1_driver_dataset.csv", rowConverter).then( (data)=> {
        sortedData = data.sort((a, b) => {
            const winComparison = d3.descending(a.win, b.win);
            if (winComparison !== 0) {
                return winComparison; // check if we can sort by win
            }
            return d3.descending(a.podiums, b.podiums);
        });
        console.log(sortedData);
        drawBarPlot(svg, sortedData, w, h, margin, 2020);
        window.barData = sortedData;
    })
}

function drawBarPlot(svg, data, w, h, margin, decade) {
    svg.selectAll("*").remove();

    data = data.filter(d => d.decade <= decade);
    data = data.slice(0, 20); // only top 20
    console.log(data);
    // x axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.podiums)])
        .range([margin.left, w - margin.right]);
    svg.append("g")
        .attr("transform", "translate(0," + (h - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    // x axis
    let y = d3.scaleBand()
        .range([ 0, h - margin.bottom ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", "translate(" + margin.left + ", 0)");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.win); })
        .attr("height", y.bandwidth() )
        .attr("fill", (d) => {
            return d.champion == "True" ? "#B22222" : "lightgrey";})

    // x axis title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (w - margin.left - margin.right) / 2 + margin.left)
        .attr("y", h - margin.bottom / 2 + 30)
        .attr("font-family", "Arial")
        .attr("font-size", "14px")
        .attr("fill", "#FFFAFA")
        .text("Counts");
    
    // number of podiums
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
                return x(d.podiums);
        })
        .attr("cy", function(d) {
                return y(d.name);
        })
        .attr("r", function(d) {
                return 5;
        })
        .attr("fill", function(d) {
            if (d.champion == "True"){
                return "#efa9a9";
            }
            else {
                return "Darkgrey";
            }
        })
        .attr("opacity", 0.9)
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
                .text(d.podiums);
                })
                .on("mouseout", function() {
                //Remove the tooltip
                d3.select("#tooltip").remove();
            });
    svg.append("text")
        .attr("x", w - margin.right/2 + 10)
        .attr("y", 30 + 5*1.2)
        .text("Circles: Podiums")
        .attr("font-family", "Arial")
        .attr("fill", "#FFFAFA")
        .attr("font-size", "12px");
    svg.append("text")
        .attr("x", w - margin.right/2 + 10)
        .attr("y", 50 + 5*1.2)
        .text("Bars: Wins")
        .attr("font-family", "Arial")
        .attr("fill", "#FFFAFA")
        .attr("font-size", "12px");
}

function updateBarPlot(decade) {
    const svg = d3.select("#plot4-canvas svg g");
    let w = 450;
    let h = 380;
    let margin = {top: 40, right: 80, bottom: 40, left: 60}
    drawBarPlot(svg, window.barData, w, h, margin, decade);
}