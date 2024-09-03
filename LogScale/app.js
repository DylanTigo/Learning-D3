async function draw() {
  // Data
  const dataset = await d3.json("data.json");
  dataset.sort((a, b) => a.size - b.size);

  const sizeAccessor = (d) => d.size;
  const nameAccessor = (d) => d.name;

  // Dimensions
  let dimensions = {
    width: 200,
    height: 500,
    margin: 50,
  };

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Draw container
  const container = svg
    .append("g")
    .attr("fill", "#ddd")
    .attr("transform", `translate(${dimensions.margin}, 0)`);
    
  // Scales
  const scale = d3
    .scaleLog()
    .domain(d3.extent(dataset, sizeAccessor))
    .range([dimensions.margin, dimensions.height - dimensions.margin])
    .nice();

  // Draw data
  container
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", 0)
    .attr("cy", (d) => scale(sizeAccessor(d)))
    .attr("r", 5)
    .attr("fill", "purple")
    .attr("shape-rendering", "auto");

  container
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("x", 10)
    .attr("y", (d) => scale(sizeAccessor(d)))
    .attr("fill", "black")
    .style("dominant-baseline", "middle")
    .text(nameAccessor);

  // Axe
  const axe = d3
    .axisLeft(scale).tickValues(dataset.map(d => d.size))

  console.log(dataset.map(d => d.size));
  
  // Draw Axe
  const axeG = svg.append("g").attr("transform", `translate(${dimensions.margin}, 0)`).call(axe)

}

draw();
