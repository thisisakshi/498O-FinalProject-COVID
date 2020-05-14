function olderpopulation_vs_deaths_data() {
      console.log("healthGDP_vs_deaths_data()");

      var jsonArray = [];
      resetGraphSpace()

      for (country in covidDeathData) {
            if (country == "$World")
                  break;
            if (covidDeathData[country] > 0 && above55Data[country] > 0)
                  addCountryItem55(jsonArray, country, covidDeathData[country], above55Data[country])
      }

      drawGraphOver55(jsonArray);
      addLabels("Number of deaths (as of yesterday)", "% of population over 55")
}

function addCountryItem55(jsonArray, country, deaths, peopleAbove55) {
      jsonArray.push({
          "country": country,
          "deaths": deaths ,
          "peopleAbove55": peopleAbove55
      });
  }

function drawGraphOver55(jsonArray) {
      
      console.log("drawGraphOver55()")
      
      var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      var xOver55 = d3.scaleLog()
      .domain([0.1, 1000000])
      .range([0, width]);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xOver55)
      .tickValues([1,10,100,1000,10000,100000, 1000000])
      .tickFormat(d3.format("d")));

      // Add Y axis
      var yOver55 = d3.scaleLinear()
      .domain([0,50])
      .range([ height, 0]);

      svg.append("g")
      .call(d3.axisLeft(yOver55));

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
            .html(d["country"] + "<br/> Deaths: " + d["deaths"]+ "<br/> % of people over 55: " + d["peopleAbove55"])
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
      .attr("cx", d => xOver55(d["deaths"]))
      .attr("cy", d => yOver55(d["peopleAbove55"]))
      .attr("r", 7)
      .style("fill", "red")
      .style("opacity", .4)
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )     
}
