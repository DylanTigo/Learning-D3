async function draw() {
  // Data
  const dataset = await d3.csv("data.csv");

  // Dimensions
  let dimensions = {
    width: 600,
    height: 600,
    margins: 10,
  };
  const radius = 300;

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

  // Scales
  const populationPie = d3.pie().value((d) => d.value).sort(null);
  const slices = populationPie(dataset);

  const arc = d3.arc().innerRadius(50).outerRadius(radius).padAngle(0.01);
  const arcLabel = d3.arc().innerRadius(200).outerRadius(radius).padAngle(0.01);

  const arcGroup = ctr
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth / 2},${dimensions.ctrHeight / 2})`
    );

  const colors = d3.quantize(d3.interpolateRdPu, dataset.length);
  const colorScale = d3
    .scaleOrdinal()
    .domain(dataset.map((d) => d.name))
    .range(colors);

  // Draw Shapes
  arcGroup
    .selectAll("path")
    .data(slices)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.name));

  // Draw Labels
  const labelGroup = ctr
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth / 2},${dimensions.ctrHeight / 2})`
    )
    .classed("labels", true);

  labelGroup
    .selectAll("text")
    .data(slices)
    .join("text")
    .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .style("font-weight", "bold")
        .attr("y", -4)
        .text((d) => d.data.name)
    )
    .call((text) =>
      text.filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", 9)
        .text((d) => d.data.value)
    );
}

draw();
