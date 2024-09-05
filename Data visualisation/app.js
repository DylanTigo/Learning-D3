const getData = async () => {
  const data = await d3.json("data.json");
  console.log(data.length);

  // Accessors
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  const formatDate = d3.timeFormat("%B %d, %Y");

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
  const tooltip = d3.select("#tooltip");

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
    .attr("stroke", "transparent")
    .attr("stroke-width", 10)
    .attr("fill", "mediumpurple")
    .attr("shape-rendering", "auto")
    .attr("data-temp", yAccessor);

  // Axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.format(".0%"))
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale);

  // Draw the axes
  const xAxisG = container
    .append("g")
    .attr("transform", `translate(0, ${dimensions.containerHeight})`)
    .call(xAxis);

  const yAxisG = container.append("g").call(yAxis);

  // Adding text
  xAxisG
    .append("text")
    .attr("x", dimensions.containerWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity (%)")
    .classed("axis", true);
  xAxisG.selectAll(".tick text");
  xAxisG.selectAll(".tick line");

  yAxisG
    .append("text")
    .attr("x", -dimensions.containerHeight / 2)
    .attr("y", -dimensions.margin.left + 20)
    .attr("fill", "black")
    .attr("transform", "rotate(-90)")
    .text("Temperature (°F)")
    .style("text-anchor", "middle")
    .classed("axis", true);

  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );

  const voronoi = delaunay.voronoi();

  delaunay.render();

  const xLine = container
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0)
    .classed("mean-line", true);
  const yLine = container
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", dimensions.containerHeight)
    .classed("mean-line", true);

  container
    .append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    // .attr("stroke", "#333")
    .attr("fill", "transparent")
    .attr("d", (d, i) => voronoi.renderCell(i))
    .on("mouseenter", (e, datum) => {
      container
        .append("circle")
        .classed("dot-hovered", true)
        .attr("cx", xScale(xAccessor(datum)))
        .attr("cy", yScale(yAccessor(datum)))
        .attr("r", 6)
        .attr("fill", "purple");

      xLine
        .transition()
        .duration(100)
        .attr("x1", dimensions.containerWidth)
        .attr("y1", yScale(yAccessor(datum)))
        .attr("y2", yScale(yAccessor(datum)));
      yLine
        .transition()
        .duration(100)
        .attr("x1", xScale(xAccessor(datum)))
        .attr("x2", xScale(xAccessor(datum)))
        .attr("y2", dimensions.containerHeight);

      tooltip
        .classed("show", true)
        .style("top", yScale(yAccessor(datum)) - 25 + "px")
        .style("left", xScale(xAccessor(datum)) + "px");

      tooltip
        .select(".metric-humidity span")
        .text(d3.format(".0%")(xAccessor(datum)));
      tooltip.select(".metric-temp span").text(yAccessor(datum) + " °F");
      tooltip
        .select(".metric-date")
        .text(formatDate(new Date(datum.currently.time * 1000)));
    })
    .on("mouseleave", (e) => {
      d3.select(".dot-hovered").remove();
      tooltip.classed("show", false);
    });
};

getData();
