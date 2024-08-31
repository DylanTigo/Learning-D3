const getData = async () => {
  const data = await d3.json("data.json");

  // Accessors
  const xAccessor = d => d.currently.humidity;
  const yAccessor = d => d.currently.apparentTemperature;

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
  dimensions.containerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.containerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

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
    .range([0, dimensions.containerWidth]);
  
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.containerHeight, 0]);
  
  // Draw the circles
  container
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "purple");
};

getData();
