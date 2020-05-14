var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


var lineData;

var covidDeathData = new d3.map();
var covidConfirmedData = new d3.map();
var covidRecoveredData = new d3.map();

var above55Data = new d3.map();
var healthData = new d3.map();
var hospitalBedsData = new d3.map()
var handwashingStationData = new d3.map()
var covidData = new d3.map()
var codeToCountry = new d3.map()

function resetGraphSpace() {
      d3.selectAll("svg").remove();
      d3.selectAll(".line").remove();
      d3.selectAll(".curve").remove();
      d3.selectAll(".d3-tip").remove();
      d3.selectAll(".tooltip").remove();
  }

// Loading all the data
d3.queue()
      .defer(d3.csv, "https://raw.githubusercontent.com/eliasdabbas/life_expectancy/master/data/country_data_master.csv", 
            function(d) {above55Data.set(d["country"], +d['age_55-64_perc'] + +d['age_65+_perc'])})
      .defer(d3.csv, "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", 
            function(d) {
                  hospitalBedsData.set(d["location"], +d["hospital_beds_per_100k"])
                  handwashingStationData.set(d["location"], +d["handwashing_facilities"])
                  codeToCountry.set(d["iso_code"],d["location"]) 
            })
      .defer(d3.json, "http://localhost:8080/", 
            function(d) {
                  for (i = 0; i < d.length; i++) {
                        healthData.set(d[i]["Country"], +d[i]["2017"])
                  }  
            })
      .defer(d3.json,"https://pomber.github.io/covid19/timeseries.json", 
            function(d) {
                  for (x in d) {
                        var len = d[x].length;
                        if (x == "US") {
                              country = "United States";
                        } else {
                              country = x;
                        }
                        covidConfirmedData.set(country, d[x][len - 1]["confirmed"]);
                        covidRecoveredData.set(country, d[x][len - 1]["recovered"]);
                        covidDeathData.set(country, d[x][len - 1]["deaths"]);       
                  } 
                  lineData = d;

                  
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


