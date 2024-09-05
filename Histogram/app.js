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
    .attr("transform", `translate(0, ${dimensions.ctrHeight})`);

  const meanLine = ctr.append("line").classed("mean-line", true);
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

    const exitTransition = d3.transition().duration(1000);
    // Draw the bars
    ctr
      .selectAll("rect")
      .data(newData)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("width", (d) => d3.max([xScale(d.x1) - xScale(d.x0) - 1, 0]))
            .attr("height", 0)
            .attr("x", (d) => xScale(d.x0))
            .attr("y", (d) => dimensions.ctrHeight)
            .attr("shape-rendering", "auto")
            .attr("fill", "#b8de6f"),
        (update) => update,
        (exit) =>
          exit
            .attr("fill", "#f39233")
            .transition(exitTransition)
            .attr("y", dimensions.ctrHeight)
            .attr("height", 0)
            .remove()
      )
      .transition()
      .duration(1000)
      .attr("fill", "purple")
      .attr("width", (d) => d3.max([xScale(d.x1) - xScale(d.x0) - 1, 0]))
      .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(yAccessor(d)));

    labels
      .selectAll("text")
      .data(newData)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            .attr("y", (d) => dimensions.ctrHeight - 5)
            .text(yAccessor),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(1000)
            .attr("y", dimensions.ctrHeight)
            .remove()
      )
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d) + 3))
      .text(yAccessor);

    const mean = d3.mean(dataset, xAccessor);

    meanLine
      .raise()
      .transition()
      .duration(1000)
      .attr("x1", xScale(mean))
      .attr("y1", 0)
      .attr("x2", xScale(mean))
      .attr("y2", dimensions.ctrHeight);
    // Axes
    const axis = d3.axisBottom(xScale);
    axisG.transition().call(axis);
  };

  d3.select("#metric").on("change", (e) => {
    e.preventDefault();

    histogram(e.target.value);
  });

  histogram("humidity");
}

draw();
