async function draw() {
  // Data
  const dataset = await d3.json("data.json");

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
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

  const labels = ctr.append("g").classed("bar-labels", true);
  const axisG = ctr
      .append("g")
      .attr("transform", `translate(0, ${dimensions.ctrHeight})`)

  // HistogramD Draw function
  const histogram = (metric) => {
    const xAccessor = (d) => d.currently[metric];
    const yAccessor = (d) => d.length;

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])
      .nice();

    const bin = d3
      .bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10);
    const newData = bin(dataset);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(newData, yAccessor)])
      .range([dimensions.ctrHeight, 0])
      .nice();

    // Draw the bars
    ctr
      .selectAll("rect")
      .data(newData)
      .join("rect")
      .attr("width", (d) => d3.max([xScale(d.x1) - xScale(d.x0) - 1, 0]))
      .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("fill", "purple")
      .attr("shape-rendering", "auto");

    labels
      .selectAll("text")
      .data(newData)
      .join("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d) + 5))
      .text(yAccessor);

    // Axes
    const axis = d3.axisBottom(xScale);
    
      axisG.call(axis);
  };

  d3.select("#metric").on("change", (e) => {
    e.preventDefault();

    histogram(e.target.value);
  });

  histogram("humidity");
}

draw();
