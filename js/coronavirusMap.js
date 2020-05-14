coronavirus();

function clickHandler(d) {
  cvLineGraph(d.properties.name);
}

function coronavirus() {
  //console.log("coronavirusMap()")
  // resetGraphSpace();
  d3.selectAll("svg").remove();
  d3.selectAll(".curve").remove();
  d3.selectAll(".d3-tip").remove();
  d3.selectAll(".tooltip").remove();
  
  // The svg
  var svg = d3.select(".tableRight")
    .append("svg").attr("width", 800).attr("height", 600),
    width = +svg.attr("width"),
    height = +svg.attr("height");
  
  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoMercator()
      .scale(100)
      .center([0,40])
      .translate([width / 2, height / 2]);
  
  // Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleThreshold()
    .domain([10, 100, 1000, 10000, 100000, 1000000])
    .range(d3.schemeReds[7]);

  // Legend
  var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");

  g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Confirmed Cases");

  var labels = ['< 10', '< 100', '< 1k', '< 10k', '< 100k', '< 1M', '> 1M'];

  var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
    svg.select(".legendThreshold")
    .call(legend);

  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", function(d) {data.set(d.iso_code, +d.total_cases);})
    .await(ready);

  function ready(error, topo) {
    
    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + codeToCountry.get(d.id) + "<br></span>" + "<strong>Confirmed Cases: </strong><span class='details'>" + d.total + "</span>";
            })
    svg.call(tip);
    

      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
          // draw each country
        .attr("d", d3.geoPath().projection(projection))
          // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            if (d.total == 0) {
              return "#ccc";
            }
            else {
              return colorScale(d.total);
            }
          })
        .on("click", clickHandler)

        // tooltips
        .style("stroke","white") 
        .style('stroke-width', 0.3)

        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","#383838")
            .style("stroke-width",1);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });
        }
}


  