async function draw(el, scale) {
  // Data
  const dataset = await d3.json("data.json");

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
    margin: {
      x: 2,
      y: 2,
    },
  };
  const box = 30;

  // Draw Image
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const container = svg
    .append("g")
    .attr("fill", "#ddd")
    .attr(
      "transform",
      `translate(${dimensions.margin.x}, ${dimensions.margin.y})`
    );

  // Scales
  let colorScale;

  if (scale === "linear") {
    colorScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset))
      .range(["white", "blue"]);
  }

  container
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("fill", "#ddd")
    .attr("stroke", "#d5d2d2")
    .attr("width", box - 3)
    .attr("height", box - 3)
    .attr("x", (d, i) => box * (i % 20))
    .attr("y", (d, i) => box * ((i / 20) | 0))
    .attr("fill", colorScale);
}

draw("#heatmap1", "linear");
