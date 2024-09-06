async function draw() {
  // Data
  const dataset = await d3.csv("data.csv");

  const parseDate = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => parseDate(d.date);
  const yAccessor = (d) => parseInt(d.close);

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 50,
  };

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
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([dimensions.ctrHeight, 0])
    .nice();

  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  // Draw the line
  ctr
    .append("path")
    .datum(dataset)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  // Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")).tickSizeOuter(false);
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => "$" + d).tickSizeOuter(false);

  // Draw the axes
  const xAxisG = ctr
    .append("g")
    .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis);

  const yAxisG = ctr.append("g").call(yAxis);
}

draw();
