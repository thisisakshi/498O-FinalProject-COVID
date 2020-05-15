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
          "country": country.substr(1),
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

      // Add the tooltip container to the vis container
              // it's invisible and its position/contents are defined during mouseover
              var tooltip = d3.select("#vis-container").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

              // tooltip mouseover event handler
              var tipMouseover = function(d) {
                  var color = "black";
                  var html  = 
                  "<span><b>"+d.country+"</b><br/>" + 
                  "<span style='color:" + color + ";'>Deaths: " + d.deaths + "</span><br/>" + 
                  "<span style='color:" + color + ";'>55 and up (%): " + d.peopleAbove55 + "</span><br/>";

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
      .attr("cx", d => xOver55(d["deaths"]))
      .attr("cy", d => yOver55(d["peopleAbove55"]))
      .attr("r", 7)
      .style("fill", "red")
      .style("opacity", .4)
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);   
}
