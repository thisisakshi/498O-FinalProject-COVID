var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var above55Data = new d3.map();
var covidData = new d3.map();
var healthData = new d3.map();

// Loading all the data
d3.queue()
      .defer(d3.csv, "https://raw.githubusercontent.com/eliasdabbas/life_expectancy/master/data/country_data_master.csv", 
            function(d) {above55Data.set(d["country"], +d['age_55-64_perc'] + +d['age_65+_perc'])})
      .defer(d3.csv, "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", 
            function(d) {covidData.set(d.location, +d.total_deaths);})
      .defer(d3.json, "http://localhost:8080/", 
            function(d) {
                  for (i = 0; i < d.length; i++) {
                        healthData.set(d[i]["Country"], +d[i]["2017"])
                  }  
            })
      .await(ready);

function ready() {
      console.log("Data Loaded")
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
