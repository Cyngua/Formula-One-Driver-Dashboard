function createBarchart(){
    const margin = { top: 20, right: 20, bottom: 50, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const svg = d3.select("#plot0-slider")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
    let rowConverter = (d) => {
        return {
            name: d.Driver,
            decade: d.Decade,
        };
    };
    d3.csv("../data/F1_driver_dataset.csv", rowConverter).then( (data)=> {
        const decadeCount = {};
        data.forEach(d => {decadeCount[d.decade] = (decadeCount[d.decade] || 0) + 1;})
        data = Object.entries(decadeCount).map(([decade, count]) => ({ decade, count }));
        const x = d3.scaleBand()
            .domain(data.map(d => d.decade)) 
            .range([0, width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.decade))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count))
            .attr("fill", "Grey");
        svg.append("g")
            .attr("class", "barAxis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        svg.append("g")
            .attr("class", "barAxis")
            .call(d3.axisLeft(y).ticks(5));
        // y axis title
        svg.append("text")
            .attr("x", -height/2)
            .attr("y", -40)
            .text("Number of Drivers")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("fill", "#FFFAFA")
            .attr("transform", "rotate(-90)");

        // Add a slider
        let x0, x1
        const slider = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("brush end", event => {
                const selection = event.selection || x.range();
                console.log(selection);
                x0 = selection.map(x.invert)[0];
                x1 = selection.map(x.invert)[1];
                console.log(`Selected range: ${x0}-${x1}`);
            });
        svg.append("g")
            .attr("class", "slider")
            .call(slider);
    })

}