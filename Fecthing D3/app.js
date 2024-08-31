const getData = async () => {
  // const data = await d3.json("data.js");
  const data = await d3.csv("data.csv" );
  console.log(data);
}

getData();