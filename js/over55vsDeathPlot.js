var jsonArray = [];
var above55Data = new d3.map();
var covidData = new d3.map();

var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

d3.queue()
      .defer(d3.csv, "https://raw.githubusercontent.com/eliasdabbas/life_expectancy/master/data/country_data_master.csv", 
            function(d) {above55Data.set(d["country"], +d['age_55-64_perc'] + +d['age_65+_perc'])})
      .defer(d3.csv, "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", 
            function(d) {covidData.set(d.location, +d.total_deaths);})
      .await(ready);

function ready() {
      console.log("Data Loaded")
}
function olderpopulation_vs_deaths_data() {
      console.log("healthGDP_vs_deaths_data()");
      console.log(covidData);
      console.log(above55Data);

      for (country in covidData) {
            if (country == "$World")
                  break;
            if (covidData[country] > 0 && above55Data[country] > 0)
                  addCountryItem(country, covidData[country], above55Data[country])
      }

      // console.log("CHECK JsonArray: " + jsonArray[0]["country"])

      drawGraph();
      addLabels("Number of deaths (as of yesterday)", "% of population over 55")
}

function addCountryItem(country, deaths, peopleAbove55) {
      console.log(country+" , "+deaths+" , "+peopleAbove55+"\n");
      jsonArray.push({
          "country": country,
          "deaths": deaths ,
          "peopleAbove55": peopleAbove55
      });
  }

function drawGraph() {
      
      console.log("drawGraph()")
      d3.select("svg").remove();
      
      var svg = d3.select(".tableRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      var x = d3.scaleLog()
      .domain([1, 1000000])
      .range([0, width]);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .tickValues([1,10,100,1000,10000,100000, 1000000])
      .tickFormat(d3.format("d")));

      // Add Y axis
      var y = d3.scaleLinear()
      .domain([0,50])
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
      .attr("cx", d => x(d["deaths"]))
      .attr("cy", d => y(d["peopleAbove55"]))
      .attr("r", 7)
      .style("fill", "red")
      .style("opacity", .4)
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )     
}

function addLabels(key1, key2) {
      console.log("ADDING LABELS");
  
      // X-Axis
      d3.select('svg').append("text")
            .attr("x", width/2)
            .attr("y", 600)
            .attr("text-anchor", "start")
            .style("font-size", "16px") 
            .text(key1);
  
      // Y-Axis
      d3.select('svg').append("text")
            .attr("transform", `rotate(-90)`)
            .attr("x", -250)
            .attr("y", 15)
            .attr("dy", "1em")
            .attr("text-anchor", "end")
            .style("font-size", "16px") 
            .text(key2);
  }

