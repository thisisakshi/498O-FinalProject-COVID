function healthGDP_vs_deaths_data() {
      console.log("healthGDP_vs_deaths_data()");
      resetGraphSpace()
      var jsonArray = [];
      
      console.log(covidDeathData);

      for (country in covidDeathData) {
            
            if (covidDeathData[country] > 0 && healthData[country] > 0) {
                  
                  addCountryItemGDP(jsonArray, country, +covidDeathData[country], +healthData[country])
      
            }
      }

      drawGraphGDP(jsonArray);
      addLabels("Number of deaths (as of yesterday)", "Health GDP %")
}

function addCountryItemGDP(jsonArray, country, deaths, health) {
      console.log("HELLOOO");
      jsonArray.push({
          "country": country,
          "deaths": deaths ,
          "healthGDP": health
      });
  }

function drawGraphGDP(jsonArray) {
      
      console.log("drawGraphGDP()")
      
      var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      let xGDP = d3.scaleLog()
      .domain([0.1, 1000000])
      .range([0, width]);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xGDP)
      .tickValues([1,10,100,1000,10000,100000, 1000000])
      .tickFormat(d3.format("d")));

      // Add Y axis
      let yGDP = d3.scaleLinear()
      .domain([0,20])
      .range([ height, 0]);

      svg.append("g")
      .call(d3.axisLeft(yGDP));

      var tooltip = d3.select("#vis-container").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
      var color = "black";
      var html  = 
      "<span><b>"+d.country+"</b><br/>" + 
      "<span style='color:" + color + ";'>Deaths: " + d.deaths + "</span><br/>" + 
      "<span style='color:" + color + ";'>Health GDP (%): " + +d.healthGDP + "</span><br/>";

      tooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
        .transition()
          .duration(200) // ms
          .style("opacity", .9) // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
  };

     

      svg.append('g')
      .selectAll("dot")
      .data(jsonArray)
      .enter()
      .append("circle")
      .attr("id", "circleBasicTooltip")
      .attr("cx", d => xGDP(d["deaths"]))
      .attr("cy", d => yGDP(d["healthGDP"]))
      .attr("r", 7)
      .style("fill", "blue")
      .style("opacity", .4) 
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);      
}
