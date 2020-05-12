function healthGDP_vs_deaths_data() {

      var jsonArray = [];
      d3.selectAll("svg").remove();
      d3.selectAll(".tooltip").remove();

      console.log("healthGDP_vs_deaths_data()");

      for (country in covidDeathData) {
            if (covidDeathData[country] > 0 && healthData[country] > 0)
                  addCountryItem(jsonArray, country, covidDeathData[country], healthData[country])
      }

      drawGraph(jsonArray);
      addLabels("Number of deaths (as of yesterday)", "Health GDP %")
}

function addCountryItem(jsonArray, country, deaths, healthData) {
      jsonArray.push({
          "country": country,
          "deaths": deaths ,
          "healthGDP": healthData
      });
  }

function drawGraph(jsonArray) {
      
      console.log("drawGraph()")
      
      var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      let x = d3.scaleLog()
      .domain([0.1, 1000000])
      .range([0, width]);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .tickValues([1,10,100,1000,10000,100000, 1000000])
      .tickFormat(d3.format("d")));

      // Add Y axis
      let y = d3.scaleLinear()
      .domain([0,20])
      .range([ height, 0]);

      svg.append("g")
      .call(d3.axisLeft(y));

      // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
      // Its opacity is set to 0: we don't see it by default.
      var tooltip = d3.select(".tableRight")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      var mouseover = function(d) {
            tooltip
            .style("opacity", 1)
      }
      
      var mousemove = function(d) {
            tooltip
            .html(d["country"] + "<br/> Deaths: " + d["deaths"]+ "<br/> Health GDP %: " + d["healthGDP"])
            .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
      }
      
      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      var mouseleave = function(d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

      svg.append('g')
      .selectAll("dot")
      .data(jsonArray)
      .enter()
      .append("circle")
      .attr("id", "circleBasicTooltip")
      .attr("cx", d => x(d["deaths"]))
      .attr("cy", d => y(d["healthGDP"]))
      .attr("r", 7)
      .style("fill", "blue")
      .style("opacity", .4)
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )     
}
