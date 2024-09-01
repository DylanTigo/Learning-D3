const getData = async () => {
  const data = await d3.json("data.json");

  // Accessors
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  // Dimensions
  const dimensions = {
    width: 600,
    height: 600,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  };
  // Compute the dimensions of the container
  dimensions.containerWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.containerHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Create the SVG
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const container = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .rangeRound([0, dimensions.containerWidth])
    .clamp(true);
  
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .nice()
    .rangeRound([dimensions.containerHeight, 0])
    .clamp(true);

  // Draw the circles
  container
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 4)
    .attr("fill", "purple")
    .attr("shape-rendering", "auto")
    .attr("data-temp", yAccessor)

  // Axes
  const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".0%")).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale);

  // Draw the axes
  const xAxisG = container
    .append("g")
    .attr("transform", `translate(0, ${dimensions.containerHeight})`)
    .call(xAxis)

  const yAxisG = container.append("g").call(yAxis)

  // Adding text
  xAxisG
    .append("text")
    .attr("x", dimensions.containerWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity (%)")
    .classed("axis", true)
  xAxisG.selectAll(".tick text").attr("fill", "purple") 
  xAxisG.selectAll(".tick line").attr("stroke", "red")
  
  yAxisG
    .append("text")
    .attr("x", - dimensions.containerHeight / 2)
    .attr("y", -dimensions.margin.left + 20)
    .attr("fill", "black")
    .attr("transform", "rotate(-90)")
    .text("Temperature (°F)")
    .style("text-anchor", "middle")
    .classed("axis", true)
};

getData();
