async function draw(el, scale) {
  // Data
  const dataset = await d3.json("data.json");
  dataset.sort((a, b) => a - b);

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

  // Scales
  let colorScale;

  if (scale === "linear") {
    colorScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset))
      .range(["white", "blue"]);
  } else if (scale === "quantize") {
    colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(dataset))
      .range(["paleturquoise", "darkcyan", "palevioletred"]);
  } else if (scale === "quantile") {
    colorScale = d3
      .scaleQuantile()
      .domain(dataset)
      .range(["paleturquoise", "darkcyan", "palevioletred"]);
  } else if (scale === "threshold") {
    colorScale = d3
      .scaleThreshold()
      .domain([30000, 80000, 130000])
      .range(["paleturquoise", "darkcyan", "palevioletred", "purple"]);
  }

  // Draw scales
  const container = svg
    .append("g")
    .attr("fill", "#ddd")
    .attr(
      "transform",
      `translate(${dimensions.margin.x}, ${dimensions.margin.y})`
    );

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
draw("#heatmap2", "quantize");
draw("#heatmap3", "quantile");
draw("#heatmap4", "threshold");
