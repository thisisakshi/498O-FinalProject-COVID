function hospitalBeds_vs_deaths_data() {
      console.log("hospitalBeds_vs_deaths_data()");
      resetGraphSpace()
      var jsonArray = [];

      for (country in covidDeathData) {
            if (country == "$World")
                  break;
            if (covidDeathData[country] > 0 && hospitalBedsData[country] > 0)
                  addCountryItemBeds(jsonArray, country, covidDeathData[country], hospitalBedsData[country])
      }

      drawGraphBeds(jsonArray);
      addLabels("Number of deaths (as of yesterday)", "# of hospital beds per 100k")
}

function addCountryItemBeds(jsonArray, country, deaths, noOfBeds) {
      jsonArray.push({
          "country": country,
          "deaths": deaths ,
          "noOfBeds": noOfBeds
      });
  }

function drawGraphBeds(jsonArray) {
      
      console.log("drawGraph()")
      
      var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      var x = d3.scaleLog()
      .domain([0.1, 1000000])
      .range([0, width]);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .tickValues([1,10,100,1000,10000,100000, 1000000])
      .tickFormat(d3.format("d")));

      // Add Y axis
      var y = d3.scaleLinear()
      .domain([0,16])
      .range([ height, 0]);

      svg.append("g")
      .call(d3.axisLeft(y));

      var tooltip = d3.select("#vis-container").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

              // tooltip mouseover event handler
              var tipMouseover = function(d) {
                  var color = "black";
                  var html  = 
                  "<span><b>"+d.country+"</b><br/>" + 
                  "<span style='color:" + color + ";'>Deaths: " + d.deaths + "</span><br/>" + 
                  "<span style='color:" + color + ";'>Beds per 100K: " + d.noOfBeds + "</span><br/>";

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
      .attr("cx", d => x(d["deaths"]))
      .attr("cy", d => y(d["noOfBeds"]))
      .attr("r", 7)
      .style("fill", "red")
      .style("opacity", .4)
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);        
}
