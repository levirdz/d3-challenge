// defining SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;

// defining plot margins
var plotMargin = {
  top: 40,
  right: 40,
  bottom: 60,
  left:60
};

// defining plot area dimensions
var plotWidth = svgWidth - plotMargin.left - plotMargin.right;
var plotHeight = svgHeight - plotMargin.top - plotMargin.bottom;

// selecting body, appending SVG area, and setting dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// appending a group to the SVG area and translate it to the bottom right to comply with plotMargin object
var plotGroup = svg.append("g")
  .attr("transform", `translate(${plotMargin.left}, ${plotMargin.top})`);

  // loading data from csv
d3.csv("assets/data/data.csv").then(function(StateData) {
    StateData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

  //creating scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(StateData, d => d.age))
    .range([0, plotWidth])
    .nice()
 
  const yScale = d3.scaleLinear()
    .domain([6,d3.max(StateData, d => d.smokes)])
    .range([plotHeight, 0])
    .nice()
   
  // creating both axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
 
  //appending both axis to plot
  plotGroup.append("g").attr("transform", `translate(0, ${plotHeight})`).call(xAxis);
  plotGroup.append("g").call(yAxis);

// generating plot
plotGroup.selectAll("circle")
.data(StateData)
.enter()
.append("circle")
.attr("cx", d=>xScale(d.age))
.attr("cy", d=>yScale(d.smokes))
.attr("r", "8")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.8);

//adding text to each circle
plotGroup.append("g")
  .selectAll('text')
  .data(StateData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.age))
  .attr("y",d=>yScale(d.smokes))
  .classed(".stateText", true)
  .attr("font-family", "calibri")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "12px")
  .attr("alignment-baseline", "central");
  
  //adding titles to x and y axis
  plotGroup.append("text")
        .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + plotMargin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        plotGroup.append("text")
        .attr("y", 0 - ((plotMargin.left / 2+5)))
        .attr("x", 0 - (plotHeight / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("font-weight", "bold")
        .text("Smokers (%)");
}).catch(function(error) {
  console.log(error);
});