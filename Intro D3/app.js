const data = [10, 20, 30, 40, 50];

const elements = d3
  .select("ul")
  .selectAll("li")
  .data(data)
  .join(
    (enter) => enter.append("li").style("color", "blue"),
    (update) => update.style("color", "purple"),
    (exit) => exit.remove()
  )
  .text((d) => d);

console.log(elements);