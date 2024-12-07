function createScatterPlot() {
    let w = 400;
    let h = 400;
    let margin = {top: 40, right: 40, bottom: 40, left: 40}
    const svg = d3.select("#plot2-canvas")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
    let rowConverter = (d) => {
            return {
                name: d.Driver,
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
                champ: d.Champion === "True" ? 1 : 0,
            };
        };
    d3.csv("../F1_driver_dataset.csv", rowConverter).then((data)=>  {
        const features = [
            "rate_start",
            "rate_pole",
            "rate_win",
            "rate_podiums",
            "rate_fastest",
            "avg_points",
            "years_active"
        ];
        const matrix = data.map(row =>
            features.map(feature => row[feature])
        );
    })
}