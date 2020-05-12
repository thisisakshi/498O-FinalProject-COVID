

function cvLineGraph(country) {


 d3.selectAll("svg").remove();

// Define margins
// var margin = { top: 20, right: 80, bottom: 30, left: 50 },
//   width =
//     800 - margin.left - margin.right,
//   height =
//     600 - margin.top - margin.bottom;

// Define date parser
var parseDate = d3.timeParse("%Y-%m-%d");

// Define scales
var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal().range(d3.schemeCategory10);

// Define axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// Define lines
var line = d3
  .line()
  .curve(d3.curveMonotoneX)
  .x(function(d) {
    return xScale(d["date"]);
  })
  .y(function(d) {
    return yScale(d["concentration"]);
  });




  // Define svg canvas
// var svg = d3
//   .select(".tableRight")
//   .append("svg").attr("width", 800 + margin.left + margin.right).attr("height", 600 + margin.top + margin.bottom);

  // svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");


// Read in data
// d3.json("https://pomber.github.io/covid19/timeseries.json")
//      .then(DATA => {
       //console.log(DATA);
           for (x in testData) {
             if(x == country){ //country name variablle here
               data = testData[x];
             }
           }
           //console.log(d3.keys(data[0]));
           var productCategories = d3.keys(data[0]).filter(function(key) {
             return key !== "date";
           });
           color.domain(productCategories);

           var confirmedCases = [];
           // Format the data field
           data.forEach(function(d) {
             d["date"] = parseDate(d["date"]);
             confirmedCases.push(d["confirmed"]);
           });


           // Reformat data
           // data = An array of objects
           // concentrations = An array of three objects, each of which contains an array of objects
           var concentrations = productCategories.map(function(category) {
             return {
               category: category,
               datapoints: data.map(function(d) {
                 return { date: d["date"], concentration: +d[category] };
               })
             };
           });
          //  console.log(JSON.stringify(concentrations, null, 2))

          // Set the domain of the axes
          xScale.domain(
            d3.extent(data, function(d) {
              return d["date"];
            })
          );

          var max = Math.max(...confirmedCases);
          yScale.domain([0, max]);

          // Place the axes on the chart
            svg
              .append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg
              .append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("class", "label")
              .attr("y", 6)
              .attr("dy", ".71em")
              .attr("dx", ".71em");
              //.style("text-anchor", "beginning")
              //.text("Product Concentration");

              var products = svg
              .selectAll(".category")
              .data(concentrations)
              .enter()
              .append("g")
              .attr("class", "category");

              products
              .append("path")
              .attr("class", "line")
              .attr("d", function(d) {
                return line(d.datapoints);
              })
              .style("stroke", function(d) {
                return color(d.category);
              });

              // console.log(JSON.stringify(d3.values(concentrations), null, 2)) // to view the structure
  console.log(d3.values(concentrations)); // to view the structure
  console.log(concentrations);
  // console.log(concentrations.map(function()))


//add legend
  svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#1673b1")
  svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#239e20")
  svg.append("circle").attr("cx",200).attr("cy",190).attr("r", 6).style("fill", "#f87c00")
  svg.append("text").attr("x", 220).attr("y", 130).text("Confirmed Cases").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 160).text("Recovered Cases").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 190).text("Deaths").style("font-size", "15px").attr("alignment-baseline","middle")



// });


// // Define responsive behavior
// function resize() {
//   var width =
//       parseInt(d3.select("svg").style("width")) - margin.left - margin.right,
//     height =
//       parseInt(d3.select("svg").style("height")) -
//       margin.top -
//       margin.bottom;

//   // Update the range of the scale with new width/height
//   xScale.range([0, width]);
//   yScale.range([height, 0]);

//   // Update the axis and text with the new scale
//   svg
//     .select(".x.axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   svg.select(".y.axis").call(yAxis);

//   // Force D3 to recalculate and update the line
//   svg.selectAll(".line").attr("d", function(d) {
//     return line(d.datapoints);
//   });

//   // Update the tick marks
//   xAxis.ticks(Math.max(width / 75, 2));
//   yAxis.ticks(Math.max(height / 50, 2));
// }

// // Call the resize function whenever a resize event occurs
// d3.select(window).on("resize", resize);

// // Call the resize function
// resize();
}