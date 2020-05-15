

function cvLineGraph(country) {

  resetGraphSpace()

  if (country == "USA") {
    countryName = "United States"
  } else {
    countryName = country
  }

  

 d3.select(".tableRight").append('div').attr("class","curve")
 .html(function(d) {
  return "<p style='border:2px; border-style:solid;border-radius: 25px; border-color: gray;'>&emsp;&emsp;&emsp;&emsp;<strong>Country: <span>" + countryName + "<br></span></strong>" + 
         "&emsp;&emsp;&emsp;&emsp;<strong>Confirmed Cases: </strong><span>" + covidConfirmedData.get(countryName) + "<br/></span>" + 
         "&emsp;&emsp;&emsp;&emsp;<strong>Recovered: </strong><span>" + covidRecoveredData.get(countryName) + "<br/></span>" + 
         "&emsp;&emsp;&emsp;&emsp;<strong>Deaths: </strong><span>" + covidDeathData.get(countryName)+ "<br/></span></p>"
})



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

// transform width + 20 to accomodate y axis label
var svg = d3.select(".tableRight").append("svg")
            .attr("id", "lineGraph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + (margin.left + 20) + "," + margin.top + ")");


           for (x in lineData) {
           	//console.log(country);
           	if (country == "USA") {
           		country = "US";
           	}
             if(x == country){ //country name variablle here
               data = lineData[x];
             }
           }
           //console.log(d3.keys(data[0]));
           var productCategories = d3.keys(data[0]).filter(function(key) {
             return key !== "date";
           });
           color.domain(productCategories);

           //console.log("categories: " + productCategories);

           var confirmedCases = [];

           //console.log(data);
           //console.log(JSON.stringify(data, null, 2));

           var dates = [];

           // Format the data field
           data.forEach(function(d) {
             //d["date"] = parseDate(d["date"]);
             dates.push(parseDate(d["date"]));
             confirmedCases.push(d["confirmed"]);
           });


        //console.log("date: " + data[0]["date"]);
           



           // Reformat data
           // data = An array of objects
           // concentrations = An array of three objects, each of which contains an array of objects
           var concentrations = productCategories.map(function(category) {
             return {
               category: category,
               datapoints: data.map(function(d, i) {
                 return { date: dates[i], concentration: +d[category] };
               })
             };
           });

           //console.log(JSON.stringify(concentrations, null, 2))

          // Set the domain of the axes
          xScale.domain(
            d3.extent(dates, function(d) {
              return d;
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

//add legend
  svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#1673b1")
  svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#239e20")
  svg.append("circle").attr("cx",200).attr("cy",190).attr("r", 6).style("fill", "#f87c00")
  svg.append("text").attr("x", 220).attr("y", 130).text("Confirmed Cases").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 160).text("Recovered Cases").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 190).text("Deaths").style("font-size", "15px").attr("alignment-baseline","middle")

  addLabels("Timeline","# of Cases")

}


// var svg = d3.select(".tableRight").append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform","translate(" + margin.left + "," + margin.top + ")");


// Define responsive behavior
// function resize() {

// var svg = d3.select("#lineGraph");

// // Update the range of the scale with new width/height
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

